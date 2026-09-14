#!/bin/bash
# ==============================================================================
# Script: fix-touchpad.sh
# Description: Checks if the Synaptics I2C touchpad is attached.
#              If the driver probe timed out during boot, it reloads i2c_hid_acpi.
# ==============================================================================

TOUCHPAD_DEVICE="i2c-SYNA3067:00"
SYSFS_PATH="/sys/bus/i2c/devices/${TOUCHPAD_DEVICE}"

# Check if the touchpad hardware device is declared in ACPI/I2C
if [ -d "${SYSFS_PATH}" ]; then
    # Check if the driver is bound
    if [ ! -d "${SYSFS_PATH}/driver" ]; then
        logger -t fix-touchpad "Touchpad (${TOUCHPAD_DEVICE}) driver not bound (probe timeout). Reloading i2c_hid_acpi..."
        /sbin/modprobe -r i2c_hid_acpi 2>/dev/null
        sleep 1
        /sbin/modprobe i2c_hid_acpi
        logger -t fix-touchpad "i2c_hid_acpi reloaded successfully."
    else
        logger -t fix-touchpad "Touchpad (${TOUCHPAD_DEVICE}) is already bound and operating."
    fi
else
    logger -t fix-touchpad "No ${TOUCHPAD_DEVICE} found in /sys/bus/i2c/devices/."
fi
