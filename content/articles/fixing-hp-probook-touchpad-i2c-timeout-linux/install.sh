#!/bin/bash
# ==============================================================================
# Installation Script for Synaptics I2C Touchpad Fix
# ==============================================================================

set -e

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo bash install.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[*] Installing fix-touchpad.sh to /usr/local/bin/..."
cp "${SCRIPT_DIR}/fix-touchpad.sh" /usr/local/bin/fix-touchpad.sh
chmod +x /usr/local/bin/fix-touchpad.sh

echo "[*] Installing systemd service..."
cp "${SCRIPT_DIR}/fix-touchpad.service" /etc/systemd/system/fix-touchpad.service
systemctl daemon-reload
systemctl enable fix-touchpad.service

echo "[*] Installing suspend/resume sleep hook..."
mkdir -p /lib/systemd/system-sleep
cp "${SCRIPT_DIR}/touchpad-resume.sh" /lib/systemd/system-sleep/touchpad-resume.sh
chmod +x /lib/systemd/system-sleep/touchpad-resume.sh

echo "[*] Executing fix-touchpad.sh now..."
/usr/local/bin/fix-touchpad.sh

echo "[+] Installation complete! Your touchpad is configured and will automatically recover across reboots and sleep."
