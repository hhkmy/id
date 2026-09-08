---
title: "Troubleshooting and Fixing Common Boot and Startup Errors on Debian Linux"
date: 2026-09-08T17:20:00+06:30
image: "images/fastfetch.png"
thumbnail_image: "images/fastfetch.png"
description: "Debian Linux စတင်ချိန်တွင် တွေ့ရတတ်သည့် ALSA udev rules typo၊ NTPsec directory မရှိခြင်း၊ GNOME autostart အဟောင်းများနှင့် GRUB boot loglevel များကို အဆင့်ဆင့် စစ်ဆေးဖြေရှင်းခဲ့ပုံ။"
summary: "Debian တွင် ကွန်ပျူတာ Boot တက်ချိန်၌ တွေ့ရသည့် ALSA udev error၊ NTPsec directory ပြဿနာ၊ မလိုအပ်တော့သော residual package များနှင့် Hardware probe warning များကို ရှင်းလင်းပြီး Clean Boot ဖြစ်အောင် ပြုပြင်ခဲ့သည့် မှတ်တမ်း။"
categories: ["Linux", "System Administration", "Troubleshooting"]
tags: ["Debian", "systemd", "udev", "GRUB", "Troubleshooting", "Linux", "Kernel"]
series: ["Debian Troubleshooting"]
keywords: ["Debian boot error", "90-alsa-restore.rules alsa_restore_std", "ntpsec statistics directory error", "cgroupfs-mount", "tracker-miner-fs autostart error", "GRUB loglevel 3", "Linux startup troubleshooting"]
slug: "debian-boot-startup-errors-troubleshooting"
---
ကွန်ပျူတာတစ်လုံးကို နေ့စဉ် အသုံးပြုနေရင်းနဲ့ System Boot တက်လာချိန် (ဒါမှမဟုတ် စနစ်သစ် စတင် Setup လုပ်ချိန်) နောက်ကွယ်မှာ ဘာ Error တွေ၊ ဘာ Warning တွေ တက်နေသလဲဆိုတာ `journalctl` နဲ့ `dmesg` ကို ကြည့်လိုက်မှ မျက်စိစပါးမွေးစူးစရာ Error စာသားတွေကို သတိထားမိတတ်ကြပါတယ်။

Bluetooth ပြဿနာကို ရှင်းလင်းပြီးတဲ့နောက် Boot Log တစ်လျှောက်လုံးကို `journalctl -b -p 4` နဲ့ အသေးစိတ် စစ်ဆေးကြည့်တဲ့အခါ ALSA udev rules အမှား၊ NTPsec directory ပျောက်နေတာ၊ ဖျက်လိုက်ပြီးသား Package အဟောင်းတွေက ကျန်ခဲ့တဲ့ Autostart file တွေနဲ့ Hardware probe စာသားတွေ Boot screen ပေါ် ထိုးထွက်နေတာတွေကို ထပ်တွေ့ခဲ့ရတယ်။ ဒီဆောင်းပါးမှာတော့ အဆိုပါ Boot / Startup error များကို တစ်ဆင့်ချင်း အမြစ်ပြတ်အောင် စစ်ဆေးဖြေရှင်းခဲ့တဲ့ နည်းလမ်းတွေကို မှတ်တမ်းအဖြစ် မျှဝေလိုက်ပါတယ်။

![Linux Terminal Interface](images/sudo_terminal.jpg)

## The Problem: ကွန်ပျူတာ Boot တက်ချိန်တွင် တွေ့ရသည့် အခြားသော System Errors များနှင့် Warnings များ

System log များကို စစ်ဆေးကြည့်ရာ အောက်ပါ Error နှင့် Warning များကို တွေ့ရှိခဲ့ရသည်-

၁။ **ALSA Udev Rules Syntax Error:**
```text
systemd-udevd: /usr/lib/udev/rules.d/90-alsa-restore.rules:18 GOTO="alsa_restore_std" has no matching label, ignoring.
systemd-udevd: /usr/lib/udev/rules.d/90-alsa-restore.rules:22 GOTO="alsa_restore_std" has no matching label, ignoring.
```

၂။ **NTPsec Statistics Directory မရှိသည့် Error:**
```text
ntpd: statistics directory /var/log/ntpsec/ does not exist or is unwriteable, error No such file or directory
```

၃။ **GNOME Autostart Orphan Desktop Entry Warning:**
```text
gnome-session-binary: WARNING: Desktop file /etc/xdg/autostart/tracker-miner-fs-3.desktop for application tracker-miner-fs-3.desktop could not be parsed or references a missing TryExec binary
```

၄။ **Obsolete SysV Service Generator Warning:**
```text
systemd-sysv-generator: SysV service '/etc/init.d/cgroupfs-mount' lacks a native systemd unit file, automatically generating a unit file for compatibility.
```

၅။ **Screen ပေါ် တက်လာသော Hardware Probe Messages များ:**
```text
i8042: Can't reactivate KBD port
i8042: Can't write CTR while closing KBD port
hp_wmi: query 0x4 returned error 0x5
```

ဒီ Error တစ်ခုချင်းစီကို စနစ်တကျ အဆင့်ဆင့် ဖြေရှင်းခဲ့သည်။


## Step 1: ALSA Udev Rule Typo ကို Override ဖြင့် ဖြေရှင်းခြင်း (`alsa_restore_std` Missing Label)

ပထမဆုံး `systemd-udevd` က သတိပေးနေသည့် `90-alsa-restore.rules` ဖိုင်ကို ဖွင့်ကြည့်လိုက်သည်။

### Analysis:

`/usr/lib/udev/rules.d/90-alsa-restore.rules` ဖိုင်ထဲတွင် လိုင်းနံပါတ် ၁၈ နှင့် ၂၂ ၌ `GOTO="alsa_restore_std"` ဟု ရေးသားထားသော်လည်း အောက်ဘက် လိုင်းနံပါတ် ၂၆ တွင်မူ Label အမည်ကို `LABEL="alsa_restore_go"` ဟု အပေါ်မှ Label အတိုင်း Typo မှားယွင်းထည့်သွင်းထားတာ တွေ့ရသည်။ ထို့ကြောင့် udev က `alsa_restore_std` ဟူသော Label ကို ရှာမတွေ့ဘဲ Error ပြနေခြင်းဖြစ်သည်။

### The Fix:

Linux တွင် `/usr/lib/udev/rules.d/` အောက်ရှိ ဖိုင်များကို တိုက်ရိုက်ပြင်ဆင်လျှင် Package Update ဖြစ်တိုင်း မူလအတိုင်း ပြန်ဖြစ်သွားတတ်သည်။ အကောင်းဆုံး နည်းလမ်းမှာ `/etc/udev/rules.d/` အောက်သို့ ကူးယူပြီး Override ပြုလုပ်ခြင်း ဖြစ်သည်-

```bash
# 1. /etc/udev/rules.d သို့ ဖိုင်ကူးယူခြင်း
sudo cp /usr/lib/udev/rules.d/90-alsa-restore.rules /etc/udev/rules.d/90-alsa-restore.rules

# 2. လိုင်းနံပါတ် ၂၆ ရှိ မှားယွင်းနေသော Label အမည်ကို alsa_restore_std သို့ ပြင်ဆင်ခြင်း
sudo sed -i '26s/LABEL="alsa_restore_go"/LABEL="alsa_restore_std"/' /etc/udev/rules.d/90-alsa-restore.rules

# 3. Udev Rules များကို ပြန်လည် Reload လုပ်ခြင်း
sudo udevadm control --reload
```

> **ရလဒ် -** Udev reload ပြုလုပ်ပြီးနောက် `has no matching label` ဟူသော Error လုံးဝ မပေါ်တော့ပါ။


## Step 2: NTPsec Statistics Directory မရှိသည့် Error ကို ဖြေရှင်းခြင်း

ဒုတိယအချက်အနေဖြင့် Network Time Daemon (`ntpd`) စတင်ချိန်တွင် `/var/log/ntpsec/` directory ကို ရှာမတွေ့သည့် ပြဿနာကို စစ်ဆေးသည်။

### Analysis:

NTPsec daemon သည် ၎င်း၏ default configuration အရ `/var/log/ntpsec/` လမ်းကြောင်းကို စစ်ဆေးသည်။ သို့သော် အဆိုပါ ဖိုင်တွဲသည် စနစ်ထဲတွင် မရှိသောကြောင့် Error တက်နေခြင်း ဖြစ်သည်။

### The Fix:

ဖိုင်တွဲကို ကိုယ်တိုင် ဖန်တီးပေးပြီး `ntpsec:ntpsec` ownership နှင့် သင့်လျော်သော permission (`750`) သတ်မှတ်ပေးကာ Service ကို Restart ပြုလုပ်ပေးလိုက်သည်-

```bash
sudo mkdir -p /var/log/ntpsec
sudo chown ntpsec:ntpsec /var/log/ntpsec
sudo chmod 750 /var/log/ntpsec
sudo systemctl restart ntpsec
```

Service အခြေအနေ ပြန်စစ်ကြည့်သည့်အခါ-

```bash
systemctl status ntpsec
```

> **ရလဒ် -** `statistics directory does not exist` Error ပျောက်ကွယ်သွားပြီး Network Time Service သည် ပုံမှန်အတိုင်း သန့်ရှင်းစွာ အလုပ်လုပ်သွားသည်။


## Step 3: Residual Package Configuration များကို ရှင်းထုတ်ခြင်း (`tracker-miner-fs` နှင့် `cgroupfs-mount`)

တတိယအဆင့်အနေဖြင့် Desktop session စတင်ချိန်တွင် ပေါ်လာသော Tracker warning နှင့် Systemd SysV generator warning များကို စစ်ဆေးသည်။

### Analysis:

`dpkg -l | grep '^rc'` ဖြင့် စစ်ဆေးကြည့်ရာ ယခင်က ဖယ်ရှားခဲ့ဖူးသော `tracker-miner-fs` package သည် Remove သာ ဖြစ်ခဲ့ပြီး Purge မဖြစ်ခဲ့သည့်အတွက် `/etc/xdg/autostart/tracker-miner-fs-3.desktop` ဖိုင် ကျန်နေခဲ့သည်။ GNOME Session စတက်ချိန်တွင် အဆိုပါ desktop file က မရှိတော့သည့် binary လမ်းကြောင်း (`/usr/libexec/tracker-miner-fs-3`) ကို ခေါ်ယူနေသောကြောင့် Warning တက်နေရခြင်း ဖြစ်သည်။

ထို့အပြင် `cgroupfs-mount` သည် cgroups v1 အတွက် ရှေးဟောင်း package တစ်ခုဖြစ်ပြီး Debian 13 (Trixie) ၏ ခေတ်မီ unified cgroups v2 စနစ်တွင် မလိုအပ်တော့သောကြောင့် SysV compatibility သတိပေးချက် ပြနေခြင်း ဖြစ်သည်။

### The Fix:

အဆိုပါ မလိုအပ်တော့သည့် Residual configurations များနှင့် Obsolete packages များကို Purge လုပ်လိုက်သည်-

```bash
sudo apt-get purge -y tracker-miner-fs cgroupfs-mount
```

> **ရလဒ် -** ကျန်နေခဲ့သော Autostart file ဖျက်သိမ်းသွားသဖြင့် GNOME login တက်ချိန်တွင် Desktop file warning မပေါ်တော့သလို cgroupfs SysV generator warning လည်း လုံးဝ ကင်းစင်သွားသည်။


## Step 4: Hardware Probe Logs များကို Boot Screen ပေါ် မပြစေရန် GRUB ပြင်ဆင်ခြင်း

ကွန်ပျူတာ Boot တက်ချိန်တွင် ကီးဘုတ် Controller (`i8042: Can't reactivate KBD port`) နှင့် HP ACPI driver (`hp_wmi: query 0x4 returned error 0x5`) တို့နှင့် ပတ်သက်သော စာသားများ Console screen ပေါ်သို့ ထိုးထွက်လာတတ်သည်။

### Analysis:

၎င်းစာသားများသည် Laptop မော်ဒယ်ဟောင်း (ဥပမာ HP ProBook 430 G5) တွင် Kernel က Hardware feature များကို စမ်းသပ်စစ်ဆေးစဉ် တွေ့ရသည့် Non-fatal probe warnings များသာ ဖြစ်ပြီး စက်၏ လုပ်ဆောင်ချက်ကို လုံးဝ မထိခိုက်စေပါ။ သို့သော် Debian ၏ GRUB configuration တွင် `quiet` ဟုသာ ထည့်ထားပါက Kernel Error priority (`KERN_ERR`) အဆင့်ရှိသော စာသားများသည် Boot screen ပေါ်သို့ ရောက်လာတတ်သည်။

### The Fix:

Boot screen ပေါ်တွင် မလိုအပ်သော Driver စာသားများ မပေါ်ဘဲ သန့်ရှင်းနေစေရန် `loglevel=3` ကို GRUB တွင် ထည့်သွင်းပေးနိုင်သည်-

```bash
sudo nano /etc/default/grub
```

အောက်ပါစာကြောင်းကို ရှာ၍ ပြင်ဆင်ပါ-

```text
GRUB_CMDLINE_LINUX_DEFAULT="quiet loglevel=3"
```

ပြင်ဆင်ပြီးနောက် Boot loader configuration ကို Update လုပ်ပေးပါ-

```bash
sudo update-grub
```

> **မှတ်ချက် -** `loglevel=3` ထည့်လိုက်သော်လည်း System logs များကို ပိတ်ပစ်ခြင်း မဟုတ်ဘဲ Boot screen ပေါ်တွင်သာ မပေါ်စေခြင်း ဖြစ်သည်။ စနစ်၏ အသေးစိတ် Log များကိုမူ `journalctl -b` ဖြင့် အချိန်မရွေး ဆက်လက် စစ်ဆေးနိုင်သည်။


## Verification: Failed Units ကင်းစင်သော စနစ်ဖြစ်ကြောင်း အတည်ပြုခြင်း

ပြင်ဆင်မှုများ အားလုံး ပြီးမြောက်ပြီးနောက် စနစ်တစ်ခုလုံးတွင် မည်သည့် Service မျှ ပျက်ယွင်းနေခြင်း မရှိကြောင်း အတည်ပြုရန် `systemctl` ဖြင့် စစ်ဆေးခဲ့သည်-

```bash
# System services စစ်ဆေးခြင်း
sudo systemctl --failed

# User services စစ်ဆေးခြင်း
systemctl --user --failed
```

**Output ရလဒ်:**
```text
0 loaded units listed.
```

System-level ရော User-level တွင်ပါ Failed ဖြစ်နေသည့် Service သုည (0) ခု ဖြစ်သွားပြီး စနစ်တစ်ခုလုံး အပြည့်အဝ တည်ငြိမ်သန့်ရှင်းသွားသည်။


## Conclusion & Key Takeaways

Debian Linux တွင် Boot / Startup အဆင့်ကို စစ်ဆေးပြုပြင်ရာတွင် အောက်ပါ အချက်များကို အဓိက သင်ခန်းစာရရှိခဲ့သည်-

၁။ **Udev Rules Typo Override:**  
စနစ်အတွင်းပါဝင်သော udev rules ဖိုင်များတွင် typo အမှားပါရှိပါက `/usr/lib` အောက်တွင် တိုက်ရိုက်မပြင်ဘဲ `/etc/udev/rules.d` အောက်သို့ ကူးယူပြင်ဆင်ခြင်းသည် System upgrade များတွင် ပျက်မသွားစေသော အကောင်းဆုံး နည်းလမ်းဖြစ်သည်။

၂။ **Residual Packages များ ရှင်းလင်းခြင်း:**  
Package များကို ဖယ်ရှားသည့်အခါ configuration ဖိုင်များ ကျန်မနေစေရန် `apt remove` အစား `apt purge` ကို အသုံးပြုသင့်သည်။ မဟုတ်ပါက မရှိတော့သည့် binary များကို ရည်ညွှန်းနေသော autostart `.desktop` ဖိုင်များကြောင့် warning များ ကြုံရတတ်သည်။

၃။ **Clean Boot Architecture:**  
Kernel driver probe log များနှင့် စစ်မှန်သော Hardware ပျက်စီးမှုများကို ခွဲခြားသိမြင်ပြီး GRUB `loglevel=3` ကို သုံးစွဲခြင်းဖြင့် သန့်ရှင်းသပ်ရပ်သော Boot sequence ကို ရရှိစေနိုင်သည်။
