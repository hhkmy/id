#!/bin/bash

# 🎨 Color and emoji variables
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
CHECK="✅"
INFO="ℹ️"
WARN="⚠️"
ROCKET="🚀"
DOWNLOAD="📥"
GEAR="⚙️"
HOURGLASS="⏳"
PARTY="🎉"
MAG="🔍"

# 📌 Configuration
HUGO_REPO="gohugoio/hugo"
HUGO_TYPE="hugo_extended" # We want the extended version
INSTALL_DIR="/usr/local/bin"
TMP_DIR=$(mktemp -d)

# 🔍 Detect OS and architecture
echo -e "${INFO} ${RED} Detecting${NC} your system..."

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Normalize architecture names
case $ARCH in
    x86_64)
        ARCH="amd64"
        ;;
    aarch64|arm64)
        ARCH="arm64"
        ;;
    i386|i686)
        ARCH="386"
        ;;
    *)
        echo -e "${WARN} ${YELLOW}Unsupported architecture: $ARCH${NC}"
        exit 1
        ;;
esac

# Normalize OS names
case $OS in
    linux)
        OS="Linux"
        ;;
    darwin)
        OS="macOS"
        ;;
    *)
        echo -e "${WARN} ${YELLOW}Unsupported OS: $OS${NC}"
        exit 1
        ;;
esac

echo -e "${CHECK} ${GREEN}Detected: $OS $ARCH${NC}"

# 🕵️ Check existing Hugo installation
CURRENT_VERSION=""
if command -v hugo &> /dev/null; then
    CURRENT_VERSION=$(hugo version | grep -oP 'v\d+\.\d+\.\d+')
    echo -e "${INFO} ${BLUE} Found existing Hugo installation:${NC} ${CURRENT_VERSION}"
else
    echo -e "${INFO} ${BLUE}No existing Hugo installation found.${NC}"
fi

# 📡 Fetch latest release info from GitHub API
echo -e "${HOURGLASS} ${BLUE}Checking for latest Hugo Extended release...${NC}"

LATEST_RELEASE=$(curl -s "https://api.github.com/repos/$HUGO_REPO/releases/latest")
LATEST_VERSION=$(echo "$LATEST_RELEASE" | grep -oP '"tag_name": "\Kv\d+\.\d+\.\d+')

if [ -z "$LATEST_VERSION" ]; then
    echo -e "${WARN} ${RED}Failed to fetch latest version!${NC}"
    exit 1
fi

echo -e "${CHECK} ${GREEN}Latest Hugo Extended version:${NC} ${LATEST_VERSION}"

# 🔄 Check if update is needed
if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ]; then
    echo -e "${PARTY} ${GREEN}You already have the latest version!${NC} (${CURRENT_VERSION})"
    exit 0
elif [ -n "$CURRENT_VERSION" ]; then
    echo -e "${INFO} ${YELLOW}Updating from ${CURRENT_VERSION} to ${LATEST_VERSION}${NC}"
fi

# 📥 Download the appropriate binary
ASSET_NAME="${HUGO_TYPE}_${LATEST_VERSION}_${OS}-${ARCH}.tar.gz"
DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | grep -oP "browser_download_url.*\Khttps://.*${ASSET_NAME}")

if [ -z "$DOWNLOAD_URL" ]; then
    echo -e "${WARN} ${RED}Could not find download URL for your system!${NC}"
    echo -e "${INFO} ${YELLOW}Tried to find: ${ASSET_NAME}${NC}"
    exit 1
fi

echo -e "${DOWNLOAD} ${BLUE}Downloading Hugo Extended ${LATEST_VERSION}...${NC}"
curl -sL "$DOWNLOAD_URL" -o "$TMP_DIR/hugo.tar.gz" || {
    echo -e "${WARN} ${RED}Download failed!${NC}"
    exit 1
}

# 📦 Extract and install
echo -e "${GEAR} ${BLUE}Installing Hugo...${NC}"
tar -xzf "$TMP_DIR/hugo.tar.gz" -C "$TMP_DIR"

# Check if we need sudo for installation
if [ -w "$INSTALL_DIR" ]; then
    SUDO=""
else
    SUDO="sudo"
    echo -e "${INFO} ${YELLOW}Requires sudo to install to $INSTALL_DIR${NC}"
fi

$SUDO mv "$TMP_DIR/hugo" "$INSTALL_DIR/hugo"
$SUDO chmod +x "$INSTALL_DIR/hugo"

# 🧹 Clean up
rm -rf "$TMP_DIR"

# ✅ Verify installation
if command -v hugo &> /dev/null; then
    INSTALLED_VERSION=$(hugo version)
    echo -e "${PARTY} ${GREEN}Successfully installed Hugo Extended!${NC}"
    echo -e "${CHECK} ${BLUE}${INSTALLED_VERSION}${NC}"
    echo -e "${ROCKET} ${GREEN}Happy static site building!${NC}"
else
    echo -e "${WARN} ${RED}Installation seems to have failed. Hugo command not found.${NC}"
    exit 1
fi