#!/bin/sh
# ==============================================================================
# Hook: /lib/systemd/system-sleep/touchpad-resume.sh
# Description: Checks and re-initializes touchpad after waking from sleep/suspend.
# ==============================================================================

case "$1" in
    post)
        /usr/local/bin/fix-touchpad.sh
        ;;
    *)
        ;;
esac
