---
title: "Gnome Emoji Keyboard Flags and Extensions"
date: 2026-07-16T16:19:53+06:30
image: images/gnome_customized.png
thumbnail_image: images/gnome_customized.png
description: "GNOME Desktop ရဲ့ Keyboard Indicator မှာ နိုင်ငံအလံတွေ မပေါ်တဲ့ ပြဿနာကို System Code ပြင်ပြီး ဖြေရှင်းနည်းနဲ့ အသုံးဝင်တဲ့ Extensions များ"
summary: "GNOME Desktop ရဲ့ Keyboard Indicator မှာ နိုင်ငံအလံတွေ မပေါ်တဲ့ ပြဿနာကို System Code ပြင်ပြီး ဖြေရှင်းနည်းနဲ့ မရှိမဖြစ် Extensions များ"
categories: ["Linux", "Debian"]
tags: ["Debian", "GNOME", "Extensions", "Customization"]
series: ["Debian Customization"]
keywords: ["GNOME Keyboard Flags", "Emoji Flags", "GNOME Extensions", "Linux Customization"]
slug: "gnome-emoji-keyboard-flags-and-extensions"
---

Linux ကို သုံးရတဲ့ အရသာက ကိုယ်ပိုင်စိတ်ကြိုက် လွတ်လွတ်လပ်လပ် ကလိလို့ရတာပါပဲ ။ ဒါပေမယ့် Debian 13 လို စနစ်တွေမှာ ပါလာတဲ့ GNOME Desktop ကတော့ တချို့နေရာတွေမှာ ကန့်သတ်ချက်လေးတွေ ရှိနေတတ်တယ် ။ အထူးသဖြင့် အပေါ်ညာဘက်ထောင့်က Keyboard Indicator နေရာမှာ နိုင်ငံအလံလေးတွေ မပြပေးဘဲ 'en' နဲ့ 'my' ဆိုပြီး စာသားတွေပဲ ပြနေတာက တော်တော်လေး မျက်စိနောက်စရာကောင်းတယ် ။

GNOME Desktop က သူတို့ရဲ့ System Core Code ထဲကနေ နိုင်ငံအလံပြသတဲ့စနစ်ကို ဖြုတ်ချထားတာ ကြာပြီလို့ ဆိုရမယ် ။ Extension တွေ သုံးပြီး ဖြေရှင်းလို့ရပေမယ့်၊ တချို့ Extension တွေက OS Version အသစ်ထွက်တိုင်း လိုက်မကိုက်ညီဘဲ အလုပ်မလုပ်တော့တာမျိုးတွေ ခဏခဏ ကြုံရတတ်တယ် ။ ဒါကြောင့် Extension တွေ ခေါင်းကိုက်ခံစရာမလိုဘဲ System ဖိုင်ကို တိုက်ရိုက်ပြင်ပြီး Emoji အလံလေးတွေ အစားထိုးသုံးလိုက်တဲ့ နည်းလမ်းက တကယ်ကို မိုက်တယ် ။

ဒီနေ့တော့ အဲ့ဒီလို System File ကို တိုက်ရိုက်ပြင်ပြီး အလံလေးတွေ ဖော်မယ့်နည်းလမ်းရယ်၊ GNOME Desktop ကို ပိုပြီး ပြည့်စုံသွားစေမယ့် အခြား အသုံးဝင်တဲ့ Extension လေးတွေအကြောင်းရယ်ကို မျှဝေပေးသွားမယ် ။

- ### Extension မလိုဘဲ Keyboard နေရာမှာ Emoji အလံ ပြောင်းနည်း

ဒီနည်းလမ်းက OS Version ဘယ်လောက်မြင့်မြင့် ပျက်သွားတာမျိုးမရှိဘဲ တိုက်ရိုက် အလုပ်လုပ်တဲ့ အမိုက်စားနည်းလမ်းပါပဲ ။

**၁။ System File ကို ဖွင့်မယ်**
အရင်ဆုံး Terminal ကို ဖွင့်ပြီး System File ကို ပြင်ဖို့ အောက်ပါ Command ကို ရိုက်ထည့်လိုက်ပါ -

```bash
sudo nano /usr/share/X11/xkb/rules/evdev.xml

```

ပြင်ရမယ့်အပိုင်းကတော့ short Description ဆိုတဲ့ Keyboard Layout ကိုပြပေးတဲ့အပိုင်းလေးကိုပဲ ပြင်လိုက်ရမှာပါ။


```code
<shortDescription>value</shortDescription>
```

**၂။ အင်္ဂလိပ်စာ (English) အတွက် အလံပြောင်းမယ်**
Text Editor ပွင့်လာပြီဆိုရင် ကီးဘုတ်ကနေ Ctrl + W ကို နှိပ်ပြီး us လို့ ရိုက်ရှာပါ (Enter ခေါက်ပါ) ။
အဲ့ဒီအောက်နားလေးမှာ `en` ဆိုတဲ့ စာကြောင်းကို တွေ့ရမယ် ။ အဲ့ဒီ `en` ဆိုတဲ့ စာသားလေးကို ဖျက်ပြီး 🇺🇸 (US အလံ) သို့မဟုတ် 🇬🇧 (UK အလံ) Emoji ကို Copy ကူးပြီး Paste ချပေးလိုက်ပါ ။

![English Flag](images/kb_english.png)

**၃။ မြန်မာစာ (Myanmar) အတွက် အလံပြောင်းမယ်**
နောက်တစ်ခါ Ctrl + W ကို ထပ်နှိပ်ပြီး mm သို့မဟုတ် my လို့ ထပ်ရှာပါ ။
တွေ့ပြီဆိုရင် သူ့အောက်က my (သို့မဟုတ် mm) နေရာမှာ 🇲🇲 (မြန်မာအလံ Emoji) ကို အစားထိုးပေးလိုက်ပါ ။

![Burmese Flag](images/kb_burmese.png)

**၄။ Save လုပ်ပြီး Restart ချမယ်**
ပြင်ဆင်ပြီးသွားရင် Ctrl + O ကို နှိပ်ပြီး Enter ခေါက်ကာ Save လုပ်ပါ ။ Ctrl + X ကို နှိပ်ပြီး Editor ကနေ ထွက်ပါ ။ ပြင်ဆင်မှုတွေ အသက်ဝင်သွားအောင် ကွန်ပျူတာကို Restart တစ်ချက် ပြန်ချပေးလိုက်ပါ ။
ပြန်တက်လာရင် အပေါ်ထောင့် Indicator Bar မှာ en / my အစား 🇺🇸 နဲ့ 🇲🇲 အလံပုံလေးတွေ လှလှပပ ပေါ်နေတာကို မြင်ရပါလိမ့်မယ် ။

---

- ### မရှိမဖြစ် ထည့်သွင်းထားသင့်တဲ့ တခြား GNOME Extensions များ

Keyboard အတွက် ပြဿနာ ပြေလည်သွားပြီဆိုပေမယ့် Desktop ကြီးတစ်ခုလုံး ပိုမိုက်သွားအောင်၊ သုံးရတာ ပိုအဆင်ပြေအောင် အောက်ပါ Extension လေးတွေကို နာမည်အလိုက် အစဉ်လိုက် စီပေးထားတယ်။ Extension Manager ကနေ ကိုယ်လိုအပ်တာကို ရွေးပြီး Install လုပ်ထားလို့ရတယ်။

* [**AppIndicator and KStatusNotifierItem Support**](https://extensions.gnome.org/extension/615/appindicator-support/)
Debian/GNOME အသစ်တွေမှာ Telegram, Discord တို့လို App လေးတွေ ဖွင့်ထားရင် အပေါ်နားက System Tray မှာ Icon လေးတွေ သွားမပေါ်တော့ဘူး။ ဒီ Extension သွင်းလိုက်မှသာ နောက်ကွယ်မှာ Run နေတဲ့ App တွေရဲ့ Icon လေးတွေကို အလွယ်တကူ ပြန်မြင်ရပြီး ဝင်ရောက် ထိန်းချုပ်လို့ ရမှာဖြစ်တယ်။

* [**Bluetooth Battery Meter**](https://extensions.gnome.org/extension/6670/bluetooth-battery-meter/)
Bluetooth နားကြပ်၊ Mouse၊ Keyboard တွေ သုံးတတ်တယ်ဆိုရင် ဒီကောင်လေးက ဘက်ထရီ ရာခိုင်နှုန်း (Percentage) ကို အပေါ်ဘားမှာ အလွယ်တကူ ပြပေးတဲ့အတွက် မရှိမဖြစ် ဆောင်ထားသင့်တယ်။

* [**Caffeine**](https://extensions.gnome.org/extension/517/caffeine/)
Caffeine က ကွန်ပျူတာကို ခဏလောက် မထိဘဲထားတဲ့အခါ Screen မှောင်သွားတာ၊ Screensaver အလိုအလျောက် ပွင့်လာတာနဲ့ စက်က Auto Suspend ဝင်သွားတာတွေကို ယာယီပိတ်ထားပေးတဲ့ အသုံးဝင်တဲ့ Extension လေးတစ်ခု ဖြစ်တယ်။ ရုပ်ရှင်ကြည့်နေချိန်၊ Presentation ပြနေချိန်၊ ဖိုင်အကြီးကြီး Download ဆွဲနေချိန်၊ အချိန်ကြာကြာ Run ရမယ့် Command ဒါမှမဟုတ် လုပ်ငန်းစဉ်တစ်ခုခုကို စောင့်နေချိန်တွေမှာ စက်ကို မကြာခဏ Mouse လှုပ်ပေးနေစရာမလိုဘဲ နိုးနေအောင် ထိန်းထားပေးနိုင်တယ်။ အပေါ်ဘားက ကော်ဖီခွက် Icon ကို တစ်ချက်နှိပ်ပြီး Caffeine ကို ဖွင့်ထားလိုက်ရုံနဲ့ Screensaver နဲ့ Automatic Suspend ကို တားထားပေးမှာဖြစ်ပြီး၊ အလုပ်ပြီးသွားတဲ့အခါ ပြန်ပိတ်လိုက်ရင် ကိုယ့်ရဲ့ မူလ Power Setting တွေအတိုင်း ပုံမှန်ပြန်အလုပ်လုပ်သွားမယ်။ Laptop သုံးတဲ့အခါ မလိုအပ်ဘဲ အမြဲဖွင့်ထားရင် ဘက်ထရီပိုကုန်နိုင်တာကြောင့် လိုအပ်တဲ့အချိန်မှာပဲ ဖွင့်သုံးတာ ပိုကောင်းတယ်။

* [**Compiz windows effect**](https://extensions.gnome.org/extension/3210/compiz-windows-effect/)
ပြတင်းပေါက် (Window) တွေကို ရွှေ့တဲ့အခါ၊ ပိတ်တဲ့အခါတွေမှာ ရေလှိုင်းလို လှုပ်ခါသွားတာမျိုး၊ အရမ်းမိုက်တဲ့ Animation အထူးပြုလုပ်ချက်တွေ ထည့်ပေးတဲ့ကောင်လေး။ Desktop ကို သုံးရတာ ပိုပြီး အသက်ဝင်သွားစေတယ်။

* [**Dash2Dock Animated**](https://extensions.gnome.org/extension/4994/dash2dock-lite/)
GNOME ရဲ့ မူလသဘာဝအရ Application တွေဖွင့်မှ အောက်က Bar ကြီး ပေါ်လာတာမျိုးက သုံးရတာ နည်းနည်း အဆင်မပြေဖြစ်တတ်တယ်။ ဒါလေးသုံးလိုက်ရင် အောက်ခြေမှာ လှပတဲ့ Dock လေး အမြဲပေါ်နေစေတဲ့အပြင် Animation အမိုက်စားလေးတွေပါ ထည့်ပေးထားသေးတယ်။ Icon အရွယ်အစားကိုလည်း စိတ်ကြိုက် ပြင်ဆင်လို့ ရသေးတယ်။

* [**IP Finder**](https://extensions.gnome.org/extension/2983/ip-finder/)
ကိုယ့်စက်ရဲ့ Local IP ရော Public IP ကိုပါ အပေါ်ဘားကနေ ကလစ်တစ်ချက်နှိပ်ရုံနဲ့ အလွယ်တကူ ကြည့်လို့ရ၊ Copy ကူးလို့ရတဲ့အတွက် အရမ်းအသုံးဝင်တယ်။

* [**Move Keyboard Indicator to Center**](https://extensions.gnome.org/extension/9397/move-keyboard-indicator-to-center/)
အပေါ်ညာဘက်ထောင့်မှာ ရှိနေတဲ့ Keyboard Indicator (အလံလေးတွေ) ကို မျက်စိပိုရှင်းအောင်၊ မြင်ရပိုလွယ်အောင် အပေါ်ဘားရဲ့ အလယ်တည့်တည့်ကို ရွှေ့ပေးတဲ့ကောင်လေး။

* [**Systemd Status**](https://extensions.gnome.org/extension/6045/systemd-status/)
နောက်ကွယ်က Run နေတဲ့ System Services (Systemd) တွေရဲ့ အခြေအနေကို အပေါ်ဘားကနေ လွယ်လွယ်ကူကူ စစ်ဆေးလို့ရတယ်။ System ကို ခဏခဏ ကလိတတ်တဲ့သူတွေ ဆောင်ထားသင့်တယ်။

ဒီလောက်ဆိုရင်တော့ သင့်ရဲ့ Debian 13 ဟာ ရိုးရှင်းတဲ့ GNOME ကြီးကနေ သုံးရတာ အဆင်ပြေပြီး မျက်စိပသာဒဖြစ်စေမယ့် အမိုက်စား Desktop တစ်ခုအဖြစ် ပြောင်းလဲသွားပြီပဲ ဖြစ်တယ် ။
