---
title: "Google Play Console ပေါ် Ent H (Offline Reader) App တင်ဖို့ ပြင်ဆင်ခဲ့တဲ့ လုပ်ငန်းစဉ် မှတ်တမ်း"
date: 2026-09-09T21:50:00+06:30
image: images/enth-feature-graphic.png
thumbnail_image: images/enth-app-icon.png
description: "Ent H (Myanmar Offline Reader) မိုဘိုင်းအက်ပ်ကို Google Play Console ပေါ်တင်ဖို့ Policy Declarations၊ Privacy Policy၊ Store Assets နဲ့ UI အသစ်တွေ ပြင်ဆင်ခဲ့တဲ့ လက်တွေ့မှတ်တမ်း။"
summary: "Google Play Console မှာ Account Verification ကနေစပြီး Closed Testing၊ Data Safety၊ IARC Content Rating၊ Store Graphics တွေနဲ့ Flutter UI Dropdown Box အသစ် ပြင်ဆင်ခဲ့တဲ့ အသေးစိတ် အတွေ့အကြုံ။"
categories: ["Mobile Development", "Android", "Flutter"]
tags: ["Google Play", "Play Console", "Flutter", "Android", "Ent H", "Offline Reader", "App Store"]
series: ["App Publishing Journey"]
keywords: ["Google Play Console setup", "Ent H offline reader", "Flutter Android release", "Closed testing 12 testers", "Google Play Data Safety Myanmar"]
slug: "google-play-console-release-ent-h-offline-reader-journey"
---
ကျွန်တော့်ရဲ့ မြန်မာ အော့ဖ်လိုင်း စာဖတ်အက်ပ်ဖြစ်တဲ့ **Ent H** (`mpx.channel.enth`) ကို Google Play Console ပေါ် တရားဝင် တင်နိုင်ဖို့အတွက် လိုအပ်တဲ့ အဆင့်ဆင့် ပြင်ဆင်မှုတွေကို လုပ်ဆောင်ခဲ့တယ်။ အရင်က တိုက်ရိုက် APK Download အနေနဲ့ပဲ ဖြန့်ထားခဲ့ရာကနေ အခု Google Play Store ပေါ် တင်တော့မယ်ဆိုတော့ Google ရဲ့ စည်းမျဉ်းတွေ၊ စာရွက်စာတမ်းတွေနဲ့ Asset တွေ အများကြီး အသစ် ပြင်ဆင်ပေးခဲ့ရတယ်။ ဒီ Post မှာတော့ ဒီနေ့ Session ထဲမှာ ကျွန်တော် လုပ်ဆောင်ခဲ့တဲ့ အရာအားလုံးကို အသေးစိတ် ပြန်ပြီး မျှဝေပေးလိုက်ပါတယ်။

![Ent H Feature Graphic](images/enth-feature-graphic.png)

---

## ၁။ Google Play Console Account နဲ့ Verification အခြေအနေ

ပထမဆုံး အနေနဲ့ Google Play Console Account (ID: `9178950432532351602`) ကို စတင် ဖွင့်လှစ်ခဲ့ပြီး လက်ရှိမှာ Identity နဲ့ Payment Verification အဆင့်ကို ဆောင်ရွက်နေတယ်။

Google ရဲ့ Personal Developer Account စည်းမျဉ်းသစ်အရ Production ကို တိုက်ရိုက် တင်ခွင့် မရသေးခင် **Closed Testing** Track မှာ Tester ၁၂ ယောက်ထက်မနည်းနဲ့ ၁၄ ရက် ဆက်တိုက် စမ်းသပ်ပေးရတဲ့ စည်းကမ်းချက် ရှိတယ်။ ဒါကြောင့် အက်ပ်ကို အရင်ဆုံး Closed Testing အဆင့်ထိ ချောချောမောမော ရောက်သွားအောင် စနစ်တကျ ပြင်ဆင်ခဲ့တယ်။

---

## ၂။ Bilingual Privacy Policy (ကိုယ်ရေးအချက်အလက် လုံခြုံရေး မူဝါဒ) ရေးဆွဲခြင်း

Google Play Store မှာ အက်ပ်တင်ဖို့ မဖြစ်မနေ လိုအပ်တဲ့ အရာကတော့ Publicly Accessible ဖြစ်တဲ့ HTTPS Privacy Policy URL ပဲ ဖြစ်တယ်။

ကျွန်တော်တို့ရဲ့ ဝဘ်ဆိုက်ပေါ်မှာ မြန်မာဘာသာရော အင်္ဂလိပ်ဘာသာပါ ပါဝင်တဲ့ Privacy Policy စာမျက်နှာ ၂ ခုကို GoHugo နဲ့ တည်ဆောက်ပေးခဲ့တယ်-
* **မြန်မာဘာသာ**: `https://channelenth.my.id/privacy/`
* **English Version**: `https://channelenth.my.id/en/privacy/`

ဒီ မူဝါဒ စာမျက်နှာထဲမှာ အောက်ပါ အချက်အလက်တွေကို တိတိကျကျ ထည့်သွင်း ကြေညာထားတယ်-
1. **No Account / No Personal Data**: အသုံးပြုသူတွေဆီက နာမည်၊ ဖုန်းနံပါတ်၊ Email စတဲ့ ကိုယ်ရေးအချက်အလက်တွေကို တိုက်ရိုက် ရယူစုဆောင်းခြင်း မရှိတာ။
2. **Crash & Performance Telemetry**: Firebase Crashlytics နဲ့ Performance Monitoring သုံးပြီး App Crash နဲ့ စွမ်းဆောင်ရည် မှတ်တမ်းယူတာ။
3. **Advertising Identifiers**: Google AdMob နဲ့ Unity Ads အတွက် Android Advertising ID (`AD_ID`) အသုံးပြုတာ။
4. **Offline Local Storage**: ဆောင်းပါး ၁,၀၅၀+ ကျော်နဲ့ Bookmarks တွေကို ဖုန်းထဲမှာပဲ Offline Cache သိမ်းဆည်းတာ။

---

## ၃။ Play Store Listing Graphics & Branding အသစ်များ ဖန်တီးခြင်း

Store Listing အတွက် လိုအပ်တဲ့ အရည်အသွေးမြင့် Graphic Assets တွေကိုလည်း စနစ်တကျ ပြင်ဆင် ထုတ်လုပ်ခဲ့တယ်-

* **App Icon (512 × 512 px, 32-bit PNG)**: Ent H ရဲ့ Monogram 'H' နဲ့ ပွင့်နေတဲ့ စာအုပ်ပုံစံကို Obsidian Slate နဲ့ Royal Blue/Gold အလင်းရောင်တွေနဲ့ ပေါင်းစပ်ပြီး ဖန်တီးထားတယ်။
* **Feature Graphic (1024 × 500 px, 24-bit PNG)**: Play Store ရဲ့ ထိပ်ဆုံးမှာ ပြသမယ့် Banner အနေနဲ့ အလင်းရောင် ထွက်နေတဲ့ ဒစ်ဂျစ်တယ် စာအုပ်နဲ့ Floating App UI Cards တွေကို ဖော်ပြထားတယ်။
* **Phone & Tablet Screenshots (1080x2400, 1200x1920, 1600x2560)**: ဖုန်းထဲက တကယ့် UI Screen တွေကို ယူပြီး Modern Smartphone Bezel Frame နဲ့ အံဝင်ခွင်ကျ ထည့်သွင်းပြီး Phone ရော 7-inch, 10-inch Tablet အတွက်ပါ အဆင်သင့် သုံးနိုင်အောင် ထုတ်လုပ်ပေးခဲ့တယ်။

---

## ၄။ Play Console App Content & Declarations ဖြည့်သွင်းခြင်း

Google Play Console ရဲ့ Policy မေးခွန်းတွေကို အောက်ပါအတိုင်း ရှင်းလင်းစွာ ဖြေဆိုခဲ့တယ်-

| Policy Section | ရွေးချယ်မှု / အဖြေ | အကြောင်းပြချက် |
| :--- | :--- | :--- |
| **Ads** | Yes, my app contains ads | AdMob နဲ့ Unity Ads ချိတ်ဆက်ထားလို့ |
| **App Access** | All functionality is available without restrictions | Login/Password မလိုဘဲ အားလုံး ဖတ်ရှုနိုင်လို့ |
| **Content Rating (IARC)** | All Other App Types > Everyone (3+) | အကြမ်းဖက်မှု၊ မသင့်လျော်တဲ့ အသုံးအနှုန်း မပါဝင်လို့ |
| **Target Audience** | 13+, 16+, 18+ (Appeal to children: No) | COPPA စည်းမျဉ်းတွေ ရိုးရှင်းစေဖို့ |
| **Financial Features** | My app doesn't provide any financial features | ဘဏ်/ငွေကြေး/ချေးငွေ အက်ပ် မဟုတ်လို့ |
| **Health Features** | My app does not have any health features | ဆေးဘက်ဆိုင်ရာ/ကျန်းမာရေး အက်ပ် မဟုတ်လို့ |
| **Category** | Books & Reference | အော့ဖ်လိုင်း စာဖတ်/ဗဟုသုတ အက်ပ် ဖြစ်လို့ |

### Data Safety Form ဖြည့်သွင်းမှု:
* **App Info & Performance**: Crash logs နဲ့ Diagnostics ကို Firebase အတွက် ရွေးချယ်ခဲ့တယ်။
* **App Activity**: App interactions ကို Firebase Analytics အတွက် ရွေးချယ်ခဲ့တယ်။
* **Device or other IDs**: Android Advertising ID (`AD_ID`) အတွက် ရွေးချယ်ခဲ့တယ်။
* **Location**: GPS Permission မသုံးထားတဲ့အတွက် `0/2` အနေနဲ့ အကုန် Uncheck လုပ်ခဲ့တယ်။

---

## ၅။ Flutter Mobile App UI & Feature အသစ်များ (v1.5.0)

Play Store မတင်ခင် အသုံးပြုသူတွေရဲ့ ဖတ်ရှုမှု အတွေ့အကြုံ (UI/UX) ပိုမို ကောင်းမွန်လာစေဖို့ Flutter Codebase ထဲမှာ အောက်ပါ အဓိက အပြောင်းအလဲတွေကို ထည့်သွင်းခဲ့တယ်-

### (က) Categories & Topics Explorer Hub အသစ်
* အဓိက ကဏ္ဍကြီး (၈) ခုဖြစ်တဲ့ Mindset, Life, Literature, Tech, Psychology, Philosophy, Health, Biographies တွေကို သီးခြား Card လေးတွေနဲ့ ဖော်ပြပေးတဲ့ Screen အသစ် ဖန်တီးခဲ့တယ်။
* စုစုပေါင်း Tag ၃၉ ခုပါဝင်တဲ့ Tag Cloud ကိုပါ ထည့်သွင်းပြီး Tag တစ်ခုချင်းစီအလိုက် ဆောင်းပါးတွေ ရှာဖွေနိုင်အောင် ပြုလုပ်ပေးခဲ့တယ်။
* AppBar မှာ Grid Icon လေး ထည့်ပေးထားသလို Settings Screen ထဲကနေလည်း တိုက်ရိုက် သွားရောက်နိုင်တယ်။

### (ခ) Dropdown Category Selector Box (Home Screen)
အရင်က Home Screen အပေါ်မှာ ကဏ္ဍတွေကို ဘေးတိုက် Scroll လုပ်ပြီး ရွေးနေရတာက သိပ်မလှဘဲ အသုံးပြုရ ခက်ခဲနေခဲ့တယ်။ အခုတော့-
* မျက်နှာပြင် အပေါ်ဆုံးမှာ လက်ရှိ ရွေးထားတဲ့ ကဏ္ဍရဲ့ Icon၊ မြန်မာ/အင်္ဂလိပ် ခေါင်းစဉ်နဲ့ ဆောင်းပါး အရေအတွက်ကို ပြသပေးတဲ့ Modern Category Box လေး ထည့်သွင်းလိုက်တယ်။
* အဲ့ဒီ Box လေးကို နှိပ်လိုက်တာနဲ့ အောက်ခြေကနေ ချောမွေ့စွာ တက်လာတဲ့ Modal Bottom Sheet ကနေ ကဏ္ဍအားလုံးကို တစ်ချက်တည်းနဲ့ အလွယ်တကူ ရွေးချယ် ပြောင်းလဲနိုင်အောင် ပြင်ဆင်လိုက်တယ်။

---

## ၆။ Version Synchronizing & Clean Builds

ဒီ Session ထဲမှာ ပြင်ဆင်ခဲ့တဲ့ အရာအားလုံးကို ဗားရှင်းတစ်ခုတည်း အဖြစ် သတ်မှတ်ပြီး **`v1.5.0` (Version Code: `150`)** အဖြစ် Monotonic Versioning စနစ်နဲ့ အဆင့်မြှင့်တင်ခဲ့တယ်-

```bash
python scripts/compile_posts_for_mobile.py
```

အဆိုပါ Script ကနေတစ်ဆင့် `mobile/pubspec.yaml`၊ `package.json`၊ `app_config.json`၊ `version.json` နဲ့ `CHANGELOG.md` တွေကို အလိုအလျောက် ၁၀၀% တစ်ပြိုင်နက် Sync လုပ်ပေးခဲ့တယ်။

`flutter analyze` နဲ့ စစ်ဆေးရာမှာလည်း **0 errors** နဲ့ အောင်မြင်စွာ ပြီးမြောက်ခဲ့တယ်။

---

## နိဂုံး

ဒီနေ့ Session ထဲမှာတော့ Google Play Console အကောင့်စဖွင့်တာကနေစပြီး Policy မေးခွန်းတွေ၊ Graphics Asset တွေ၊ Privacy Policy စာမျက်နှာတွေနဲ့ Flutter Mobile App UI အသစ်တွေအထိ အပြည့်အစုံ ပြင်ဆင်ပြီးသွားပါပြီ။ Google ရဲ့ Verification ပြီးတာနဲ့ Closed Testing Track ပေါ် တင်ပြီး Tester ၁၂ ယောက်နဲ့ စတင် စမ်းသပ်သွားမှာ ဖြစ်ပါတယ်။
