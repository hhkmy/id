---
title: "Debian Shutdown Error Debugging နဲ့ Log စစ်ဆေးနည်း"
date: 2026-09-19T04:45:00+06:30
image: "debian-shutdown-debugging-analysis.webp"
thumbnail_image: "debian-shutdown-debugging-analysis.webp"
description: "Debian 13 GNOME မှာ Shutdown ချချိန် Stop job hang၊ SIGKILL နဲ့ Electron Fatal Error တွေကို journalctl log စစ်ဆေးပြီး ဘယ်လို နားလည်ရမလဲဆိုတဲ့ လက်တွေ့မှတ်တမ်း။"
summary: "Debian 13 GNOME မှာ Shutdown ချချိန် Stop job hang၊ SIGKILL နဲ့ Electron Fatal Error တွေကို journalctl log စစ်ဆေးပြီး ဘယ်လို နားလည်ရမလဲဆိုတဲ့ လက်တွေ့မှတ်တမ်း။"
categories: ["Linux", "System Administration", "Troubleshooting"]
tags: ["Debian", "systemd", "shutdown", "journalctl", "GNOME", "Electron", "Antigravity", "Keybase", "PipeWire", "Bluetooth", "Troubleshooting", "Linux"]
series: ["Debian Troubleshooting"]
keywords: ["Debian shutdown troubleshooting", "shutdown stop job", "journalctl -b -1", "systemd SIGKILL shutdown", "Electron Failed to shutdown", "antigravity Failed to shutdown", "Keybase Failed to shutdown", "pipewire RFCOMM modem not available", "GNOME keyring already registered", "Debian shutdown duration"]
slug: "debian-shutdown-debugging-analysis"
---
Startup / Boot Error တွေကို ရှင်းလင်းပြီးတဲ့နောက် နောက်ထပ် စစ်ဆေးသင့်တာက **Shutdown (စနစ်ပိတ်ချိန်)** ဖြစ်စဉ်ပါ။ ကွန်ပျူတာ ပိတ်ချိန်မှာ မျက်နှာပြင်ပေါ် စောင့်နေရတာ၊ "A stop job is running" ဆိုပြီး ရပ်နေတာမျိုး ကြုံဖူးတယ်ဆိုရင် Shutdown ကို ဘယ်လို Debug လုပ်ရမလဲဆိုတာ သိထားဖို့ လိုပါတယ်။ ဒီဆောင်းပါးမှာ Debian 13 (Trixie) GNOME စနစ်ရဲ့ Shutdown log ၂၀ ခန့်ကို ပြန်ကြည့်ပြီး စစ်ဆေး ခဲ့တဲ့ နည်းလမ်းတွေ၊ တွေ့ရှိချက်တွေကို မှတ်တမ်းတင်ထားပါတယ်။

![Debian Shutdown Debugging and Analysis](debian-shutdown-debugging-analysis.webp)

## Shutdown ကို Debug လုပ်ဖို့ ကြိုတင် သိထားရမယ့် အခြေခံ

Systemd စနစ်မှာ Shutdown ဆိုတာ ဖြစ်စဉ် ၂ ပိုင်း ရှိတယ်-

1. **User session shutdown** - သင်ဝင်ထားတဲ့ GNOME session က `gnome-session-manager@gnome.service` ကို စတင်ရပ်တန့်ပြီး pipewire၊ gnome-keyring၊ tracker စတဲ့ user service အားလုံးကို ပိတ်ခြင်း။
2. **System shutdown** - systemd (PID 1) က ကျန် service တွေ၊ mount တွေကို ပိတ်ပြီး poweroff ကို ပို့ပေးခြင်း။

Systemd ရဲ့ User session shutdown ကတော့ **journald** ထဲမှာ စနစ်တကျ log ဝင်တယ်။ ဒါပေမယ့် System manager (PID 1) ရဲ့ နောက်ဆုံးအဆင့်တွေကတော့ (ဥပမာ unmount၊ poweroff) kernel console သို့သာ ရေးနေတာမို့ journal ထဲမှာ အမြဲမတွေ့ရပါဘူး။ ဒါကြောင့် စစ်ဆေးမှုရဲ့ အဓိကပစ်မှတ်က **User session shutdown မြန်/နှေးသည်** ကို အချိန်နဲ့ တိုင်းတာခြင်းနဲ့ **Shutdown ဖြစ်စဉ်ထဲမှာ ဝင်လာတဲ့ Error စာသားတွေကို ဘာသာပြန်ခြင်း** ဖြစ်တယ်။

## Step 1: Boot List နဲ့ စစ်ဆေးမည့် Boot ကို ရွေးချယ်ခြင်း

```bash
journalctl --list-boots
```

ဒီ command က `-0` (လက်ရှိ boot) ကစပြီး `-1`, `-2`… စသဖြင့် အကြိုက်နဲ့ စာရင်းပြတယ်။ နောက်ဆုံး boot (`-1`) ရဲ့ နောက်ဆုံးလိုင်းတွေကို ကြည့်ရင် ပြီးခဲ့တဲ့ Shutdown ရဲ့ အဆုံးပိုင်းကို တွေ့ရမယ်။

```bash
journalctl -b -1 --no-pager | tail -30
```

## Step 2: Shutdown ကြာချိန် (Duration) တိုင်းတာခြင်း

Shutdown မြန်လား/နှေးလားဆိုတာ User session ရဲ့ shutdown target တစ်လျှောက် ကြာချိန်ကို တိုင်းတာပြီး သိနိုင်တယ်။

```bash
journalctl -b -1 --no-pager | grep -E "Stopping gnome-session|Reached target shutdown.target" | tail -4
```

ဒီစနစ်မှာ ရလဒ်က ဒီလိုပြပါတယ်-

```text
Sep 17 14:04:57 debian systemd[1140]: Stopping gnome-session-manager@gnome.service - GNOME Session Manager (session: gnome)...
Sep 17 14:04:57 debian systemd[1140]: Reached target shutdown.target - Shutdown.
```

`Stopping gnome-session-manager` နဲ့ `Reached target shutdown.target` **တစ်စက္ကန့်လည်း မကွာပါဘူး**။ ပြီးခဲ့တဲ့ Boot ၂၀ ခန့်အားလုံးမှာလည်း အတူတူပဲ - User session shutdown က **< 1 စက္ကန့်** အတွင်း ပြီးဆုံးနေတယ်။ Stop job hang (ဥပမာ ၉၀ စက္ကန့်စောင့်ရတဲ့အခြေအနေ) လုံးဝ မဖြစ်ဖူးပါဘူး။

## Step 3: Shutdown ထဲက Error စာသားများကို စစ်ဆေးခြင်း

```bash
journalctl --no-pager | grep -iE "Stop job|SIGKILL|Failed|shutdown" | tail -30
```

တွေ့ရတဲ့ "Error" တွေကို အမျိုးအစား ၄ မျိုး ခွဲပြီး ဘာသာပြန်နိုင်တယ်-

### ၁။ Systemd ၏ D-Bus ရှင်းလင်းမှု (SIGKILL) - ပုံမှန်ဖြစ်စဉ်

```text
dbus.service: Killing process 1999 (dconf worker) with signal SIGKILL.
dbus.service: Killing process 2008 (gdbus) with signal SIGKILL.
dbus.service: Killing process 43789 (QDBusConnection) with signal SIGKILL.
org.freedesktop.IBus.session.GNOME.service: Killing process 1911 (gdbus) with signal SIGKILL.
```

Session ပိတ်တဲ့အချိန်မှာ user dbus က ရပ်သွားပြီး **dbus တွဲသုံးထားတဲ့ client process** တွေ (dconf worker, gdbus, QDBusConnection, IBus) က မြန်မြန်ထွက်မသွားရင် systemd က `SIGKILL` နဲ့ ဖျက်ပစ်တယ်။ ဒါ **ပုံမှန်တဲ့ cgroup ရှင်းလင်းမှု** ဖြစ်ပြီး ပိတ်ချိန်ကို နှေးစေတာ မဟုတ်ဘူး။ (GTK / GNOME app နဲ့ Qt app တွေ အတွက် ဖြစ်လေ့ရှိတယ်။)

### ၂။ Electron App ၏ "Failed to shutdown" - ပုံမှန်

```text
antigravity.desktop[2360]: [2360:0917/140914.483699:FATAL:.../electron_browser_main_parts.cc:523] Failed to shutdown.
Keybase[6727]: [6727:0707/212911.466261:FATAL:.../electron_browser_main_parts.cc:505] Failed to shutdown.
```

စနစ်ပိတ်ချိန်မှာ session / X server က စောစော သွားတာကြောင့် Electron app (Antigravity IDE, Keybase) တွေက မိမိ shutdown လုပ်ဖို့ အခွင့်မရတော့ဘဲ `FATAL: Failed to shutdown` ဆိုပြီး log ရေးတာ **Electron ရဲ့ သဘာဝအတိုင်း ဖြစ်ပျက်တာ** ဖြစ်တယ်။ System ရဲ့ Shutdown process ကို မထိခိုက်ပါ။ (Antigravity IDE ကို ပိတ်ခါနီးမှာ ကိုယ်တိုင် Close ပေးရင် ဒီ log မပေါ်ဘူး။)

### ၃။ Telegram / X11 "connection broke" - ပုံမှန်

```text
org.telegram.desktop: The X11 connection broke (error 1). Did the X11 server die?
```

X server / session ပိတ်တာနဲ့ screen ပေါ် ရေးဆွဲနေတဲ့ client တွေက ဒီလို complain လုပ်တာ **ပုံမှန်** ဖြစ်တယ်။ Error မဟုတ်ပါ။

### ၄။ PipeWire Bluetooth RFCOMM / Transport Error - Bluetooth Device ရဲ့ အပြုအမူ

```text
spa.bluez5.native: RFCOMM receive command but modem not available: AT+CHLD=?
spa.bluez5.sink.media: ... error 24
pw.node: (bluez_output.86_B6_04_43_76_E5.1-144) running -> error (Received error event)
```

Bluetooth audio device (headband speaker) က disconnect / error ဖြစ်ချိန်မှာ WirePlumber က ဒီလို log တွေ ရေးတယ်။ Startup debug မှာ ဆုံးဖြတ်ထားတဲ့အတိုင်း **cosmetic** ဖြစ်ပြီး Bluetooth device များ ချိတ်ဆက်လာသလို ပေါ်တတ်တဲ့ warning တွေပါ။

### ၅။ GNOME Keyring "already registered" - Chrome ကြောင့်

```text
gnome-keyring-daemon: asked to register item /org/freedesktop/secrets/collection/login/132, but it's already registered
```

ဒီ log ဟာ Shutdown နဲ့ မဆိုင်ဘဲ **runtime** မှာ ဖြစ်တာပါ။ Chrome ([Chromium password store](https://chromium.googlesource.com/chromium/src/+/main/docs/security/) မှ) က keyring ထဲက secret item တွေကို ထပ်ခါထပ်ခါ register လုပ်ပေးလို့ ထွက်တဲ့ စာသားဖြစ်ပြီး အန္တရာယ်မရှိပါ။ (လောလောဆယ် Chrome process ၁၇ ခု run နေတာကို `ps -C chrome | wc -l` ဖြင့် သက်သေပြနိုင်သည်။)

## ထပ်ဆောင်း စစ်ဆေးချက် - Suspend / Hibernate အသုံးပြုမှု

`grep -iE "PM: suspend|systemd-suspend|Reached target Sleep" ` က ဘာ entry မှ မပြတယ်။ ဒီစနစ်က **suspend / hibernate မသုံးဘဲ Reboot / Shutdown တင်သုံးတယ်** ဆိုတာ အတည်ပြုရတယ်။ Suspend မသုံးတဲ့အတွက် suspend/resume-related error မရှိတာလည်း ဖြစ်တယ်။

## အကျဉ်းချုပ်နဲ့ ရလဒ်

| စစ်ဆေးချက် | ရလဒ် |
|---|---|
| Shutdown ကြာချိန်တိုင်းတာခြင်း | < 1 စက္ကန့် (boot တစ်ခုစီ) |
| Stop job hang | မရှိ |
| Failed to stop / unmount error | မရှိ |
| D-Bus SIGKILL | ပုံမှန် (client cleanup) |
| Electron FATAL Failed to shutdown | ပုံမှန် (Keybase / Antigravity) |
| Bluetooth RFCOMM / transport | Cosmetic (device အပြုအမူ) |
| Suspend / Hibernate | အသုံးပြုမှုမရှိ |

**Shutdown က ကျန်းမာတယ်။** ပြုပြင်စရာ မလိုပါ။ Shutdown ကို သင်မြင်ရတဲ့ Error စာသားတွေကား ပုံမှန်တဲ့ protocol / teardown message တွေဖြစ်ပြီး System ၏ ပိတ်စဉ်ကို နှေးကွေးစေတာ မဟုတ်ပါ။

> **မှတ်ချက် (Optional):** တကယ်လို့ နောင်တစ်ချိန်မှာ "A stop job is running" ဖြစ်လာခဲ့ရင် systemd ၏ ပုံမှန် stop timeout က စက္ကန့် ၉၀ ဖြစ်တာမို့ `/etc/systemd/system.conf.d/zz-config.conf` (DefaultTimeoutStopSec) ထဲ၌ ၁၀ - ၃၀ စက္ကန့်သတ်မှတ်ပြီး စောင့်ဆိုင်းချိန် ကန့်သတ်နိုင်ပါတယ်။ ဒီစနစ်မှာတော့ လက်ရှိ မလိုအပ်သေးပါ။