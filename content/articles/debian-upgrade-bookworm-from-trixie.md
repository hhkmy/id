---
title: "Debian 12 (Bookworm) မှ Debian 13 (Trixie) သို့ အဆင့်မြှင့်တင်ခြင်း"
date: 2026-07-15T15:37:50+06:30
author: heinhtetkyaw
image: images/laptop_folders_sort.jpeg
thumbnail_image: images/laptop_folders_sort.jpeg
description: "Debian 12 (Bookworm) ကနေ နောက်ဆုံးထွက် Debian 13 (Trixie) ကို ဘေးကင်းစိတ်ချစွာ ဘယ်လို Upgrade လုပ်မလဲဆိုတဲ့ အသေးစိတ် လမ်းညွှန်"
summary: "ဒီ Post မှာတော့ Debian 12 (Bookworm) သုံးနေတဲ့သူတွေအနေနဲ့ နောက်ဆုံးထွက် Version ဖြစ်တဲ့ Debian 13 (Trixie) ကို အလွယ်တကူနဲ့ အမှားအယွင်းမရှိ ဘယ်လို Upgrade လုပ်ရမလဲ ဆိုတာကို အဆင့်ဆင့် ရှင်းပြပေးထားတယ်။"
categories: ["Linux", "System Administration"]
tags: ["Debian", "Bookworm", "Trixie", "Upgrade", "Linux"]
series: ["Debian Guides"]
keywords: ["debian upgrade", "debian 12 to 13", "debian bookworm to trixie", "linux upgrade guide"]
slug: "debian-12-to-13-upgrade-guide"
---

ဒီနေ့တော့ ကျွန်တော်တို့ သုံးနေတဲ့ Debian 12 (Bookworm) ကနေ နောက်ဆုံးထွက်ထားတဲ့ Debian 13 (Trixie) ကို ဘယ်လို Upgrade လုပ်မလဲဆိုတာကို အသေးစိတ် ပြောပြပေးသွားမယ်။ Server တွေမှာဖြစ်ဖြစ်၊ ကိုယ့်ရဲ့ Personal Computer မှာဖြစ်ဖြစ် OS Version အသစ်တစ်ခုကို ကူးပြောင်းတော့မယ်ဆိုရင် သတိထားရမယ့် အချက်လေးတွေ အများကြီးရှိတယ်။ ဒါကြောင့် အမှားအယွင်းမရှိ ချောချောမွေ့မွေ့နဲ့ ဘယ်လိုလုပ်ရမလဲဆိုတာကို အဆင့်ဆင့် လိုက်လုပ်ကြည့်ရအောင်။

- **အရင်ဆုံး ဘာတွေပြင်ဆင်ထားရမလဲ?**

Upgrade မလုပ်ခင်မှာ အရေးအကြီးဆုံးက Backup လုပ်ဖို့ပဲ။ ကိုယ့်ရဲ့ အရေးကြီးတဲ့ Data တွေ၊ Configuration File တွေကို သေချာ Backup လုပ်ထားသင့်တယ်။ VM (Virtual Machine) သုံးနေတယ်ဆိုရင်တော့ Snapshot တစ်ခုလောက် အရင်ယူထားလိုက်တာ အကောင်းဆုံးပဲ။ ပြဿနာတစ်ခုခုတက်ခဲ့ရင် အလွယ်တကူ ပြန်ဆုတ်လို့ရတာပေါ့။

- **အဆင့် (၁) - လက်ရှိ System ကို Update လုပ်မယ်**

ပထမဆုံးအနေနဲ့ လက်ရှိသုံးနေတဲ့ Debian 12 ကို နောက်ဆုံး Update ဖြစ်နေအောင် အရင်လုပ်ရမယ်။ Terminal ကိုဖွင့်ပြီး အောက်က Command တွေကို တစ်ကြောင်းချင်းစီ ရိုက်ထည့်လိုက်မယ်။

```bash
sudo apt update
sudo apt upgrade
sudo apt full-upgrade
sudo apt autoremove
```

ဒီနေရာမှာ Package တွေ အကုန်လုံး Update ဖြစ်သွားပြီ၊ ဘာ error မှ မရှိဘူးဆိုတာ သေချာပြီဆိုရင်တော့ နောက်တစ်ဆင့်ကို သွားလို့ရပြီ။

- **အဆင့် (၂) - APT Sources တွေကို ပြင်မယ်**

ခုနက လုပ်ခဲ့တာတွေက ပြီးသွားပြီဆိုရင်တော့ ကျွန်တော်တို့ရဲ့ System ကို Debian 13 (Trixie) ရဲ့ Repository တွေဆီ ညွှန်ပေးဖို့ လိုလာပြီ။ ဒါကြောင့် `/etc/apt/sources.list` ဖိုင်ထဲမှာရှိတဲ့ `bookworm` ဆိုတဲ့ စာသားတွေနေရာမှာ `trixie` ဆိုပြီး ပြောင်းပေးရမယ်။ Text Editor တစ်ခုခုနဲ့ ဖွင့်ပြင်လို့ရသလို၊ အောက်က sed command ကိုသုံးပြီး အလွယ်တကူ ပြောင်းလိုက်လို့လည်း ရတယ်။

```bash
sudo sed -i 's/bookworm/trixie/g' /etc/apt/sources.list
```

(Third-party repo တွေ သုံးထားတယ်ဆိုရင်တော့ `/etc/apt/sources.list.d/` အောက်က ဖိုင်တွေကိုပါ သေချာလိုက်စစ်ပြီး ပြင်ပေးဖို့ လိုမယ်။ လောလောဆယ် မလိုအပ်တဲ့ Repo တွေကို Disable လုပ်ထားတာ ပိုစိတ်ချရတယ်။)

![Debian Upgrade Process](images/laptop_folders_sort.jpeg)

- **အဆင့် (၃) - အသစ်ပြောင်းထားတဲ့ Source တွေကို Update ပြန်လုပ်မယ်**

Source တွေ ပြင်ပြီးသွားပြီဆိုတော့ Package List ကို အသစ်ပြန်ယူရမယ်။

```bash
sudo apt update
```

ဒီအချိန်မှာ Trixie ရဲ့ Package တွေကို စပြီး ဆွဲယူနေတာ တွေ့ရလိမ့်မယ်။

- **အဆင့် (၄) - Minimal Upgrade အရင်လုပ်မယ်**

Full Upgrade တန်းမလုပ်ခင်မှာ System ရဲ့ အရေးကြီးတဲ့ အစိတ်အပိုင်းတွေကို အရင် Upgrade လုပ်တာက ပိုပြီး ဘေးကင်းတယ်။ ဒါကြောင့် အောက်က Command ကို အရင် Run လိုက်မယ်။

```bash
sudo apt upgrade --without-new-pkgs
```

ဒီအဆင့်မှာ ရှိပြီးသား Package တွေကိုပဲ Upgrade လုပ်သွားမှာဖြစ်ပြီး Package အသစ်တွေ သွင်းတာမျိုး၊ ဟောင်းနေတာတွေ ဖြုတ်တာမျိုး မလုပ်သေးဘူး။

- **အဆင့် (၅) - Full System Upgrade လုပ်မယ်**

အခုဆိုရင်တော့ System တစ်ခုလုံးကို Trixie အဖြစ် အပြည့်အဝ ပြောင်းလဲဖို့ အဆင်သင့်ဖြစ်နေပြီ။

```bash
sudo apt full-upgrade
```

ဒီလုပ်ငန်းစဉ်က အချိန်တော်တော်လေး ယူရနိုင်တယ်။ Download လုပ်ရမယ့် File Size ကလည်း ကြီးသလို၊ Install လုပ်တဲ့ အချိန်မှာလည်း Service တွေ Restart လုပ်မလား ဆိုတာမျိုးတွေ မေးလာလိမ့်မယ်။ Configuration File အဟောင်းတွေနဲ့ အသစ်တွေ တိုက်ဆိုင်စစ်ဆေးတဲ့အခါမှာ ကိုယ်တိုင် ပြင်ဆင်ထားတာမျိုး မရှိဘူးဆိုရင် Maintainer ရဲ့ Version အသစ်ကို ရွေးပေးလိုက်တာ အကောင်းဆုံးပဲ။

- **အဆင့် (၆) - မလိုတော့တဲ့ Package တွေကို ရှင်းလင်းမယ်**

Upgrade လုပ်တာ ပြီးသွားပြီဆိုရင် အရင် Version တုန်းက လိုအပ်ခဲ့ပေမယ့် အခု မလိုတော့တဲ့ Library တွေ၊ Package တွေ အများကြီး ကျန်ခဲ့လိမ့်မယ်။ ဒါတွေကို ရှင်းထုတ်ဖို့အတွက် autoremove ကို သုံးလိုက်မယ်။

```bash
sudo apt autoremove
```

(စောစောက ကျွန်တော်တို့ မြင်ခဲ့ရတဲ့ အတိုင်းပဲ Package အဟောင်း ၁၄၀ လောက်ကို ဖျက်ထုတ်သွားတာ တွေ့ရလိမ့်မယ်။ နေရာလွတ်လည်း 1GB ကျော်လောက် ပြန်ရလာမယ်။)

![Debian System Cleanup](images/after_upgrade.avif)

- **အဆင့် (၇) - System ကို Reboot ချပြီး စစ်ဆေးမယ်**

အကုန်လုံး ပြီးစီးသွားပြီဆိုရင်တော့ Kernel အသစ်၊ System အသစ်နဲ့ အလုပ်လုပ်ဖို့အတွက် Reboot ချပေးဖို့ လိုတယ်။

```bash
sudo reboot
```

စက်ပြန်တက်လာပြီဆိုရင်တော့ ကိုယ့်ရဲ့ OS က Debian 13 (Trixie) သေချာဖြစ်သွားပြီလားဆိုတာကို အောက်က Command လေးနဲ့ စစ်ကြည့်လို့ရပြီ။

```bash
cat /etc/debian_version
```

ဒါမှမဟုတ် `fastfetch` လို Tool လေးသုံးပြီး ကြည့်လိုက်ရင်လည်း လှလှပပလေး မြင်ရမှာပဲ။

ဒါဆိုရင်တော့ Debian 12 ကနေ Debian 13 ကို အောင်မြင်စွာနဲ့ Upgrade လုပ်လို့ ပြီးသွားပြီ။ အဆင့်တွေကို ဖြည်းဖြည်းချင်း သေချာလိုက်လုပ်မယ်ဆိုရင် ဘာ Error မှ မတက်ဘဲ အဆင်ပြေပြေ သုံးနိုင်မှာ သေချာတယ်။
