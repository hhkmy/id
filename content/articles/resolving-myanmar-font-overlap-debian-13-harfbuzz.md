---
title: "Resolving Myanmar Font Rendering Issues on Debian 13 with HarfBuzz and Noto Fonts"
date: 2026-07-17T02:07:59+06:30
image: images/HarfBuzz.png
thumbnail_image: images/HarfBuzz.png
description: "Debian 13 တွင် HarfBuzz နှင့် Pyidaungsu Font ပဋိပက္ခကြောင့် မြန်မာစာအက္ခရာများ ထပ်နေသည့် ပြဿနာကို Noto Sans Myanmar နှင့် Fontconfig ပြင်ဆင်မှုဖြင့် ဖြေရှင်းခဲ့ပုံ။"
summary: "Debian 13 Trixie တွင် Pyidaungsu Font သုံးထားသော်လည်း HarfBuzz Shaping Engine ကြောင့် အက္ခရာများ ထပ်နေသော ပြဿနာကို `fonts-noto-core` သွင်းပြီး Font Fallback သတ်မှတ်ပေးခြင်းဖြင့် ဖြေရှင်းခဲ့သည့် မှတ်တမ်း။"
categories: ["Linux", "System Administration", "Troubleshooting"]
tags: ["Debian", "GNOME", "Fonts", "HarfBuzz", "Noto", "Myanmar", "Pyidaungsu"]
series: ["Debian Troubleshooting"]
keywords: ["Debian 13 font bug", "HarfBuzz Myanmar overlap", "fonts-noto-core", "fontconfig fallback", "Burmese font not rendering correctly"]
slug: "resolving-myanmar-font-overlap-debian-13-harfbuzz"
---
Debian 13 (Trixie) ကို Upgrade လုပ်ပြီးတဲ့နောက်၊ ဒါမှမဟုတ် OS အသစ်ပြန်တင်ပြီးနောက် ကြုံရတတ်တဲ့ ပြဿနာတစ်ခုရှိတယ်။ အဲ့ဒါက မြန်မာစာအက္ခရာတွေ တစ်ခုနဲ့တစ်ခု ထပ်နေပြီး ဖတ်လို့မရတော့တဲ့ ပြဿနာပဲ။ Desktop Environment မှာ ဖြစ်ဖြစ်၊ Browser ထဲမှာ ဖြစ်ဖြစ် အက္ခရာတွေ ရှုပ်ပွနေတာ တွေ့ရလိမ့်မယ်။ ဒီ Post မှာတော့ ဒီပြဿနာ ဘာကြောင့်ဖြစ်တာလဲ၊ ဘယ်လို Debug လုပ်ခဲ့လဲ၊ နောက်ဆုံး `fonts-noto-core` နဲ့ Fontconfig ပြင်ဆင်မှုဖြင့် ဘယ်လို ပြေလည်သွားခဲ့လဲဆိုတာ မှတ်တမ်းတင်ထားလိုက်တယ်။

![HarfBuzz](images/HarfBuzz.png)

## The Problem: မြန်မာအက္ခရာတွေ ထပ်နေပြီး ရှုပ်ပွနေခြင်း

Debian 13 မှာ Installed လုပ်ခဲ့တဲ့ Pyidaungsu Font ကိုသုံးပြီး Facebook, Browser, ဒါမှမဟုတ် GTK Application တွေမှာ မြန်မာစာဖတ်လိုက်တိုင်း ဗျည်းတွေ၊ သရတွေ အကုန်လုံး ရောထွေးပြီး အပေါ်အောက်ထပ်နေတာ တွေ့ရတယ်။ တချို့နေရာတွေမှာ `အ` နဲ့ `ခ` အကြား ကွာဟမှု မရှိတော့ဘဲ စာကြောင်းတစ်ခုလုံး အဖုအထစ်ကြီးလို ဖြစ်နေတာ။ ဒီပြဿနာက Application အားလုံးမှာ ဖြစ်နေတဲ့အတွက် System-wide Font Problem ဖြစ်မယ်လို့ ယူဆမိတယ်။

![HarfBuzz Browser](images/HarfBuzz_browser.png)

## Debugging Phase 1: Font Availability Check

ပထမဆုံး စက်ထဲမှာ ဘာ Font တွေရှိလဲ၊ ဘာ Font တွေကို System က ဦးစားပေးသုံးနေလဲ ဆိုတာ `fc-list` နဲ့ စစ်ကြည့်လိုက်တယ်။ အဲ့ဒီနောက်မှာတော့ pyidaungsu font ကိုတွေ့တာနဲ့တန်းပြီး ဘယ်နေရာကနေ သုံးနေလဲ မသုံးနေလဲ စစ်ကြည့်လိုက်တယ်။

```bash
fc-list | grep -i pyidaungsu
```

```text
/home/hhk/.local/share/fonts/Pyidaungsu-Regular.ttf: Pyidaungsu:style=Regular
/usr/share/fonts/truetype/pyidaungsu/Pyidaungsu-Bold.ttf: Pyidaungsu:style=Bold
/usr/share/fonts/truetype/pyidaungsu/Pyidaungsu-Regular.ttf: Pyidaungsu:style=Regular
```

System ထဲမှာ Pyidaungsu Font ရှိနေတာ သေချာပါတယ်။ ဒါပေမယ့် ဒီ Font ကို အသုံးပြုလိုက်တိုင်း ဒီလိုဖြစ်နေတာက ဘာကြောင့်လဲ?

## Debugging Phase 2: Understanding the Root Cause (HarfBuzz Shaping Engine)

Deep Dive နည်းနည်းလုပ်ကြည့်တော့ ဒီပြဿနာရဲ့ အဓိက တရားခံက **HarfBuzz** ပဲ။ HarfBuzz ဆိုတာ Linux စနစ်တွေမှာ စာလုံးတွေကို ပုံဖော်ပြီး Render လုပ်ပေးတဲ့ Shaping Engine ပါ။ Debian 13 မှာ ပါဝင်တဲ့ HarfBuzz ဗားရှင်းအသစ်တွေဟာ Pyidaungsu Font ရဲ့ Layout နဲ့ သေချာမကိုက်ညီတော့ဘူး။ အဲ့ဒါကြောင့် HarfBuzz က Glyph (အက္ခရာအပိုင်းအစတွေ) တွေကို နေရာချထားတဲ့အခါ မှားယွင်းပြီး တစ်ခုနဲ့တစ်ခု ထပ်နေအောင် နေရာချမိတာ။

Pyidaungsu ကိုပဲ ဆက်သုံးချင်တယ်ဆိုရင် HarfBuzz ကို Disable လုပ်ရမယ်၊ Font အဟောင်းတွေကို ရှာသုံးရမယ် စသဖြင့် ရှုပ်ထွေးသွားနိုင်တယ်။ ဒါကြောင့် **ပိုပြီး Standard ဖြစ်တဲ့၊ HarfBuzz အသစ်နဲ့ လုံးဝအဆင်ပြေတဲ့ `Noto` Font ကိုပြောင်းသုံးဖို့** ဆုံးဖြတ်လိုက်တယ်။

## Debugging Phase 3: Noto Fonts Installation နှင့် Conflict ဖြေရှင်းခြင်း

ပထမဆုံး Debian Repository ထဲက `fonts-noto-core` ကို Install လုပ်လိုက်တယ်။

```bash
sudo apt install fonts-noto-core
```

Install ပြီးသွားပေမယ့် Browser ပြန်ဖွင့်ကြည့်တဲ့အခါ စာသားတွေ ထပ်နေတုန်းပဲ။ ဒီတစ်ခါ `fc-match` နဲ့ စစ်ကြည့်တော့ System က `Noto Sans Myanmar` ကို ဦးစားပေးသုံးမယ့်အစား `Pyidaungsu` ကိုပဲ ဆက်သုံးနေတာ တွေ့ရတယ်။ Font Fallback Priority မှာ Pyidaungsu က ရှေ့ရောက်နေတာ။

```bash
fc-match -s "sans-serif" | head -5
```

အပေါ်က Output မှာ Pyidaungsu တွေ ရှေ့ဆုံးမှာ ရောက်နေတယ်။ ဒီတော့ ပြဿနာက `Noto` Font ကို System က ဦးစားပေးပြီး သုံးအောင် ဘယ်လိုလုပ်မလဲဆိုတဲ့ အဆင့်ရောက်သွားတယ်။

## Debugging Phase 4: The Ultimate Fix - Fontconfig Fallback Configuration

`fc-match` ရဲ့ ဦးစားပေးစနစ်ကို ပြောင်းလဲဖို့ Fontconfig Configuration ကို ပြင်ဖို့ လိုလာတယ်။ `~/.config/fontconfig/fonts.conf` ဖိုင်ကို ဖန်တီးပြီး မြန်မာစာ (my) Language အတွက် `sans-serif` နေရာမှာ `Noto Sans Myanmar` ကို ဦးစားပေးသုံးအောင် သတ်မှတ်ပေးလိုက်တယ်။

```bash
mkdir -p ~/.config/fontconfig
nano ~/.config/fontconfig/fonts.conf
```

ဖိုင်ထဲမှာ အောက်ပါ Config ကို ထည့်ပေးလိုက်တယ်။

```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <match>
    <test name="lang" compare="contains">
      <string>my</string>
    </test>
    <test name="family">
      <string>sans-serif</string>
    </test>
    <edit name="family" mode="prepend" binding="strong">
      <string>Noto Sans Myanmar</string>
    </edit>
  </match>
</fontconfig>
```

အဓိပ္ပာယ်ကတော့ Language က `my` ဖြစ်ပြီး၊ Font Family က `sans-serif` လို့ ခေါ်လာတိုင်း `Noto Sans Myanmar` ကို အရင်ဆုံး အသုံးပြုပါလို့ System ကို ညွှန်ကြားလိုက်တာ။ ပြီးရင် Font Cache ကို ပြန်တည်ဆောက်ပြီး Browser တွေကို Restart ချလိုက်တယ်။

```bash
fc-cache -fv
systemctl --user restart xdg-desktop-portal
```

## Conclusion & Key Takeaways

အပေါ်က Fontconfig ပြင်ဆင်မှု ပြီးသွားတဲ့နောက် Browser တွေ၊ GTK Application တွေ အကုန်လုံးမှာ မြန်မာစာအက္ခရာတွေ ပုံမှန်အတိုင်း ပြန်ဖြစ်သွားတယ်။ ဒီတစ်ခါတော့ တရားခံက Pyidaungsu Font နဲ့ HarfBuzz Shaping Engine အသစ်ရဲ့ လိုက်ဖက်မှုပြဿနာပဲ။

နောက်တစ်ခါ Debian အသစ်တွေမှာ ဒီလိုပြဿနာ ပြန်ကြုံလာရင် သတိထားဖို့ အချက် ၃ ချက် မှတ်ထားချင်တယ်။

1. **Font Problem က HarfBuzz ကနေ လာနိုင်တယ်။** Debian 13 လို အသစ်တွေမှာ `Pyidaungsu` က `HarfBuzz` အသစ်နဲ့ တွဲမသုံးဖြစ်တော့ဘူး။
2. **Noto Fonts က Standard ပါ။** HarfBuzz အသစ်အတွက် `fonts-noto-core` (Noto Sans Myanmar) က အသေချာဆုံး အစားထိုးစရာပါ။
3. **Fontconfig ကို မမေ့ပါနဲ့။** `Noto` ကို Install လုပ်ရုံနဲ့ System က အလိုအလျောက် မပြောင်းသုံးပေးဘူး။ `~/.config/fontconfig/fonts.conf` ထဲမှာ Fallback Priority ကို `my` Language အတွက် သေချာသတ်မှတ်ပေးမှသာ အလုပ်လုပ်တယ်။

- တကယ်တော့ ဒါလေး မှတ်တမ်းအဖြစ်ထားလိုက်ရတာကတော့ `Zed Edtior` မှာဖြစ်နေတဲ့ ပြဿနာပါ ရှင်းပြီးသားဖြစ်သွားသလို၊
- ကိုယ်ဖြစ်လိုက်တဲ့ ပြဿနာတိုင်းက မြန်မာနိုင်ငံကလူတွေ တော်တော်ကူညီဖို့ခက်ခဲကြလွန်းလို့ ကိုယ်တိုင်ပြန်လုပ်နိုင်ဖို့အတွက် မှတ်တမ်းအဖြစ်နဲ့ ရေးလိုက်ရင်းနဲ့ ..
- ဒါပဲ!

## Notes
- Pyidaungsu Font HarfBuzz ဟုတ် မဟုတ်ကတော့ သေချာမသိပါဘူး
- သိကြရင်လည်း လာ Balme မယ့်အစား ပြင်လိုက်ကြပါလို့ ရေးရင်းနဲ့
- ရေးချင်တာ ရေးလိုက်ရလို့ ကျေနပ်ပါ၏။ ။
