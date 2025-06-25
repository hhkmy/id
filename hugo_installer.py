#!/usr/bin/env python3
import os
import platform
import re
import subprocess
import sys
import tarfile
import requests
from pathlib import Path
from typing import Optional, Tuple

# Constants
HUGO_RELEASES_URL = "https://api.github.com/repos/gohugoio/hugo/releases/latest"
INSTALL_DIR = "/usr/local/bin"
HUGO_BIN_PATH = f"{INSTALL_DIR}/hugo"
TEMP_DIR = "/tmp/hugo_install"

# Emojis for messages
E_INFO = "ℹ️"
E_SUCCESS = "✅"
E_WARNING = "⚠️"
E_ERROR = "❌"
E_DOWNLOAD = "📥"
E_EXTRACT = "📦"
E_CHECK = "🔍"
E_UPDATE = "🔄"

def print_color(message: str, color: str = "reset") -> None:
    """Print colored messages to the terminal."""
    colors = {
        "red": "\033[91m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "magenta": "\033[95m",
        "cyan": "\033[96m",
        "reset": "\033[0m",
    }
    print(f"{colors.get(color, colors['reset'])}{message}{colors['reset']}")

def get_system_info() -> Tuple[str, str, str]:
    """Detect system architecture and platform."""
    machine = platform.machine().lower()
    system = platform.system().lower()

    # Map common architectures
    arch_map = {
        "x86_64": "amd64",
        "amd64": "amd64",
        "i386": "386",
        "i686": "386",
        "arm64": "arm64",
        "aarch64": "arm64",
    }

    architecture = arch_map.get(machine, machine)
    return system, architecture, machine

def get_latest_hugo_release() -> Tuple[Optional[str], Optional[str]]:
    """Get the latest Hugo Extended release info from GitHub."""
    try:
        print(f"{E_CHECK} {E_INFO} Checking for latest Hugo Extended release...")
        response = requests.get(HUGO_RELEASES_URL)
        response.raise_for_status()
        data = response.json()

        version = data["tag_name"].lstrip("v")
        print(f"{E_INFO} Latest version found: {version}")

        # Find the extended version download URL
        for asset in data["assets"]:
            if "Linux-64bit.tar.gz" in asset["name"] and "extended" in asset["name"].lower():
                return version, asset["browser_download_url"]
        
        return None, None
    except Exception as e:
        print(f"{E_ERROR} Failed to get latest release info: {e}")
        return None, None

def get_current_hugo_version() -> Optional[str]:
    """Get the currently installed Hugo version."""
    try:
        result = subprocess.run([HUGO_BIN_PATH, "version"], capture_output=True, text=True)
        if result.returncode == 0:
            match = re.search(r"v(\d+\.\d+\.\d+)", result.stdout)
            if match:
                return match.group(1)
    except FileNotFoundError:
        pass
    return None

def download_and_install_hugo(version: str, download_url: str) -> bool:
    """Download and install Hugo Extended."""
    try:
        # Create temp directory
        Path(TEMP_DIR).mkdir(parents=True, exist_ok=True)
        tar_path = f"{TEMP_DIR}/hugo_{version}.tar.gz"

        # Download the release
        print(f"{E_DOWNLOAD} Downloading Hugo Extended {version}...")
        response = requests.get(download_url, stream=True)
        response.raise_for_status()
        
        with open(tar_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        # Extract the archive
        print(f"{E_EXTRACT} Extracting Hugo binary...")
        with tarfile.open(tar_path, "r:gz") as tar:
            for member in tar.getmembers():
                if member.name.endswith("hugo"):
                    member.name = os.path.basename(member.name)
                    tar.extract(member, path=TEMP_DIR)
                    break

        # Install the binary
        print(f"{E_INFO} Installing Hugo to {INSTALL_DIR}...")
        extracted_bin = f"{TEMP_DIR}/hugo"
        os.chmod(extracted_bin, 0o755)  # Make executable
        
        # Move to install directory (requires sudo)
        if os.geteuid() != 0:
            print(f"{E_WARNING} Need root privileges to install to {INSTALL_DIR}")
            subprocess.run(["sudo", "mv", extracted_bin, HUGO_BIN_PATH], check=True)
            subprocess.run(["sudo", "chmod", "755", HUGO_BIN_PATH], check=True)
        else:
            subprocess.run(["mv", extracted_bin, HUGO_BIN_PATH], check=True)
            subprocess.run(["chmod", "755", HUGO_BIN_PATH], check=True)

        # Clean up
        subprocess.run(["rm", "-rf", TEMP_DIR], check=True)
        
        return True
    except Exception as e:
        print(f"{E_ERROR} Installation failed: {e}")
        return False

def main():
    print_color(f"\n{E_INFO} Hugo Extended Auto-Installer for Linux", "cyan")
    print_color("=" * 40, "cyan")
    
    # Check system compatibility
    system, architecture, machine = get_system_info()
    print(f"{E_INFO} System: {system}, Architecture: {architecture} ({machine})")
    
    if system != "linux":
        print(f"{E_ERROR} This script only supports Linux systems.")
        sys.exit(1)
    
    if architecture not in ["amd64", "arm64"]:
        print(f"{E_ERROR} Unsupported architecture: {architecture}")
        sys.exit(1)
    
    # Get latest release info
    latest_version, download_url = get_latest_hugo_release()
    if not latest_version or not download_url:
        print(f"{E_ERROR} Could not find Hugo Extended release for your system.")
        sys.exit(1)
    
    # Check current version
    current_version = get_current_hugo_version()
    if current_version:
        print(f"{E_INFO} Current Hugo version: {current_version}")
        
        if current_version == latest_version:
            print(f"{E_SUCCESS} You already have the latest version ({latest_version}) installed!")
            sys.exit(0)
        else:
            print(f"{E_UPDATE} New version available: {latest_version} (current: {current_version})")
    else:
        print(f"{E_INFO} Hugo is not currently installed. Installing version {latest_version}...")
    
    # Download and install
    if download_and_install_hugo(latest_version, download_url):
        print(f"\n{E_SUCCESS} Hugo Extended {latest_version} installed successfully!")
        
        # Verify installation
        print(f"\n{E_CHECK} Verifying installation...")
        try:
            result = subprocess.run([HUGO_BIN_PATH, "version"], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"{E_SUCCESS} {result.stdout.strip()}")
            else:
                print(f"{E_WARNING} Hugo installed but version check failed")
        except Exception as e:
            print(f"{E_WARNING} Verification failed: {e}")
    else:
        print(f"{E_ERROR} Installation failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
