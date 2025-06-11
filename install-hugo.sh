#!/bin/bash
# Official Hugo Extended Installer (Latest Version)

set -e

# Configuration
HUGO_TYPE="extended"          # Only install extended version
INSTALL_DIR="/usr/local/bin"  # System-wide installation
TEMP_DIR=$(mktemp -d)        # Secure temp directory

# Architecture detection
ARCH=$(uname -m)
case "$ARCH" in
    x86_64)  ARCH="64bit";;
    aarch64) ARCH="ARM64";;
    armv7l)  ARCH="ARM";;
    *) echo "❌ Unsupported architecture: $ARCH"; exit 1;;
esac

cleanup() {
    rm -rf "$TEMP_DIR"
    echo "➔ Temporary files cleaned"
}
trap cleanup EXIT

# Get latest version from GitHub API
get_latest_version() {
    echo "➔ Checking latest Hugo version..."
    API_URL="https://api.github.com/repos/gohugoio/hugo/releases/latest"
    LATEST_VERSION=$(curl -s $API_URL | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
    
    [ -z "$LATEST_VERSION" ] && { echo "❌ Version check failed"; exit 1; }
    echo "✓ Latest version: v$LATEST_VERSION"
}

install_hugo() {
    DOWNLOAD_URL="https://github.com/gohugoio/hugo/releases/download/v${LATEST_VERSION}/hugo_${HUGO_TYPE}_${LATEST_VERSION}_Linux-${ARCH}.tar.gz"
    echo "➔ Downloading from: $DOWNLOAD_URL"
    
    curl -L -o "$TEMP_DIR/hugo.tar.gz" "$DOWNLOAD_URL" || {
        echo "❌ Download failed"; exit 1
    }

    echo "➔ Extracting archive..."
    tar -xzf "$TEMP_DIR/hugo.tar.gz" -C "$TEMP_DIR" || {
        echo "❌ Extraction failed"; exit 1
    }

    echo "➔ Installing to $INSTALL_DIR..."
    sudo mv "$TEMP_DIR/hugo" "$INSTALL_DIR/hugo" || {
        echo "❌ Install failed"; exit 1
    }
    sudo chmod +x "$INSTALL_DIR/hugo"
}

verify_install() {
    if ! command -v hugo &>/dev/null; then
        echo "❌ Installation verification failed"
        exit 1
    fi
    echo "✓ Successfully installed: $(hugo version)"
}

# Main execution
echo "🚀 Hugo Extended Installer (Latest Stable)"
get_latest_version
install_hugo
verify_install

echo -e "\nℹ️  Note: This installation won't auto-update."
echo "To update, simply re-run this script manually."
