---
title: "Debian Linux မှာ အလိုအလျောက် Update လုပ်အောင် သတ်မှတ်နည်း"
date: 2026-07-22T16:26:10+06:30
author: heinhtetkyaw
image: "images/debian-auto-update.webp"
thumbnail_image: "images/debian-auto-update.webp"
description: "Debian Linux မှာ Security Update တွေနဲ့ Package Update တွေကို အလိုအလျောက် လုပ်အောင် unattended-upgrades သုံးပြီး သတ်မှတ်နည်း။"
summary: "ဒီ Post မှာတော့ Debian Linux ကို ကိုယ်တိုင်အမြဲဝင်ပြီး Update လုပ်နေစရာမလိုအောင် unattended-upgrades သုံးပြီး Auto Update သတ်မှတ်နည်းကို အဆင့်ဆင့် ရှင်းပြထားတယ်။"
categories: ["Linux", "System Administration", "Security"]
tags: ["Debian", "Auto Update", "Unattended Upgrades", "Linux Security", "System Maintenance", "Trixie", "Docker", "Nginx"]
series: ["Debian System Administration"]
keywords: ["Debian auto update", "unattended upgrades debian", "debian trixie auto upgrade", "linux automatic security updates", "debian 12 unattended upgrades", "docker debian auto update"]
slug: "debian-auto-update-upgrade"
---

ဒီနေ့တော့ Debian မှာ Security Update တွေကို ကိုယ်တိုင်အမြဲဝင်လုပ်နေစရာမလိုအောင် Auto Update သတ်မှတ်နည်းကို ပြောပြမယ်။ Server တိုင်း၊ Computer တိုင်းကို နေ့တိုင်း `apt update` နဲ့ `apt upgrade` လုပ်ဖို့ မလွယ်တာကြောင့် တစ်ခါတလေ Update မလုပ်မိဘဲ Package အဟောင်းတွေနဲ့ ဆက်သုံးနေမိတတ်တယ်။

ဒီ Post မှာတော့ Debian ရဲ့ `unattended-upgrades` ကို သုံးပြီး Security Update တွေ အလိုအလျောက်တင်အောင် ဘယ်လိုသတ်မှတ်မလဲဆိုတာကို ကိုယ်တိုင်လိုက်လုပ်လို့ရအောင် အဆင့်ဆင့် ရှင်းပြထားတယ်။ Docker၊ VS Code၊ Nginx လို Third-party Repository တွေအတွက် သတိထားရမယ့်အချက်တွေလည်း ထည့်ပြောထားမယ်။

## ဒီ Post မှာ ဘာတွေပါမလဲ?

ဒီ Post မှာ အောက်ကအဆင့်တွေကို တစ်ဆင့်ချင်း လိုက်လုပ်ကြည့်မယ်။

- Debian တွင် `unattended-upgrades` ကို ထည့်သွင်းခြင်းနှင့် သတ်မှတ်ခြင်း
- Debian repository များအတွက် အလိုအလျောက် လုံခြုံရေး မွမ်းမံခြင်းကို သတ်မှတ်ခြင်း
- Third-party repository များ (Docker၊ VS Code၊ Nginx၊ Chrome၊ Node.js) ထည့်သွင်းခြင်း
- နေ့စဉ် မွမ်းမံခြင်းအတွက် systemd timer များကို သတ်မှတ်ခြင်း
- Dry-run mode ဖြင့် သင်၏ configuration ကို စမ်းသပ်ခြင်း
- အဖြစ်များသော error များကို ရှာဖွေဖြေရှင်းခြင်း

---

## မစခင် ပြင်ဆင်ထားရမယ့်အရာတွေ

စမလုပ်ခင် အောက်ကအချက်လေးတွေ ရှိထားရင် ရပြီ။

| လိုအပ်ချက် | အသေးစိတ် |
|:---|:---|
| **OS** | Debian 12 (Bookworm) သို့မဟုတ် Debian 13 (Trixie) |
| **အခွင့်အရေး** | Root သို့မဟုတ် `sudo` ဝင်ရောက်ခွင့် |
| **အင်တာနက်** | ပက်ကေ့ဂျ်များ ဒေါင်းလုဒ်လုပ်ရန် အင်တာနက်ချိတ်ဆက်မှု |

---

## အဆင့် (၁) - `unattended-upgrades` ကို Install လုပ်မယ်

`unattended-upgrades` က Debian မှာ Auto Update လုပ်ပေးမယ့် အဓိက Package ပဲ။ Terminal ကိုဖွင့်ပြီး အောက်က Command တွေကို Run လိုက်မယ်။

```bash
sudo apt update
sudo apt install unattended-upgrades -y
```

---

## အဆင့် (၂) - Auto Update ကို ဖွင့်မယ်

Package Install ပြီးသွားရင် Configuration Wizard ကို ဖွင့်လိုက်မယ်။

```bash
sudo dpkg-reconfigure -plow unattended-upgrades
```

မေးလာတဲ့အခါ Auto Update ဖွင့်ဖို့ **Yes** ရွေးပေးလိုက်ရင် `/etc/apt/apt.conf.d/20auto-upgrades` ဖိုင်ထဲမှာ အောက်ကလို ရှိလာလိမ့်မယ်။

```bash
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

> `"1"` ဆိုတာ တစ်ရက်တစ်ကြိမ် လုပ်မယ်လို့ ဆိုလိုတာ။ ပုံမှန် Desktop နဲ့ Server အများစုအတွက် ဒီအတိုင်းထားလို့ ရတယ်။

---

## အဆင့် (၃) - ဘယ် Repository တွေကို Update လုပ်မလဲ သတ်မှတ်မယ်

ဘယ် Repository တွေကို Auto Update လုပ်ခွင့်ပေးမလဲဆိုတာ `/etc/apt/apt.conf.d/50unattended-upgrades` ထဲမှာ သတ်မှတ်ထားတယ်။

ဖိုင်ကိုဖွင့်ပြီး စစ်ကြည့်လိုက်မယ်။

```bash
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### Debian Bookworm (12) အတွက်

```bash
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";
};
```

### Debian Trixie (13) အတွက်

Debian Version တစ်ခုနဲ့တစ်ခု Repository Name ကွာနိုင်လို့ ကိုယ့်စက်မှာ တကယ်ရှိတာကို အရင်စစ်တာက ပိုကောင်းတယ်။

```bash
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";
};
```

> **မှတ်ချက်:** Testing ထွက်ရှိမှုများ (Trixie) တွင် stable ထွက်ရှိမှုများထက် တရားဝင် repository အနည်းငယ်သာ ရှိသည်။ ဥပမာ အောက်က

```bash
"${distro_id}:${distro_codename}-security"; → "Debian:trixie-security"
"${distro_id}:${distro_codename}-updates"; → "Debian:trixie-updates"
```

တွေက အခုအချိန်မှာမရှိသေးဘူးဆိုပေမယ့် နောက်ကြရင်ရှိရင် ရှိလာနိုင်တယ်။ မရှိလည်းမရှိနိုင်ဘူးဆိုတော့ 

```bash
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
};
```

တစ်ကြောင်းထဲ သီးသန့်လည်းထားလို့ရသလို ကျန်တဲ့နှစ်ကြောင်းကိုပါ ထည့်လိုက်လည်းရပါတယ်။ Error Message or Warning တက်တာမျိုးမရှိပါဘူး Smooth ဖြစ်ပါတယ်။

---

## အဆင့် (၄) - Third-party Repository တွေကို ထည့်မယ်

Docker၊ VS Code၊ Chrome ဒါမှမဟုတ် Nginx လို Third-party Software တွေ သုံးထားရင် အဲဒီ Repository တွေကိုပါ Auto Update လုပ်ချင်မှာပဲ။

```bash
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### Third-party Repository တွေပါ ထည့်ထားတဲ့ Example

```bash
Unattended-Upgrade::Allowed-Origins {
    // Debian Official Repositories
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";
    
    // Third-Party Repositories
    "Docker:trixie";
    "code stable:stable";          // VS Code
    "TeamViewer GmbH:stable";
    "Google LLC:stable";            // Google Chrome
    ". nodistro:nodistro";          // NodeSource
    "nginx:stable";
};

// Prevent specific packages from being automatically upgraded
Unattended-Upgrade::Package-Blacklist {
    // "docker-compose";  // Blacklist လုပ်ခြင်း၏ ဥပမာ
};

// Enable automatic reboot if required (recommended for servers)
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "02:00";

// Email notifications (optional)
// Unattended-Upgrade::Mail "your-email@example.com";
```

### မှန်ကန်သော Origin Syntax ကို ရှာဖွေခြင်း

Repository တစ်ခုချင်းစီရဲ့ မှန်ကန်တဲ့ Origin ကို ရှာဖို့ ဒီ Command ကို သုံးလိုက်မယ်။

```bash
apt-cache policy | grep -A 5 "Repository Name"
```

Output ထဲက `o=`၊ `a=` နဲ့ `n=` တန်ဖိုးတွေကိုကြည့်ပြီး `Allowed-Origins` ထဲမှာ ထည့်ပေးရမယ်။

---

## အဆင့် (၅) - Systemd Timer ကို စစ်မယ်

Debian သည် မွမ်းမံခြင်းအကြိမ်ရေကို ထိန်းချုပ်ရန် systemd timer နှစ်ခုကို အသုံးပြုသည်။

| Timer | ရည်ရွယ်ချက် |
|:---|:---|
| `apt-daily.timer` | ပက်ကေ့ဂျ်စာရင်းများကို မွမ်းမံခြင်း (`apt update`) |
| `apt-daily-upgrade.timer` | မွမ်းမံမှုများကို ထည့်သွင်းခြင်း (`apt upgrade`) |

### Timer Status ကို စစ်ဆေးခြင်း

```bash
systemctl status apt-daily.timer apt-daily-upgrade.timer
```

**မျှော်လင့်ရမည့် ရလဒ်**
```
● apt-daily.timer - Daily apt download activities
     Loaded: loaded (/lib/systemd/system/apt-daily.timer; enabled)
     Active: active (waiting)
     Trigger: [next trigger time]
```

### Timer များကို ဖွင့်ခြင်း (မဖွင့်ရသေးပါက)

```bash
sudo systemctl enable --now apt-daily.timer
sudo systemctl enable --now apt-daily-upgrade.timer
```

မူလအချိန်ဇယားမှာ **တစ်နေ့တစ်ကြိမ်** ဖြစ်ပြီး အသုံးပြုမှုအများစုအတွက် အကောင်းဆုံးဖြစ်သည်။

---

## အဆင့် (၆) - Configuration ကို Dry-run နဲ့ စမ်းမယ်

Auto Update ကို တကယ်မလုပ်ခင် Configuration မှားနေမနေ အရင်စမ်းတာက ပိုစိတ်ချရတယ်။

```bash
sudo unattended-upgrade --dry-run --debug
```

**ဘာကိုရှာဖွေရမလဲ:**
- "Unable to parse" error မရှိခြင်း
- မျှော်လင့်ထားသော origins အားလုံး "Allowed origins" တွင်ပါခြင်း
- Third-party repository များကို "not allowed" ဟု အမှတ်အသားမပြုခြင်း
- "No packages found" — ဆိုသည်မှာ အားလုံး နောက်ဆုံးပေါ်ဖြစ်နေခြင်းကို ဆိုလိုသည်။

### Debug Output ဥပမာ

```bash
Allowed origins are: o=Debian,a=trixie-security, o=Debian,a=trixie-updates, o=Docker,a=trixie, o=code stable,a=stable, o=TeamViewer GmbH,a=stable, o=Google LLC,a=stable, o=. nodistro,a=nodistro, o=nginx,a=stable
```

---

## အဆင့် (၇) - လိုအပ်ရင် ကိုယ်တိုင် Run မယ်

သတ်မှတ်ထားသော အချိန်ဇယားအတိုင်း မဟုတ်ဘဲ ချက်ချင်း မွမ်းမံမှုများကို လုပ်ဆောင်ရန်:

```bash
sudo unattended-upgrade -v
```

---

## အဖြစ်များသော Error များနှင့် ဖြေရှင်းနည်းများ

### Error: "not enough values to unpack (expected 2, got 1)"

**အကြောင်းရင်း:** `Allowed-Origins` တွင် syntax မှားယွင်းခြင်း — `site=...` သို့မဟုတ် `*` wildcard များကို မှားယွင်းစွာ အသုံးပြုခြင်း။

**ဖြေရှင်းနည်း:** `"origin:archive"` format ကိုသာ အသုံးပြုပါ။ `site=`၊ `origin=` သို့မဟုတ် ပုံစံမမှန်သော ထည့်သွင်းမှုများကို ဖယ်ရှားပါ။

---

### Error: Third-Party Repository များအတွက် "Marking not allowed"

**အကြောင်းရင်း:** Repository origin သည် သင်သတ်မှတ်ထားသည့်အရာနှင့် မကိုက်ညီခြင်း။

**ဖြေရှင်းနည်း:** မှန်ကန်သော `o=` နှင့် `a=` တန်ဖိုးများကို ရှာဖွေရန် `apt-cache policy` ကို အသုံးပြုပြီး သင်၏ သတ်မှတ်ခြင်းကို ပြင်ဆင်ပါ။

**ဥပမာ ဖြေရှင်းချက်**
```bash
# Incorrect
"Keybase:*";

# Correct (use the actual origin and archive from apt-cache policy)
"site=prerelease.keybase.io";  // Special case for empty archive
```

> **မှတ်ချက်:** အချို့သော repository များ (Keybase နှင့် GitHub CLI ကဲ့သို့) တွင် archive field ဗလာဖြစ်နေပြီး အလိုအလျောက် မွမ်းမံခြင်းအတွက် သတ်မှတ်၍မရပါ။ ဤကိစ္စတွင် လိုအပ်သည့်အခါတွင် ကိုယ်တိုင် မွမ်းမံပါ။

---

### Error: "Unable to parse Unattended-Upgrade::Allowed-Origins"

**အကြောင်းရင်း:** သတ်မှတ်ခြင်းဖိုင်တွင် syntax error — ကိုးကားချက်များ ပျောက်နေခြင်း၊ ကွင်းစကွင်းပိတ်များ မှားယွင်းခြင်း သို့မဟုတ် ထောက်ပံ့မထားသော format။

**ဖြေရှင်းနည်း:** ထည့်သွင်းမှုအားလုံးသည် `"origin:archive";` ပုံစံဖြစ်ကြောင်း စစ်ဆေးပါ။ မှတ်ချက်များ သို့မဟုတ် မမှန်ကန်သော ထည့်သွင်းမှုများကို ဖယ်ရှားပါ။

---

## Systemd Timer အချိန်ဇယားကို ဘယ်လိုထားမလဲ?

**တစ်နေ့တစ်ကြိမ်** က မူလအချိန်ဇယားဖြစ်တယ်။ လိုအပ်ရင် ကိုယ့်အသုံးပြုပုံနဲ့ ကိုက်အောင် ပြောင်းထားလို့ရတယ်။

| အချိန်ဇယား | Timer ဥပမာ | အသုံးပြုမှုကိစ္စ |
|:---|:---|:---|
| နေ့စဉ် (မူလ) | `OnCalendar=daily` | ဆာဗာများနှင့် workstations အများစု |
| တစ်နေ့ နှစ်ကြိမ် | `OnCalendar=02:00,14:00` | လုံခြုံရေးအရ အရေးပါသော စနစ်များ |
| အပတ်စဉ် | `OnCalendar=weekly` | ဦးစားပေးမှုနည်းသော စနစ်များ |

---

## သတိထားသင့်တဲ့အချက်တွေ

1. **အလိုအလျောက် မွမ်းမံခြင်းကို အားမကိုးမီ `--dry-run` ဖြင့် အမြဲတမ်း စမ်းသပ်ပါ**
2. **မှတ်တမ်းများကို `/var/log/unattended-upgrades/` တွင် ပုံမှန်စစ်ဆေးပါ**
3. **မွမ်းမံခြင်းသတိပေးချက်များအတွက် အီးမေးလ် အကြောင်းကြားချက်များကို သတ်မှတ်ပါ**
4. **သင့်ဝန်ဆောင်မှုများက ကောင်းမွန်စွာ ကိုင်တွယ်နိုင်မှသာ auto-reboot ကို ဖွင့်ပါ**
5. **အဓိက မွမ်းမံခြင်းများမတိုင်မီ backup လုပ်ပါ — အထူးသဖြင့် kernel အဆင့်မြှင့်တင်မှုများ**
6. **Production servers တွင် Testing (Trixie) ကို ဘယ်တော့မှ မသုံးပါနှင့် — Stable ကိုသာ သုံးပါ**

---

## Update Log တွေကို ဘယ်မှာကြည့်မလဲ?

| မှတ်တမ်းဖိုင် | ရည်ရွယ်ချက် |
|:---|:---|
| `/var/log/unattended-upgrades/unattended-upgrades.log` | အဓိက လုပ်ဆောင်မှု မှတ်တမ်း |
| `/var/log/unattended-upgrades/unattended-upgrades-dpkg.log` | အသေးစိတ် dpkg ရလဒ် |

---

## လုံခြုံရေးအတွက် မမေ့သင့်တာတွေ

- ✅ အလိုအလျောက် လုံခြုံရေး မွမ်းမံခြင်းသည် သင်၏ တိုက်ခိုက်ခံရနိုင်သော မျက်နှာပြင်ကို သိသိသာသာ လျှော့ချပေးသည်
- ✅ အရေးပါသော အားနည်းချက်များကို ထွက်ရှိပြီး နာရီပိုင်းအတွင်း patch လုပ်သည်
- ⚠️ Third-party repository များသည် ယုံကြည်မှု၏ ကိုယ်တိုင်စစ်ဆေးခြင်း လိုအပ်သည်
- ⚠️ Testing ထွက်ရှိမှုများ (Trixie) တွင် မတည်ငြိမ်သော ပက်ကေ့ဂျ်များ ရှိနိုင်သည်

---

## မေးလေ့ရှိတဲ့ မေးခွန်းတွေ

### အလိုအလျောက် Update ကို ဘယ်လောက်ကြာကြာ လုပ်သင့်လဲ?

**ဖြေ:** ပုံမှန်စနစ်အများစုအတွက် **တစ်နေ့တစ်ကြိမ်** ဆိုရင် လုံလောက်တယ်။

### Auto Update ကြောင့် System ပျက်နိုင်လား?

**ဖြေ:** Stable Release တွေမှာ Update တွေကို စမ်းသပ်ထားလို့ ပိုစိတ်ချရတယ်။ Testing Release တွေမှာတော့ ပြဿနာဖြစ်နိုင်ချေ ပိုများတယ်။

### Package တချို့ကို Blacklist လုပ်လို့ရလား?

**ဖြေ:** ရတယ်။ `Unattended-Upgrade::Package-Blacklist` ထဲမှာ Package Name ကို ထည့်ပေးလိုက်ရုံပဲ။

### Update တကယ်တင်သွားလား ဘယ်လိုသိမလဲ?

**ဖြေ:** `/var/log/unattended-upgrades/unattended-upgrades.log` ကို စစ်ကြည့်လို့ရတယ်။ လိုအပ်ရင် Email Notification လည်း သတ်မှတ်ထားလို့ရတယ်။

---

## အနှစ်ချုပ်

ဒီအဆင့်တွေပြီးသွားရင် Debian ကို Auto Update လုပ်အောင် သတ်မှတ်ပြီးပြီ။

| Repository | အခြေအနေ |
|:---|:---:|
| Debian Security | ✅ |
| Debian Updates | ✅ |
| Docker CE | ✅ |
| VS Code | ✅ |
| Google Chrome | ✅ |
| Node.js (NodeSource) | ✅ |
| Nginx | ✅ |
| TeamViewer | ✅ |

အခုဆိုရင် Security Patch တွေကို အလိုအလျောက်တင်ပေးနေမှာဖြစ်လို့ **သတ်မှတ်ပြီး မေ့ထားနိုင်ပြီ (set and forget)**။ ဒါပေမယ့် Log စစ်တာနဲ့ Backup လုပ်တာတွေကိုတော့ မမေ့သင့်ဘူး။

---

## ကိုးကားချက်များ

- [Debian Wiki: Unattended Upgrades](https://wiki.debian.org/UnattendedUpgrades)
- [Systemd Timers Documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html)
- [APT Configuration Manual](https://manpages.debian.org/apt/apt.conf.5.en.html)
- Tested On: Debian Trixie (13) and Bookworm (12)
