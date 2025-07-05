package main

import (
	"archive/tar"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// 🎨 Terminal colors
const (
	colorReset   = "\033[0m"
	colorRed     = "\033[31m"
	colorGreen   = "\033[32m"
	colorYellow  = "\033[33m"
	colorBlue    = "\033[34m"
	colorMagenta = "\033[35m"
	colorCyan    = "\033[36m"
)

// 🌐 Constants
const (
	goVersionsURL     = "https://golang.org/dl/?mode=json"
	goDownloadBase    = "https://go.dev/dl/"
	defaultInstallDir = "/usr/local"
)

// 📦 Struct for Go version information
type GoVersion struct {
	Version string `json:"version"`
	Stable  bool   `json:"stable"`
	Files   []struct {
		OS     string `json:"os"`
		Arch   string `json:"arch"`
		SHA256 string `json:"sha256"`
	} `json:"files"`
}

func main() {
	printBanner()
	printSystemInfo()

	version, err := getLatestStableVersion()
	if err != nil {
		exitWithError(fmt.Errorf("failed to get Go version: %v", err))
	}

	// Check current Go version
	currentVersion := ""
	cmd := exec.Command("go", "version")
	if output, err := cmd.CombinedOutput(); err == nil {
		fields := strings.Fields(string(output))
		if len(fields) >= 3 && strings.HasPrefix(fields[2], "go") {
			currentVersion = fields[2]
		}
	}

	if currentVersion == version {
		fmt.Printf("\n%s✔️  Go %s is already installed. No update needed.%s\n", colorGreen, version, colorReset)
		return
	}

	if err := installGo(version); err != nil {
		exitWithError(fmt.Errorf("installation failed: %v", err))
	}

	verifyInstallation(version)
	printSuccess(version)
}

func printBanner() {
	fmt.Printf("\n%s╔════════════════════════════════════════╗", colorMagenta)
	fmt.Printf("\n║   🚀 Go Version Manager (GVM) %sv1.2.0%s   ║", colorYellow, colorMagenta)
	fmt.Printf("\n╚════════════════════════════════════════╝%s\n", colorReset)
}

func printSystemInfo() {
	fmt.Printf("\n%s🖥️  System Information%s", colorCyan, colorReset)
	fmt.Printf("\n  OS:           %s%s%s", colorYellow, runtime.GOOS, colorReset)
	fmt.Printf("\n  Architecture: %s%s%s", colorYellow, runtime.GOARCH, colorReset)
	fmt.Printf("\n  CPUs:         %s%d%s\n", colorYellow, runtime.NumCPU(), colorReset)
}

func getLatestStableVersion() (string, error) {
	fmt.Printf("\n%s🔍 Fetching latest Go version...%s", colorBlue, colorReset)

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Get(goVersionsURL)
	if err != nil {
		return "", fmt.Errorf("network error: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("server returned: %s", resp.Status)
	}

	var versions []GoVersion
	if err := json.NewDecoder(resp.Body).Decode(&versions); err != nil {
		return "", fmt.Errorf("failed to parse version data: %v", err)
	}

	for _, v := range versions {
		if v.Stable {
			fmt.Printf("\n%s✅ Found stable version: %s%s%s\n", colorGreen, colorYellow, v.Version, colorReset)
			return v.Version, nil
		}
	}

	return "", fmt.Errorf("no stable versions available")
}

func installGo(version string) error {
	// Determine system parameters
	osName := map[string]string{
		"darwin":  "darwin",
		"linux":   "linux",
		"windows": "windows",
	}[runtime.GOOS]

	arch := runtime.GOARCH
	if arch == "arm" {
		arch = "armv6l" // Default for ARM devices like Raspberry Pi
	}

	// Construct download URL
	pkgName := fmt.Sprintf("%s.%s-%s.tar.gz", version, osName, arch)
	downloadURL := goDownloadBase + pkgName
	tempFile := filepath.Join(os.TempDir(), pkgName)

	fmt.Printf("\n%s📦 Downloading Go %s...%s", colorBlue, version, colorReset)
	fmt.Printf("\n  From: %s%s%s", colorYellow, downloadURL, colorReset)

	// Download the package
	if err := downloadWithProgress(downloadURL, tempFile); err != nil {
		return fmt.Errorf("download failed: %v", err)
	}

	// Determine install location
	installDir := defaultInstallDir
	if os.Geteuid() != 0 {
		home, err := os.UserHomeDir()
		if err != nil {
			return fmt.Errorf("failed to find home directory: %v", err)
		}
		installDir = filepath.Join(home, "go")
		fmt.Printf("\n%s⚠️  Installing as non-root user to: %s%s%s", colorYellow, colorCyan, installDir, colorReset)
	}

	// Clean previous installation
	if err := cleanPreviousInstall(installDir); err != nil {
		return fmt.Errorf("cleanup failed: %v", err)
	}

	// Extract the archive
	fmt.Printf("\n%s⚙️  Installing to %s...%s", colorBlue, installDir, colorReset)
	if err := extractTarGz(tempFile, installDir); err != nil {
		return fmt.Errorf("extraction failed: %v", err)
	}

	// Update PATH in shell config
	if err := updatePath(installDir); err != nil {
		fmt.Printf("\n%s⚠️  Couldn't update PATH automatically: %v%s", colorYellow, err, colorReset)
		fmt.Printf("\n  Please add %s to your PATH", filepath.Join(installDir, "go", "bin"))
	}

	// Clean up
	os.Remove(tempFile)
	return nil
}

func downloadWithProgress(url, filepath string) error {
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("server returned: %s", resp.Status)
	}

	// Track download progress
	progress := &progressWriter{
		Total:    resp.ContentLength,
		Progress: 0,
	}

	_, err = io.Copy(out, io.TeeReader(resp.Body, progress))
	return err
}

type progressWriter struct {
	Total    int64
	Progress int64
}

func (pw *progressWriter) Write(p []byte) (int, error) {
	n := len(p)
	pw.Progress += int64(n)
	pw.print()
	return n, nil
}

func (pw *progressWriter) print() {
	if pw.Total <= 0 {
		return
	}
	percent := float64(pw.Progress) / float64(pw.Total) * 100
	fmt.Printf("\r  Progress: %s%.2f%%%s", colorYellow, percent, colorReset)
	if pw.Progress == pw.Total {
		fmt.Println()
	}
}

func cleanPreviousInstall(installDir string) error {
	goPath := filepath.Join(installDir, "go")
	if _, err := os.Stat(goPath); err == nil {
		fmt.Printf("\n%s♻️  Removing previous installation...%s", colorBlue, colorReset)
		return os.RemoveAll(goPath)
	}
	return nil
}

func extractTarGz(src, dst string) error {
	file, err := os.Open(src)
	if err != nil {
		return err
	}
	defer file.Close()

	gzr, err := gzip.NewReader(file)
	if err != nil {
		return err
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)
	for {
		header, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		// Remove the top-level "go/" directory from the path
		relPath := strings.TrimPrefix(header.Name, "go/")
		if relPath == "" || strings.HasPrefix(relPath, "../") {
			// Skip the top-level dir or any unsafe paths
			continue
		}
		target := filepath.Join(dst, relPath)
		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(target, 0755); err != nil {
				return err
			}
		case tar.TypeReg:
			if err := os.MkdirAll(filepath.Dir(target), 0755); err != nil {
				return err
			}
			outFile, err := os.Create(target)
			if err != nil {
				return err
			}
			if _, err := io.Copy(outFile, tr); err != nil {
				outFile.Close()
				return err
			}
			outFile.Close()
			if err := os.Chmod(target, os.FileMode(header.Mode)); err != nil {
				return err
			}
		}
	}
	return nil
}

func updatePath(installDir string) error {
	goBin := filepath.Join(installDir, "bin")
	pathAddition := fmt.Sprintf("\nexport PATH=$PATH:%s\n", goBin)

	var rcFile string
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	shell := os.Getenv("SHELL")
	switch {
	case strings.Contains(shell, "zsh"):
		rcFile = filepath.Join(home, ".zshrc")
	case strings.Contains(shell, "bash"):
		rcFile = filepath.Join(home, ".bashrc")
	case strings.Contains(shell, "fish"):
		rcFile = filepath.Join(home, ".config", "fish", "config.fish")
		pathAddition = fmt.Sprintf("\nset -gx PATH $PATH %s\n", goBin)
	default:
		return fmt.Errorf("unknown shell: %s", shell)
	}

	var content []byte
	if f, err := os.Open(rcFile); err == nil {
		content, _ = io.ReadAll(f)
		f.Close()
	}

	if !strings.Contains(string(content), goBin) {
		file, err := os.OpenFile(rcFile, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0644)
		if err != nil {
			return err
		}
		defer file.Close()
		if _, err := file.WriteString(pathAddition); err != nil {
			return err
		}
		fmt.Printf("\n%s➕ Added to PATH in %s%s", colorGreen, rcFile, colorReset)
	}
	return nil
}

func verifyInstallation(version string) {
	fmt.Printf("\n%s🔍 Verifying installation...%s", colorBlue, colorReset)

	cmd := exec.Command("go", "version")
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("\n%s❌ Go command not found in PATH%s", colorRed, colorReset)
		return
	}

	if !strings.Contains(string(output), version) {
		fmt.Printf("\n%s⚠️  Version mismatch: expected %s, got %s%s",
			colorYellow, version, strings.TrimSpace(string(output)), colorReset)
		return
	}

	fmt.Printf("\n%s✅ %s%s", colorGreen, strings.TrimSpace(string(output)), colorReset)
}

func printSuccess(version string) {
	fmt.Printf("\n\n%s🎉 Successfully installed Go %s!%s", colorGreen, version, colorReset)
	fmt.Printf("\n%sTo start using Go, you may need to:", colorYellow)
	fmt.Printf("\n  - Restart your terminal")
	fmt.Printf("\n  - Run %ssource ~/.bashrc%s (or your shell config)", colorCyan, colorReset)
	fmt.Printf("\n  - Test with %sgo version%s\n\n", colorCyan, colorReset)
}

func exitWithError(err error) {
	fmt.Printf("\n%s❌ Error: %v%s\n\n", colorRed, err, colorReset)
	os.Exit(1)
}
