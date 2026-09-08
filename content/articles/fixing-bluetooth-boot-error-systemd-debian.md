---
title: "Fixing Bluetooth Boot Errors and Systemd Directory Mode Mismatch on Debian Linux"
date: 2026-09-08T16:53:00+06:30
image: "images/fastfetch.png"
thumbnail_image: "images/fastfetch.png"
description: "Debian Linux စတင်ချိန်တွင် တွေ့ရတတ်သည့် Bluetooth kernel probe error များနှင့် systemd configuration directory permission မကိုက်ညီသည့် ပြဿနာကို အဆင့်ဆင့် ဖြေရှင်းခဲ့ပုံ။"
summary: "Debian တွင် ကွန်ပျူတာ Boot တက်ချိန် သို့မဟုတ် Setup ပြုလုပ်ချိန်၌ တွေ့ရသည့် Bluetooth hci0 error များနှင့် systemd Directory mode mismatch သတိပေးချက်များကို အဆင့်ဆင့် စစ်ဆေးဖြေရှင်းခဲ့သည့် မှတ်တမ်း။"
categories: ["Linux", "System Administration", "Troubleshooting"]
tags: ["Debian", "Bluetooth", "Linux", "Troubleshooting", "systemd", "GRUB", "Kernel"]
series: ["Debian Troubleshooting"]
keywords: ["Debian Bluetooth error", "Reading supported features failed -16", "ConfigurationDirectory bluetooth mode is different", "Linux Bluetooth troubleshooting", "Intel Wireless-AC 8265", "GRUB loglevel"]
slug: "fixing-bluetooth-boot-error-systemd-debian"
---
Debian Linux (Trixie / Bookworm) သုံးနေစဉ် ကွန်ပျူတာ စတင်တက်လာသည့်အချိန် (Boot / Startup) သို့မဟုတ် Terminal မှတစ်ဆင့် System status များကို စစ်ဆေးသည့်အခါ Bluetooth နှင့် ပတ်သက်ပြီး စိတ်အနှောင့်အယှက်ဖြစ်စေသော Error နှင့် Warning စာသားများ မကြာခဏ ပေါ်လာတတ်သည်။ 

ဒီတစ်ခေါက်လည်း ကွန်ပျူတာ Setup ပြုလုပ်ရင်းနဲ့ Boot တက်ချိန် Screen ပေါ်တွင် Bluetooth driver error များနှင့် Service status တွင် Directory mode သတိပေးချက်များ တက်နေတာကို သတိထားမိခဲ့တယ်။ အပေါ်ယံကြည့်ရင် Bluetooth controller ပျက်သွားပြီလား ထင်ရပေမယ့် တစ်ဆင့်ချင်း Debug လုပ်ကြည့်တဲ့အခါ ဘာကြောင့်ဖြစ်တာလဲဆိုတာ ရှင်းရှင်းလင်းလင်း သိလာရပြီး လွယ်ကူစွာ ဖြေရှင်းနိုင်ခဲ့တဲ့အကြောင်း ဒီဆောင်းပါးမှာ မှတ်တမ်းအဖြစ် မျှဝေလိုက်ပါတယ်။

![Linux Terminal Interface](images/sudo_terminal.jpg)

## The Problem: Boot တက်ချိန်နှင့် Setup တွင် Bluetooth Error များ တွေ့နေရခြင်း

စက်စတင်ဖွင့်လိုက်ချိန် Black Screen ပေါ်တွင် အောက်ပါ Error စာသားများ ချက်ချင်းပေါ်လာပြီးမှ Login screen သို့ ဆက်သွားတာကို တွေ့ရသည်-

```text
Bluetooth: hci0: Reading supported features failed (-16)
Bluetooth: hci0: Error reading debug features
Bluetooth: hci0: HCI LE Coded PHY feature bit is set, but its usage is not supported.
```

ဒါ့အပြင် Bluetooth service ရဲ့ အခြေအနေကို Terminal မှတစ်ဆင့် `systemctl status bluetooth` ဖြင့် စစ်ဆေးကြည့်သည့်အခါ နောက်ထပ် Warning တစ်ခုကို ထပ်မံတွေ့ရသည်-

```text
bluetooth.service: ConfigurationDirectory 'bluetooth' already exists but the mode is different. (File system: 755 ConfigurationDirectoryMode: 555)
```

ဒီပြဿနာနှစ်ခုလုံးကို ရှင်းလင်းသွားစေရန် အဆင့် ၃ ဆင့်ခွဲပြီး စစ်ဆေးဖြေရှင်းခဲ့သည်။


## Debugging Phase 1: Systemd Service Warning ဖြေရှင်းခြင်း (`/etc/bluetooth` Permissions)

ပထမဆုံး `systemctl status bluetooth` တွင် ပြသနေသော သတိပေးချက်ကို အရင်ဆုံး စစ်ဆေးကြည့်လိုက်သည်။

```bash
systemctl status bluetooth
```

Log ထဲတွင် `ConfigurationDirectory 'bluetooth' already exists but the mode is different. (File system: 755 ConfigurationDirectoryMode: 555)` ဟု ဖော်ပြနေသည်။

### Analysis & Fix:

Systemd ၏ Unit file (`/usr/lib/systemd/system/bluetooth.service`) ထဲတွင် လုံခြုံရေးအရ Configuration Directory ကို Read-Only အနေဖြင့် အောက်ပါအတိုင်း ကန့်သတ်ထားသည်-

```ini
ConfigurationDirectory=bluetooth
ConfigurationDirectoryMode=0555
```

သို့သော် ကျွန်ုပ်တို့၏ File System ပေါ်ရှိ `/etc/bluetooth` directory ၏ Permission သည် မူလက `0755` (`drwxr-xr-x`) ဖြစ်နေသောကြောင့် Systemd က သတ်မှတ်ထားသော Mode `0555` (`dr-xr-xr-x`) နှင့် မကိုက်ညီဘဲ သတိပေးချက် တက်လာရခြင်းဖြစ်သည်။

ဤပြဿနာကို ဖြေရှင်းရန် `/etc/bluetooth` ၏ Permission ကို `555` သို့ ပြောင်းလဲပေးပြီး Service ကို Restart ပြုလုပ်ပေးရပါမည်-

```bash
sudo chmod 555 /etc/bluetooth
sudo systemctl restart bluetooth
```

ပြန်လည် စစ်ဆေးကြည့်သည့်အခါ-

```bash
systemctl status bluetooth
```

> **ရလဒ် -** `ConfigurationDirectory` နှင့် ပတ်သက်သော Mode mismatch သတိပေးချက် လုံးဝ ပျောက်ကွယ်သွားပြီး Bluetooth daemon သည် သန့်ရှင်းစွာ စတင်အလုပ်လုပ်သွားသည်။


## Debugging Phase 2: Kernel Log (dmesg) စစ်ဆေးခြင်းနှင့် Hardware Probe Issue

ဒုတိယအချက်အနေဖြင့် Boot တက်ချိန်တွင် တွေ့ရသည့် Kernel Error များကို `dmesg` မှတစ်ဆင့် အသေးစိတ် စစ်ဆေးကြည့်သည်။

```bash
sudo dmesg | grep -i blue
```

```text
[   16.232459] Bluetooth: hci0: Firmware revision 0.1 build 19 week 44 2021
[   16.235448] Bluetooth: hci0: Reading supported features failed (-16)
[   16.235477] Bluetooth: hci0: Error reading debug features
[   16.235482] Bluetooth: hci0: HCI LE Coded PHY feature bit is set, but its usage is not supported.
```

### Analysis: Error -16 (-EBUSY) ၏ အဓိပ္ပာယ်ကို နားလည်ခြင်း

၁။ **Hardware အမျိုးအစား စစ်ဆေးခြင်း:**  
`lsusb` ဖြင့် စစ်ဆေးကြည့်ရာ စက်ထဲတွင် တပ်ဆင်ထားသော Bluetooth Card မှာ **Intel Corp. Bluetooth wireless interface (ID: `8087:0a2b`)** ဖြစ်ပြီး ၎င်းသည် **Intel Wireless-AC 8265** ချစ်ပ်ဆက်ဖြစ်သည်။

၂။ **Error ဖြစ်ရသည့် အကြောင်းရင်း:**  
Linux Kernel အသစ်များ (ဥပမာ Kernel 6.12+) တွင် ပါဝင်သော `btintel` driver သည် Bluetooth စတင်ချိန်၌ အသစ်ထွက် Debug/Telemetry command (Opcode `0xfc63`) နှင့် Bluetooth 5.0 LE Coded PHY feature များကို စစ်ဆေးရန် Query လုပ်သည်။ သို့သော် **Intel 8265 သည် Bluetooth 4.2 standard သာ ထောက်ပံ့ပေးနိုင်သည့် မျိုးဆက်ဟောင်း ချစ်ပ်ဆက်** ဖြစ်သောကြောင့် ၎င်း debug feature များကို နားမလည်ဘဲ Kernel သို့ `-16` (`-EBUSY` / Command unsupported) တုံ့ပြန်မှု ပေးလိုက်ခြင်း ဖြစ်သည်။

၃။ **Hardware ပျက်စီးခြင်း မဟုတ်ကြောင်း အတည်ပြုခြင်း:**  
Driver က Debug features မရရှိသော်လည်း ပုံမှန် Firmware (`ibt-11-5.sfi`) ကို အောင်မြင်စွာ Load လုပ်ပြီးနောက် Device ကို ပုံမှန်အတိုင်း အပြည့်အဝ ဆက်လက်လည်ပတ်စေသည်။ ထို့ကြောင့် ဤစာသားများသည် Controller ပျက်စီးခြင်း မဟုတ်ဘဲ **Driver Probe အဆင့်တွင် ဖြစ်ပေါ်သည့် Non-fatal warning** များသာ ဖြစ်သည်။


## Debugging Phase 3: Boot Screen တွင် Error စာသားများ မပေါ်စေရန် GRUB တွင် ပြင်ဆင်ခြင်း

အဆိုပါ Kernel probe warning များသည် Hardware အလုပ်လုပ်မှုကို မထိခိုက်စေသော်လည်း ကွန်ပျူတာ Boot စတက်ချိန်တွင် Screen ပေါ်၌ ရုတ်တရက် ပေါ်လာခြင်းက အမြင်မရှင်းဖြစ်စေသည်။

Debian ၏ မူလ GRUB configuration တွင် `quiet` ဟုသာ ပါဝင်သောကြောင့် Error priority (`KERN_ERR`) အဆင့်ရှိသော Hardware probe log များသည် Console screen ပေါ်သို့ ရောက်ရှိလာခြင်း ဖြစ်သည်။ ၎င်းတို့ကို Boot screen ပေါ်တွင် မပြသဘဲ သန့်ရှင်းစွာ ထားရှိရန် GRUB တွင် `loglevel=3` ကို ထည့်သွင်းပေးနိုင်သည်။

၁။ `/etc/default/grub` ဖိုင်ကို Text Editor ဖြင့် ဖွင့်ပါ-

```bash
sudo nano /etc/default/grub
```

၂။ အောက်ပါစာကြောင်းကို ရှာပါ-

```text
GRUB_CMDLINE_LINUX_DEFAULT="quiet"
```

၃။ ၎င်းကို အောက်ပါအတိုင်း ပြင်ဆင်ပါ-

```text
GRUB_CMDLINE_LINUX_DEFAULT="quiet loglevel=3"
```

> **မှတ်ချက် -** `loglevel=3` သတ်မှတ်ခြင်းသည် Boot screen ပေါ်တွင် မလိုအပ်သော Driver သတိပေးစာသားများ ထိုးထွက်မလာစေရန် တားဆီးပေးပြီး နောက်ကွယ် Log များကိုမူ `journalctl` သို့မဟုတ် `dmesg` ထဲတွင် ပုံမှန်အတိုင်း ဆက်လက်မှတ်တမ်းတင်ပေးထားဆဲ ဖြစ်သည်။

၄။ ဖိုင်ကို Save လုပ်ပြီးနောက် GRUB configuration ကို Update လုပ်ပေးပါ-

```bash
sudo update-grub
```


## Verification: Bluetooth Controller ပုံမှန် အလုပ်လုပ်မှု စစ်ဆေးခြင်း

အထက်ပါ အဆင့်များ ပြုလုပ်ပြီးနောက် Bluetooth controller နှင့် ချိတ်ဆက်ထားသော ပစ္စည်းများ ကောင်းမွန်စွာ အလုပ်လုပ်နေခြင်း ရှိ/မရှိ စစ်ဆေးခဲ့သည်။

**၁။ Hardware Block ဖြစ်နေခြင်း ရှိ/မရှိ စစ်ဆေးခြင်း:**

```bash
rfkill list
```

`Soft blocked: no` နှင့် `Hard blocked: no` ဖြစ်နေကြောင်း တွေ့ရသည်။

**၂။ Controller အခြေအနေ စစ်ဆေးခြင်း:**

```bash
bluetoothctl show
```

```text
Controller 68:EC:C5:37:1B:5C (public)
	Name: debian
	Powered: yes
	PowerState: on
	Pairable: yes
```

**၃။ ချိတ်ဆက်ထားသော Devices များနှင့် စမ်းသပ်ခြင်း:**

```bash
bluetoothctl devices
```

စက်တွင် တွဲဖက်ထားသည့် နားကြပ် (CozyPods) နှင့် Bluetooth Speaker များအားလုံး Audio Stream ကို ပုံမှန်အတိုင်း အပြစ်အနာအဆာမရှိ ဆက်လက်အသုံးပြုနိုင်သည်ကို တွေ့ရသည်။


## Conclusion & Key Takeaways

ကွန်ပျူတာ Boot တက်ချိန်နှင့် Setup ကာလအတွင်း တွေ့ရသော Bluetooth error များကို ဖြေရှင်းပြီးနောက် အောက်ပါ အဓိကအချက်များကို သတိပြုမိခဲ့သည်-

၁။ **Systemd Directory Mode Mismatch:**  
Service unit file က `0555` တောင်းဆိုထားချိန်တွင် ဖိုင်တွဲက `0755` ဖြစ်နေလျှင် `sudo chmod 555 /etc/bluetooth` ပြုလုပ်ပေးရုံဖြင့် Warning ကင်းရှင်းစွာ လည်ပတ်နိုင်သည်။

၂။ **Driver Feature Probe vs Hardware Failure:**  
Kernel log ထဲတွင် `Reading supported features failed (-16)` ဟု တွေ့ရတိုင်း Hardware ပျက်စီးခြင်း မဟုတ်ပါ။ Intel ချစ်ပ်ဆက်ဟောင်းများတွင် Kernel အသစ်၏ Debug query များကြောင့် ဖြစ်ပေါ်လာသော အန္တရာယ်မရှိသည့် log များ ဖြစ်နိုင်သည်။

၃။ **Clean Boot Experience:**  
GRUB တွင် `loglevel=3` ကို သုံးစွဲခြင်းဖြင့် Boot တက်ချိန်၌ ကွန်ဆိုးလ်ပေါ် စာသားရှုပ်ထွေးမှု ကင်းရှင်းသွားပြီး စနစ်၏ အရေးကြီး logs များကိုမူ `journalctl` ထဲတွင် အပြည့်အစုံ ဆက်လက် စစ်ဆေးနိုင်မည် ဖြစ်သည်။
