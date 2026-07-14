---
title: "Debugging Slow File Picker (GTK Dialog) Issue on Debian Linux"
date: 2026-07-13T22:28:42+06:30
author: heinhtetkyaw
image: "images/fastfetch.png"
thumbnail_image: "images/fastfetch.png"
description: "Debian OS အသစ်ပြန်တင်ပြီး /home partition အဟောင်းကို ဆက်သုံးလိုက်တဲ့နောက် GTK File Picker အရမ်းနှေးသွားတဲ့ ပြဿနာကို Debug လုပ်ပြီး ဖြေရှင်းခဲ့တဲ့အကြောင်း။"
summary: "OS အသစ်ပြန်တင်ပြီး /home partition အဟောင်းကို ဆက်သုံးလိုက်တဲ့နောက် File Picker အရမ်းနှေးသွားလို့ အဆင့်ဆင့် Debug လုပ်ပြီး ဖြေရှင်းခဲ့တဲ့ မှတ်တမ်း။"
categories: ["Linux", "System Administration", "Troubleshooting"]
tags: ["Debian", "GTK", "GVFS", "Debugging", "xdg-desktop-portal"]
series:
keywords: ["Debian Linux", "slow file dialog", "xdg-desktop-portal timeout", "gvfs-metadata corruption", "Linux troubleshooting"]
slug: debugging-slow-file-picker-debian
---
OS ပျက်သွားလို့ အသစ်ပြန်တင်ရတဲ့အချိန် ကိုယ့်ဖိုင်တွေ မပျောက်အောင် `/` (Root) နဲ့ `/home` ကို Partition သီးသန့်ခွဲထားတာက တော်တော်အဆင်ပြေတယ်။ ဒီတစ်ခေါက်လည်း OS အသစ်ပြန်တင်ပြီး `/home` ကို Format မချဘဲ အဟောင်းအတိုင်း ပြန်သုံးလိုက်တယ်။ ဖိုင်တွေကတော့ အကုန်ရှိနေပေမယ့် မထင်ထားတဲ့ ပြဿနာတစ်ခု ပါလာခဲ့တယ်။

Firefox ဖြစ်ဖြစ် တခြား Application တစ်ခုခုကဖြစ်ဖြစ် File Attach / Save လုပ်ဖို့ File Picker (GTK Dialog) ခေါ်လိုက်တိုင်း ချက်ချင်းမပွင့်ဘဲ စက္ကန့် ၂၀-၃၀ လောက် Hang နေတာပဲ။ ဘာကြောင့်ဖြစ်တာလဲဆိုတာ တစ်ဆင့်ချင်း Debug လုပ်ရင်း နောက်ဆုံး ဖြေရှင်းလိုက်နိုင်တဲ့အကြောင်း ဒီမှာ မှတ်တမ်းထားလိုက်တယ်။


## The Problem: ဖိုင်ရွေးရန် Box တက်လာဖို့ အလွန်နှေးကွေးနေခြင်း

အရင်တုန်းက File Dialog ခေါ်လိုက်ရင် ချက်ချင်းပွင့်တယ်။ `/` နဲ့ `/home` ကို ခွဲပြီး OS အသစ်ပြန်တင်လိုက်တဲ့နောက်မှ ဖိုင်ရွေးတဲ့ Box တက်လာဖို့ အကြာကြီးစောင့်နေရတာ။ ဒီတော့ ဘယ်နေရာမှာ ငြိနေလဲ သိရအောင် တစ်ဆင့်ချင်း လိုက်စစ်ကြည့်ခဲ့တယ်။

![Linux Terminal Interface](images/sudo_terminal.jpg)

## Debugging Phase 1: Live Log Monitoring (`journalctl`)

ပထမဆုံး File Picker နှေးနေတဲ့အချိန် System နောက်ကွယ်မှာ ဘာတွေငြိနေလဲ သိရအောင် `journalctl` နဲ့ User Session ရဲ့ Live Log ကို ကြည့်လိုက်တယ်။

```bash
journalctl --user -f

```

File Picker ကို ခေါ်လိုက်တော့ ဒီ Error တွေ တက်လာတယ်။

```text
Unable to load /home/hhk/.local/share/recently-used.xbel: Failed to open file
Error on line 1 char 1: Document was empty or contained only whitespace

```

### Analysis & Fix:

`recently-used.xbel` ဆိုတာ GTK က Recent Files တွေကို မှတ်ထားတဲ့ XML ဖိုင်။ စစ်ကြည့်တော့ ဒီဖိုင်က 0-byte၊ ဘာစာမှမရှိတဲ့ ဖိုင်အလွတ်ဖြစ်နေတယ်။ GTK Parser က ဖွင့်ဖတ်တဲ့အချိန် Format မမှန်လို့ Error တက်နေတာလို့ ယူဆပြီး ဖိုင်ဟောင်းကိုဖျက်၊ မှန်ကန်တဲ့ XML Format နဲ့ အသစ်ပြန်လုပ်ကြည့်လိုက်တယ်။

```bash
rm ~/.local/share/recently-used.xbel
echo '<?xml version="1.0" encoding="UTF-8"?><xbel version="1.0" xmlns:bookmark="http://www.freedesktop.org/standards/desktop-bookmarks" xmlns:mime="http://www.freedesktop.org/standards/shared-mime-info"></xbel>' > ~/.local/share/recently-used.xbel

```

> **ရလဒ် -** XML Error ကတော့ ပျောက်သွားတယ်။ ဒါပေမယ့် File Picker က နှေးနေတုန်းပဲ။ ဆိုတော့ တခြားနေရာမှာ ပြဿနာရှိနေသေးတယ်။


## Debugging Phase 2: Hardware Health Check (`dmesg`)

နောက်တစ်ဆင့်အနေနဲ့ Partition ခွဲထားလို့ Disk I/O Error တက်နေတာလား၊ Hardware Power Saving ကြောင့်လားဆိုတာ သေချာအောင် `dmesg` နဲ့ Kernel Log ကို ဆက်ကြည့်တယ်။

```bash
sudo dmesg -w

```

### Analysis & Fix:

Log တစ်လျှောက်လုံး စစ်ကြည့်ပေမယ့် `I/O error`, `EXT4-fs error` လို Hardware ဒါမှမဟုတ် File System ပိုင်း Error တစ်ခုမှ မတွေ့ဘူး။ သုံးထားတဲ့ SSD (Samsung 860 EVO) ရဲ့ Health ကလည်း ကောင်းနေတော့ Hardware ကြောင့် မဟုတ်တာ သေချာသွားတယ်။

![SSD Debug](images/ssd_debug.jpg)

## Debugging Phase 3: The Portal Clash Issue

နောက်ထပ်သံသယဝင်တာက `xdg-desktop-portal` ပိုင်း။ Debian 12 (Bookworm) နဲ့ သူ့အထက် Version တွေမှာ ပါလာတဲ့ `xdg-desktop-portal` v1.16+ မှာ Portal မတူတာတွေ ရောနေရင် ဘယ် Portal ကိုသုံးရမလဲ ရွေးမရဘဲ Timeout အထိ စောင့်နေတတ်တဲ့ ပြဿနာရှိတယ်။ ဒီတော့ စက်ထဲမှာ ဘယ် Portal တွေရှိလဲ စစ်ကြည့်လိုက်တယ်။

```bash
dpkg -l | grep xdg-desktop-portal

```

စစ်ကြည့်တော့ `xdg-desktop-portal-gnome` နဲ့ `xdg-desktop-portal-gtk` နှစ်ခုလုံး Run နေတာ တွေ့တယ်။

### Analysis & Fix:

System က ဘယ် Portal ကို Default သုံးရမလဲ သေချာသွားအောင် User Config ဖိုင်တစ်ခု ရေးပြီး Service တွေကို Restart လုပ်ကြည့်လိုက်တယ်။

```bash
mkdir -p ~/.config/xdg-desktop-portal
echo -e "[preferred]\ndefault=gnome;gtk" > ~/.config/xdg-desktop-portal/portals.conf
systemctl --user restart xdg-desktop-portal xdg-desktop-portal-gnome xdg-desktop-portal-gtk

```

> **ရလဒ် -** Portal Service တွေ Restart ဖြစ်သွားပေမယ့် File Picker ကတော့ လိုတာထက်ပိုပြီး ကြာနေတုန်းပဲ။


## Debugging Phase 4: The Ultimate Root Cause (GVFS Metadata)

အပေါ်ကဟာတွေ လုပ်ပြီးတာတောင် မကောင်းသေးတော့ နောက်ဆုံး **OS အဟောင်းက ကျန်ခဲ့တဲ့ Stale GVFS Metadata** တွေဘက်ကို ရောက်သွားတယ်။

OS ကို အသစ်ပြန်တင်ပေမယ့် `/home` ကိုတော့ အဟောင်းအတိုင်း ဆက်သုံးထားတယ်။ အရင် OS မှာ ချိတ်ခဲ့ဖူးတဲ့ Network Drive တွေ၊ မရှိတော့တဲ့ ဖိုင်လမ်းကြောင်းတွေနဲ့ Disk UUID အဟောင်းတွေက `~/.local/share/gvfs-metadata/` ထဲမှာ ကျန်နေနိုင်တယ်။

File Picker တက်လာတိုင်း GTK က အဲ့ဒီမရှိတော့တဲ့ လမ်းကြောင်းတွေကို Timeout ဖြစ်တဲ့အထိ လိုက်ရှာနေလို့ စက္ကန့် ၃၀ လောက် ရပ်နေတာဖြစ်နိုင်တယ်။ ဒီတစ်ခါတော့ GVFS Metadata အဟောင်းတွေကို ရှင်းကြည့်လိုက်တယ်။

### The Final Resolution:

အရင် OS ကကျန်ခဲ့တဲ့ File System မှတ်တမ်းအဟောင်းတွေ (Cache) ကို ဒီလိုရှင်းလိုက်တယ်။ ဒါက ကိုယ့် Personal File တွေကို မထိဘူး။

**၁။ GVFS Service တွေပိတ်ပြီး Metadata ရှင်းခြင်း**

```bash
killall gvfsd gvfsd-trash gvfsd-metadata
rm -rf ~/.local/share/gvfs-metadata/*

```

**၂။ Computer ကို Restart ချခြင်း**

Service တွေ Restart လုပ်ရုံနဲ့ Memory ထဲမှာ Run နေတဲ့ D-Bus Session နဲ့ GTK Background Service တွေ အကုန်အသစ်ပြန်မဖြစ်နိုင်သေးဘူး။ ဒါကြောင့် စောစောကရေးထားတဲ့ `portals.conf` နဲ့ GVFS Metadata ရှင်းထားတာတွေ အကုန်အသက်ဝင်အောင် Computer ကို Restart ချလိုက်တယ်။

## Conclusion & Key Takeaways

Computer ပြန်တက်လာပြီး Browser နဲ့ Application တွေကနေ File Dialog ခေါ်ကြည့်တော့ ဒီတစ်ခါ လုံးဝမကြာတော့ဘဲ ချက်ချင်းပွင့်လာတယ်။ နောက်ဆုံးတော့ တရားခံက `/home` အဟောင်းထဲမှာ ကျန်ခဲ့တဲ့ GVFS Metadata ပဲ။

![HP Laptop](images/hp_laptop.jpg)

နောက်တစ်ခါ ကိုယ်တိုင်ပြန်ကြုံရင်ဖြစ်ဖြစ်၊ တခြားသူတွေ ဒီလိုဖြစ်ရင်ဖြစ်ဖြစ် အလွယ်ပြန်ကြည့်လို့ရအောင် မှတ်ထားချင်တာ သုံးချက်ရှိတယ်။

1. **`/home` အဟောင်းနဲ့အတူ Cache အဟောင်းတွေလည်း ပါလာနိုင်တယ်။** OS အသစ်ပြန်တင်ပြီး `/home` ကို ဆက်သုံးတဲ့အခါ GVFS Metadata အဟောင်းတွေက ပြဿနာပေးနိုင်လို့ `~/.local/share/gvfs-metadata/` ကို သတိရပြီး စစ်ကြည့်ရမယ်။
2. **Portal တွေ ရောနေတာလည်း စစ်သင့်တယ်။** `xdg-desktop-portal` ဘက်က Timeout ဖြစ်နေလား၊ `portals.conf` မှာ Default Portal သတ်မှတ်ဖို့လိုလား ကြည့်ရမယ်။
3. **Session-level ပြောင်းလဲမှုဆို Restart က အရေးပါတယ်။** Config အသစ်နဲ့ D-Bus / GVFS ပြောင်းထားတာတွေက `systemctl restart` တစ်ခုတည်းနဲ့ မလုံလောက်တတ်ဘူး။ Full Restart ဒါမှမဟုတ် Logout/Login ပြန်လုပ်တာက ပိုသေချာတယ်။
