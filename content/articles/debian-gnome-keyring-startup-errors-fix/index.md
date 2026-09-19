---
title: "Debian စတင်ချိန် GNOME Keyring Scope Error ပြင်နည်း"
date: 2026-09-19T04:30:00+06:30
image: "debian-gnome-keyring-startup-errors-fix.webp"
thumbnail_image: "debian-gnome-keyring-startup-errors-fix.webp"
description: "Debian 13 GNOME စတင်ချိန်မှာ journalctl ထဲ တွေ့ရတဲ့ GNOME Keyring scope failed နဲ့ PipeWire Bluetooth Error တွေကို အမြစ်ရှာ ဖြေရှင်းခဲ့တဲ့ မှတ်တမ်း။"
summary: "Debian 13 GNOME စတင်ချိန်မှာ journalctl ထဲ တွေ့ရတဲ့ GNOME Keyring scope failed နဲ့ PipeWire Bluetooth Error တွေကို အမြစ်ရှာ ဖြေရှင်းခဲ့တဲ့ မှတ်တမ်း။"
categories: ["Linux", "System Administration", "Troubleshooting"]
tags: ["Debian", "GNOME", "gnome-keyring", "systemd", "PipeWire", "Powerlevel10k", "gitstatus", "Troubleshooting", "Linux"]
series: ["Debian Troubleshooting"]
keywords: ["Debian 13 startup errors", "gnome-keyring scope failed", "Failed to start app-gnome-gnome-keyring", "pipewire profiles inconsistent", "gitstatus failed to initialize", "XDG autostart Hidden true", "Debian GNOME troubleshooting"]
slug: "debian-gnome-keyring-startup-errors-fix"
---
Debian 13 (Trixie) GNOME ကို နေ့စဉ်သုံးနေရင်းနဲ့ Session Login / Startup ဖြစ်ချိန်မှာ `journalctl` ထဲမှာ ကြောက်စရာကောင်းတဲ့ Error စာသားတွေ အများအပြား တက်နေတယ်ဆိုတာ သတိထားမိလာတယ်။

- `Failed to start app-gnome-gnome-keyring-pkcs11/ssh/secrets.scope … Application launched by gnome-session-binary.`
- `pipewire-pulse: card … profiles inconsistent (1 < 2)`
- `pw.node: (bluez_output.…) … error (Received error event)`

ဒါတွေကို မြင်ရတာနဲ့ GNOME keyring ပျက်သွားပြီလား၊ SSH key agent အလုပ်မလုပ်တော့ဘူးလားလို့ စဉ်းစားမိတယ်။ ဒါပေမယ့် တစ်ဆင့်ချင်း Debug လုပ်ကြည့်တဲ့အခါ အများစုဟာ Function ကိစ္စမရှိဘဲ စိတ်အနှောင့်အယှက်ဖြစ်စရာသာ ဖြစ်နေပြီး တစ်ချို့ကတော့ အမြစ်ရှာပြီး အမှန်တကယ် ရှင်းလင်းနိုင်ခဲ့တာ တွေ့ရတယ်။ အဲဒီအကြောင်း ဒီဆောင်းပါးမှာ မှတ်တမ်းအဖြစ် ရေးထားပါတယ်။

![Debian GNOME Keyring Startup Errors Fix](debian-gnome-keyring-startup-errors-fix.webp)

## The Problem: Session စတင်ချိန်တွင် ပေါ်နေသည့် Error / Warning စာသားများ

`journalctl --user -p 3 -b` ကို ကြည့်လိုက်တဲ့အခါ အောက်ပါ error တွေကို တွေ့ရတယ်-

```text
systemd[1231]: Failed to start app-gnome-gnome\x2dkeyring\x2dpkcs11-1704.scope - Application launched by gnome-session-binary.
systemd[1231]: Failed to start app-gnome-gnome\x2dkeyring\x2dsecrets-1698.scope - Application launched by gnome-session-binary.
systemd[1231]: Failed to start app-gnome-gnome\x2dkeyring\x2dssh-1701.scope - Application launched by gnome-session-binary.
```

ဒါ့အပြင် Bluetooth (PipeWire) ပိုင်းကလည်း-

```text
pipewire-pulse[1606]: mod.protocol-pulse: card 93 port 0 profiles inconsistent (1 < 2)
pipewire[1602]: pw.node: (bluez_output.86_B6_04_43_76_E5.1-144) idle -> error (Received error event)
```

နောက်တစ်ခု၊ ဒီ debug ပြုလုပ်တဲ့ Agent / Sandbox environment ထဲမှာ Zsh စတင်ချိန်မှာလည်း-

```text
[ERROR]: gitstatus failed to initialize.
```

စတဲ့ error တွေ တွေ့ခဲ့ရတယ်။ ဒီ error တစ်ခုချင်းစီကို အမြစ်ရှာကြည့်တဲ့အခါ အောက်ပါအတိုင်း သဘောပေါက်လာတယ်။

## Debugging: Error တစ်ခုချင်းစီ၏ အမှန်တကယ် အကြောင်းရင်း

### ၁။ GNOME Keyring Scope Failed - အကြောင်းရင်း

Log အပြည့်အစုံမှာ စိတ်ဝင်စားစရာ စာသားတွေ ပါဝင်နေတယ်-

```text
gnome-keyring-daemon[1607]: The Secret Service was already initialized
gnome-keyring-pkcs11.desktop[1711]: discover_other_daemon: 1  GNOME_KEYRING_CONTROL=/run/user/1000/keyring
systemd[1231]: app-gnome-gnome\x2dkeyring\x2dpkcs11-1704.scope: Couldn't move process 1704 to requested cgroup … No such process
```

အနှစ်သာရပြောမယ်ဆိုရင် ဒီစနစ်မှာ GNOME Keyring ကို **နှစ်နေရာက** တစ်ပြိုင်နက် စတင်နေတယ်-

1. **systemd user unit** - `/usr/lib/systemd/user/gnome-keyring-daemon.service` က `--components="pkcs11,secrets"` နဲ့ socket activation ဖြင့် daemon ကို စတင်ပေးတယ် (အောက်ပါအတိုင်း စစ်ဆေးတွေ့ရသည်)။
2. **XDG autostart** - `/etc/xdg/autostart/gnome-keyring-{pkcs11,secrets,ssh}.desktop` သုံးခုက `X-GNOME-Autostart-Phase=PreDisplayServer` ဖြင့် `gnome-keyring-daemon --start` ကို ထပ်မံ လုပ်ဆောင်နေတယ်။

ဒါကြောင့် `.desktop` များက စတင်ဖို့ ကြိုးစားလိုက်ချိန်မှာ daemon က systemd က စတင်ထားပြီးသားဖြစ်နေတဲ့အတွက် `The Secret Service was already initialized` ဆိုပြီး ချက်ချင်း `exit` သွားတယ်။ systemd-user (gnome-session-binary) က အဲဒီ process ကို scope cgroup ထဲထည့်ဖို့ ကြိုးစားတော့ process က မရှိတော့ဘူး → `Failed to start …scope` ဖြစ်သွားတယ်။

အရေးကြီးတဲ့ အချက်: **Keyring daemon အလုပ်လုပ်နေတယ်** - `/run/user/1000/keyring/{control,pkcs11,ssh}` socket တွေ တက်နေပြီး SSH agent (`ssh-agent -D -a /run/user/1000/keyring/.ssh`) လည်း အလုပ်လုပ်နေတယ်။ ဒါ Error ရဲ့ ရုပ်ထွက်ကိုကြည့်ရင် ပျက်နေသလို ထင်ရပေမယ့် Function က လုံးဝ အဆင်ပြေတယ်။

### ၂။ PipeWire Bluetooth Error - အကြောင်းရင်း

`profiles inconsistent (1 < 2)` နဲ့ `bluez_output … Received error event` တွေဟာ Bluetooth audio device (ဥပမာ wireless headphones) တွေ ချိတ်ဆက် / ပြတ်တောက်ချိန်မှာ PipeWire/WirePlumber နဲ့ BlueZ အကြား profile ရေတွက်မှု မကိုက်ညီတာကြောင့် ထွက်လာတာဖြစ်တယ်။ ဒါဟာ လူသိများတဲ့ cosmetic warning ဖြစ်ပြီး boot-time ပြဿနာကို မဖြစ်စေဘူး။

### ၃။ Gitstatus Failed to Initialize - အကြောင်းရင်း

Powerlevel10k ၏ `gitstatus failed to initialize.` error ဟာ **Terminal (TTY) မရှိတဲ့ environment** မှာသာ ဖြစ်တာဖြစ်တယ်။ ဘာကြောင့်လဲဆိုတော့ `gitstatus_start` က job control အတွက် `setopt monitor` ကို လိုအပ်တယ်။ TTY မရှိရင် zsh က `can't change option: monitor` ဆိုပြီး ငြင်းဆန်တာကြောင့် gitstatus မစတင်နိုင်တာ ဖြစ်တယ်။

အဲဒါကို တကယ့် pseudo-terminal (PTY) နဲ့ စမ်းကြည့်တဲ့အခါ error လုံးဝ မပေါ်တော့ဘဲ၊ ဒီစနစ်ပေါ်မှာ `gitstatusd` daemon ၇ ခု (open terminal တိုင်းအတွက်) အလုပ်လုပ်နေတာကို `ps aux | grep gitstatusd` နဲ့ တွေ့ရတယ်။ ဆိုလိုတာက **တကယ့် terminal မှာ ဒီ error မရှိဘူး** - Agent/Sandbox ရဲ့မရှိမဖြစ် TTY မရှိမှုကြောင့်သာ ဖြစ်တာပါ။

### ၄။ Crontab - maintain.sh (အမှန်တကယ် အလုပ်ဖြစ်နေသည်)

`0 2 * * *` မှာ နေ့စဉ် run နေတဲ့ `maintain.sh` က ပုံမှန်ရှောင် `sudo` သုံးဖို့ လိုတယ်လို့ ထင်ရပေမယ့် `/etc/sudoers.d/dont-prompt-hhk-for-sudo-password` တည်ရှိပြီး `sudo -n true` လည်း အောင်မြင်တယ်။ Cron log (`journalctl -u cron`) အရ နံနက် ၂ နာရီမှာ အောင်မြင်စွာ run ထားပြီးသားဖြစ်တယ်။ ဒါ **false alarm** ဖြစ်တယ်။


## The Fix: GNOME Keyring Scope Error ကို အမြစ်ပြတ် ဖြေရှင်းခြင်း

ဒီ scope error သုံးခုထဲက **pkcs11 နဲ့ secrets** နှစ်ခုဟာ systemd user unit နဲ့ ထပ်တူကျနေတာကြောင့် ဖြစ်နေတာဖြစ်တယ်။ ဒါကြောင့် duplicate autostart နှစ်ခုကို XDG override နည်းနဲ့ `Hidden=true` လုပ်လိုက်တယ်-

### Step 1: Duplicate Autostart Entry များကို Disable ပြုလုပ်ခြင်း

XDG autostart spec အရ user-level `~/.config/autostart/` အောက်မှာ system-level `.desktop` နဲ့ **နာမည်တူ** entry ကို `Hidden=true` နဲ့ ထည့်လိုက်ရင် system-level entry ကို override လုပ်ပြီး disable ဖြစ်သွားတယ်။ systemd unit က pkcs11+secrets ကို socket activation နဲ့ စတင်နေတာမို့ function က မပျက်စီးပါဘူး။

```bash
# ~/.config/autostart/gnome-keyring-pkcs11.desktop
[Desktop Entry]
Type=Application
Name=GNOME Keyring: PKCS#11 Component
Comment=Disabled: systemd gnome-keyring-daemon.service already starts pkcs11
Exec=/usr/bin/gnome-keyring-daemon --start --components=pkcs11
Hidden=true
NoDisplay=true

# ~/.config/autostart/gnome-keyring-secrets.desktop
[Desktop Entry]
Type=Application
Name=GNOME Keyring: Secret Service
Comment=Disabled: systemd gnome-keyring-daemon.service already starts secrets
Exec=/usr/bin/gnome-keyring-daemon --start --components=secrets
Hidden=true
NoDisplay=true
```

ထပ်လုပ်ရမယ့် အရေးကြီးတဲ့ verification က systemd unit နှစ်ခု enabled ဖြစ်နေတာ သေချာအောင် ကြည့်တယ်-

```bash
systemctl --user is-enabled gnome-keyring-daemon.service gnome-keyring-daemon.socket
# enabled
# enabled
```

> **ရလဒ် -** နောက် login ဝင်တဲ့အခါ `pkcs11` နဲ့ `secrets` scope နှစ်ခုဟာ systemd ကသာ စတင်တာမို့ `Failed to start …scope` error နှစ်ကြောင်း လုံးဝ မပေါ်တော့ပါ။

### Step 2: SSH Desktop Entry ကို ဘာကြောင့် မထိခဲ့သနည်း

`gnome-keyring-ssh.desktop` ကိုတော့ disable **မလုပ်ခဲ့ပါဘူး**။ အကြောင်းကတော့ ဒီစနစ်မှာ SSH agent ကို အဓိကထားစတင်ပေးတဲ့ **တစ်ခုတည်းသော** နေရာက ဒီ entry ဖြစ်နေလို့ပါ။ systemd user unit က `--components="pkcs11,secrets"` သာ စတင်ပေးပြီး SSH socket ကို မဖွင့်ပေးဘူး။ ဒီ entry က SSH component ကို run ပြီးတော့မှ `SSH_AUTH_SOCK=/run/user/1000/keyring/ssh` ကို session environment ထဲသို့ ထည့်ပေးတာမို့ ဒါကို ဖယ်လိုက်ရင် SSH key agent နဲ့ env propagation ပျက်သွားနိုင်တယ်။

ဒါကြောင့် ssh scope က error line တစ်ကြောင်း ကျန်နေနိုင်ပေမယ့် ဒါဟာ wrapper process က ချက်ချင်း exit ဖြစ်တာကြောင့်သာ ဖြစ်တဲ့ **design အတိုင်းကျင့်သုံးစရာ cosmetic log** ဖြစ်ပြီး SSH agent က ကောင်းမွန်စွာ အလုပ်လုပ်နေတယ် (လောလောဆယ် `ssh-agent -D -a /run/user/1000/keyring/.ssh` PID 4022 နဲ့ run နေသည်)။

### Step 3: PipeWire Bluetooth Warning နှင့် Gitstatus Error

- **PipeWire bluez warning** - Bluetooth device ၏ အပြုအမူကြောင့် ဖြစ်တဲ့ cosmetic warning ဖြစ်ပြီး config နဲ့ ဖျောက်၍ မရပါ။ System boot ကို မထိခိုက်ပါ။
- **Gitstatus error** - Agent/Sandbox မှာ TTY မရှိတာကြောင့်သာ ဖြစ်တာဖြစ်ပြီး ဒီစက်ရဲ့ တကယ့် terminal တွေမှာ `gitstatusd` က ပုံမှန် အလုပ်လုပ်နေတာမို့ **ပြင်စရာမလိုပါ**။


## Final Verification: ရလဒ်

- `systemctl --failed` (system + user) - **0 failed units**
- `journalctl -b` - keyring scope error, boot-time kernel error မရှိ
- SSH agent (`ssh-agent`) - အလုပ်လုပ်နေသည်
- GNOME Keyring sockets (`/run/user/1000/keyring/`) - တက်နေသည်
- `gitstatusd` - terminal ၇ ခုအတွက် Process တက်နေသည်

## အကျဉ်းချုပ်

Debian 13 GNOME မှာ `Failed to start …gnome-keyring…scope` error တွေ တွေ့ရတိုင်း ထိတ်ဖို့မလိုပါဘူး။ Systemd နဲ့ XDG autostart နှစ်ဖက်က daemon ကို ထပ်ကာထပ်ကာ စတင်နေတာကြောင့် ဖြစ်တဲ့ နာမည်တူရက်တစ်ခုပဲ ဖြစ်တယ်။ User-level XDG override (`Hidden=true`) ဖြင့် pkcs11 / secrets နှစ်ခုကို ရှင်းလင်းနိုင်ပြီး SSH component ကတော့ session env အတွက် မထိထားသင့်ပါ။ ဒီလိုပဲ ဒီဆောင်းပါးက deployment အတွက် အသုံးဝင်တဲ့ diagnostic-filter မှတ်တမ်းတစ်ခုဖြစ်စေဖို့ မျှဝေလိုက်ပါတယ်။