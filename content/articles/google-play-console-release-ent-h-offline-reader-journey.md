---
title: "Google Play Console ပေါ် Ent H (Offline Reader) App တင်ဖို့ ပြင်ဆင်ခဲ့တဲ့ လုပ်ငန်းစဉ် မှတ်တမ်း"
date: 2026-09-09T21:50:00+06:30
image: images/enth-feature-graphic.png
thumbnail_image: images/enth-app-icon.png
description: "Ent H (Myanmar Offline Reader) မိုဘိုင်းအက်ပ်ကို Google Play Console ပေါ်တင်ဖို့ Policy Declarations၊ Step-by-Step Questions၊ Data Safety၊ Store Assets နဲ့ UI အသစ်တွေ ပြင်ဆင်ခဲ့တဲ့ လက်တွေ့မှတ်တမ်း။"
summary: "Google Play Console မှာ Account Verification ကနေစပြီး Closed Testing၊ Data Safety၊ Financial/Health Declarations၊ IARC Content Rating၊ Store Graphics တွေနဲ့ Flutter UI Dropdown Box အသစ် ပြင်ဆင်ခဲ့တဲ့ အသေးစိတ် အတွေ့အကြုံ။"
categories: ["Mobile Development", "Android", "Flutter"]
tags: ["Google Play", "Play Console", "Flutter", "Android", "Ent H", "Offline Reader", "App Store"]
series: ["App Publishing Journey"]
keywords: ["Google Play Console setup", "Ent H offline reader", "Flutter Android release", "Closed testing 12 testers", "Google Play Data Safety Myanmar", "Play Store policy step by step"]
slug: "google-play-console-release-ent-h-offline-reader-journey"
---
ကျွန်တော့်ရဲ့ မြန်မာ အော့ဖ်လိုင်း စာဖတ်အက်ပ်ဖြစ်တဲ့ **Ent H** (`mpx.channel.enth`) ကို Google Play Console ပေါ် တရားဝင် တင်နိုင်ဖို့အတွက် လိုအပ်တဲ့ အဆင့်ဆင့် ပြင်ဆင်မှုတွေကို လုပ်ဆောင်ခဲ့တယ်။ အရင်က တိုက်ရိုက် APK Download အနေနဲ့ပဲ ဖြန့်ထားခဲ့ရာကနေ အခု Google Play Store ပေါ် တင်တော့မယ်ဆိုတော့ Google ရဲ့ မူဝါဒတွေ၊ Policy Declarations စစ်ဆေးချက်တွေ၊ အသေးစိတ် မေးခွန်းတွေနဲ့ Graphic Asset တွေ အများကြီး ပြင်ဆင်ပေးခဲ့ရတယ်။ ဒီ Post မှာတော့ ဒီနေ့ Session ထဲမှာ ကျွန်တော် ဖြေဆိုဖြည့်သွင်းခဲ့ရတဲ့ Step-by-Step မေးခွန်းတွေ၊ Yes/No ရွေးချယ်မှုတွေနဲ့ နည်းပညာဆိုင်ရာ အပြောင်းအလဲတွေကို အသေးစိတ် ပြန်ပြီး မျှဝေပေးလိုက်ပါတယ်။

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

## ၃။ Play Console Policy Declarations (Step-by-Step မေးခွန်းများနှင့် အဖြေများ)

Google Play Console ရဲ့ **App Content** ကဏ္ဍထဲမှာ မဖြစ်မနေ ဖြည့်သွင်းရတဲ့ Policy မေးခွန်းတွေ၊ ရွေးချယ်မှုတွေနဲ့ အဲ့ဒီလို ရွေးချယ်ရတဲ့ အကြောင်းပြချက်တွေကို အောက်မှာ အသေးစိတ် မှတ်တမ်းတင်ထားပါတယ်-

### (၁) Data Safety & User Data Handling (ဒေတာ လုံခြုံရေးနှင့် သုံးစွဲမှု)

Play Store မှာ အသုံးပြုသူတွေရဲ့ Data ကို ဘယ်လို ကိုင်တွယ်သလဲဆိုတာ ရှင်းပြရတဲ့ အပိုင်းဖြစ်တယ်-

* **App info and performance (Crash logs & Diagnostics)**:
  * **မေးခွန်း**: *Does your app collect or share crash logs, diagnostics, or other app performance data?*
  * **ရွေးချယ်မှု**: **Yes (Collected: Yes / Shared: No)**
  * **ရည်ရွယ်ချက် (Purpose)**: App functionality & Analytics (Firebase Crashlytics / Firebase Performance Monitoring)
  * **ရှင်းပြချက်**: အက်ပ် ပျက်ကျတာ (Crash) ဒါမှမဟုတ် စွမ်းဆောင်ရည် နှေးကွေးတာတွေကို ခြေရာခံပြီး Bug ပြင်ဆင်နိုင်ဖို့ Firebase SDK က Diagnostics Data ကောက်ယူတာဖြစ်တယ်။ Data တွေကို Transfer လုပ်ရာမှာ Encrypted in transit ဖြစ်ပြီး User Account နဲ့ ချိတ်ဆက်ထားခြင်း မရှိဘူး။
* **App activity (App interactions)**:
  * **မေးခွန်း**: *Does your app collect or share user interactions within the app?*
  * **ရွေးချယ်မှု**: **Yes (Collected: Yes / Shared: No)**
  * **ရည်ရွယ်ချက် (Purpose)**: Analytics (Firebase Analytics)
  * **ရှင်းပြချက်**: အသုံးပြုသူတွေ ဘယ် Article တွေ ပိုဖတ်သလဲ၊ Theme ဘယ်လို ပြောင်းလဲသုံးသလဲ စတဲ့ Anonymous Engagement Metrics တွေကို လေ့လာဖို့အတွက်သာ ဖြစ်တယ်။
* **Device or other IDs**:
  * **မေးခွန်း**: *Does your app collect or share Device or other IDs (such as Advertising ID)?*
  * **ရွေးချယ်မှု**: **Yes (Collected & Shared: Yes)**
  * **ရည်ရွယ်ချက် (Purpose)**: Advertising or Marketing & Analytics (Google AdMob & Unity Ads)
  * **ရှင်းပြချက်**: ကြော်ငြာ ကွန်ရက်တွေဖြစ်တဲ့ Google AdMob နဲ့ Unity Ads တွေ အလုပ်လုပ်နိုင်ဖို့အတွက် Android Google Advertising ID (`AD_ID`) ကို အသုံးပြုထားတယ်။
* **Location (တည်နေရာ အချက်အလက်)**:
  * **မေးခွန်း**: *Does your app collect precise or approximate location?*
  * **ရွေးချယ်မှု**: **No (0 of 2 collected)**
  * **ရှင်းပြချက်**: Ent H အက်ပ်မှာ GPS / Coarse Location Permission တွေ လုံးဝ မတောင်းဆိုထားတဲ့အတွက် Location Data ကို ကောက်ယူခြင်း မရှိဘူး။

---

### (၂) Financial Features in your app (ဘဏ္ဍာရေးဆိုင်ရာ လုပ်ဆောင်ချက်များ)

* **မေးခွန်း**: *Select all of the financial features your app provides (Banking, Personal loans, Cryptocurrency, Stock trading, Buy now pay later, etc.)*
* **ရွေးချယ်မှု**: **My app doesn't provide any financial features**
* **အကြောင်းပြချက်**: Ent H ဟာ အော့ဖ်လိုင်း စာဖတ်အက်ပ် သက်သက်သာ ဖြစ်ပြီး ငွေချေးတာ၊ အွန်လိုင်းဘဏ်လုပ်ငန်း လုပ်တာ ဒါမှမဟုတ် Crypto/Stock အရောင်းအဝယ် ပြုလုပ်တဲ့ လုပ်ဆောင်ချက်တွေ လုံးဝ မပါဝင်လို့ ဖြစ်တယ်။

---

### (၃) Health Features in your app (ကျန်းမာရေးဆိုင်ရာ လုပ်ဆောင်ချက်များ)

* **မေးခွန်း**: *Tell us about the health features in your app (Activity & fitness, Medical conditions, Clinical decision support, Medication management, etc.)*
* **ရွေးချယ်မှု**: **My app does not have any health features**
* **အကြောင်းပြချက်**: ဆေးဘက်ဆိုင်ရာ ကုသမှု အကြံဉာဏ်ပေးတာ၊ ရောဂါရှာဖွေတာ၊ ကိုယ်လက်လှုပ်ရှားမှု တိုင်းတာတာ ဒါမှမဟုတ် ဆေးညွှန်း စီမံတာတွေ မပါဝင်လို့ ဖြစ်တယ်။

---

### (၄) App Category, Tags & Store Listing Contact

အက်ပ်ကို Play Store ပေါ်မှာ သုံးစွဲသူတွေ အလွယ်တကူ ရှာတွေ့နိုင်ဖို့ သတ်မှတ်ခဲ့တဲ့ အချက်အလက်တွေ ဖြစ်တယ်-

* **App or Game**: **App**
* **Category**: **Books & Reference** (စာအုပ်နှင့် ရည်ညွှန်းကိုးကား)
* **Tags**: *Books & Reference, Education, Reading*
* **Developer Email Address**: `imhhk69@gmail.com`
* **Official Website**: `https://channelenth.my.id/`
* **External Marketing**: **Advertise my app outside of Google Play (Checked / Enabled)**

---

### (၅) Ads & App Access Declarations

* **Ads Declaration**:
  * **မေးခွန်း**: *Does your app contain advertisements?*
  * **ရွေးချယ်မှု**: **Yes, my app contains ads** (AdMob နဲ့ Unity Ads ပါဝင်လို့)
* **App Access**:
  * **မေးခွန်း**: *Are any parts of your app restricted based on login credentials, memberships, or geo-location?*
  * **ရွေးချယ်မှု**: **All functionality is available without restrictions** (Account ဖွင့်စရာ မလိုဘဲ အားလုံး ချက်ချင်း ဖတ်ရှုနိုင်လို့)
* **News Apps Policy**:
  * **မေးခွန်း**: *Is your app a news app?*
  * **ရွေးချယ်မှု**: **No** (သတင်းဌာန/မီဒီယာ အက်ပ် မဟုတ်ဘဲ စာရေးသူကိုယ်တိုင် ရေးသားထားတဲ့ အတွေးအမြင်/ဗဟုသုတ ဆောင်းပါးများ စုစည်းမှု ဖြစ်လို့)
* **Government Apps Policy**:
  * **မေးခွန်း**: *Is your app developed by or on behalf of a government entity?*
  * **ရွေးချယ်မှု**: **No**

---

### (၆) Target Audience & Content Rating (IARC)

* **Target Age Group**: **13-15, 16-17, 18 and over**
* **Appeal to Children**: **No** (ကလေးငယ်များ အတွက် သီးသန့် ရည်ရွယ်ထားခြင်း မရှိတာကြောင့် COPPA ပေါ်လစီ ရှုပ်ထွေးမှုတွေ ကင်းဝေးစေတယ်)
* **IARC Content Rating Questionnaire**:
  * Category: **All Other App Types**
  * Violence, Sexual Content, Offensive Language, Gambling: အားလုံး **No**
  * Result: **Everyone (3+) / PEGI 3 / USK 0** အဆင့် သတ်မှတ်ချက် ရရှိခဲ့တယ်။

---

## ၄။ Store Listing Graphics Assets ဖန်တီးခြင်းနှင့် Tablet Error ဖြေရှင်းမှု

Store Listing မှာ Screen Assets တွေ တင်တဲ့အခါ *"Upload at least 2 phone or tablet screenshots"* ဆိုတဲ့ အနီရောင် Error စာတန်း တက်လာခဲ့တယ်။ အဲ့ဒါကို ဖြေရှင်းဖို့အတွက် Python Script (`scripts/generate_store_assets.py`) ရေးဆွဲပြီး လိုအပ်တဲ့ Graphic တွေ အကုန်လုံးကို သတ်မှတ်ချက် အတိုင်း ထုတ်လုပ်ခဲ့တယ်-

* **App Icon**: 512 × 512 px, 32-bit PNG (Ent H Monogram 'H' + Open Book Silhouette)
* **Feature Graphic**: 1024 × 500 px, 24-bit PNG (Promotional Store Banner)
* **Phone Screenshots (1080 × 2400 px, 9:16 Aspect Ratio)**: စုစုပေါင်း ၄ ပုံ (Home Screen, Offline Reader, Quotes Maker, Audio Narration)
* **7-inch Tablet Screenshots (1200 × 1920 px, 9:16 Aspect Ratio)**: စုစုပေါင်း ၄ ပုံ (Tablet မျက်နှာပြင် အချိုးအစား)
* **10-inch Tablet Screenshots (1600 × 2560 px, 9:16 Aspect Ratio)**: စုစုပေါင်း ၄ ပုံ (High-resolution Large Tablet Frames)

အဆိုပါ Tablet Screenshots တွေကိုပါ Play Console ထဲ တင်ပေးလိုက်တဲ့အခါမှာ Upload Error လုံးဝ ပျောက်ကွယ်သွားပြီး အစိမ်းရောင် အမှန်ခြစ် ရရှိခဲ့တယ်။

---

## ၅။ Flutter Mobile App UI & Architecture အသစ်များ (v1.5.0)

Play Store မတင်ခင် အသုံးပြုသူတွေရဲ့ ဖတ်ရှုမှု အတွေ့အကြုံ (UI/UX) ပိုမို ကောင်းမွန်လာစေဖို့ Flutter Codebase ထဲမှာ အောက်ပါ အဓိက အပြောင်းအလဲတွေကို ထည့်သွင်းခဲ့တယ်-

### (က) Categories & Topics Explorer Hub အသစ်
* အဓိက ကဏ္ဍကြီး (၈) ခုဖြစ်တဲ့ Mindset, Life, Literature, Tech, Psychology, Philosophy, Health, Biographies တွေကို သီးခြား Card လေးတွေနဲ့ ဖော်ပြပေးတဲ့ Screen အသစ် ဖန်တီးခဲ့တယ်။
* စုစုပေါင်း Tag ၃၉ ခုပါဝင်တဲ့ Tag Cloud ကိုပါ ထည့်သွင်းပြီး Tag တစ်ခုချင်းစီအလိုက် ဆောင်းပါးတွေ ရှာဖွေနိုင်အောင် ပြုလုပ်ပေးခဲ့တယ်။
* AppBar မှာ Grid Icon လေး ထည့်ပေးထားသလို Settings Screen ထဲကနေလည်း တိုက်ရိုက် သွားရောက်နိုင်တယ်။

### (ခ) Dropdown Category Selector Box (Home Screen)
အရင်က Home Screen အပေါ်မှာ ကဏ္ဍတွေကို ဘေးတိုက် Scroll လုပ်ပြီး ရွေးနေရတာက သိပ်မလှဘဲ အသုံးပြုရ ခက်ခဲနေခဲ့တယ်။ အခုတော့-
* မျက်နှာပြင် အပေါ်ဆုံးမှာ လက်ရှိ ရွေးထားတဲ့ ကဏ္ဍရဲ့ Icon၊ မြန်မာ/အင်္ဂလိပ် ခေါင်းစဉ်နဲ့ ဆောင်းပါး အရေအတွက်ကို ပြသပေးတဲ့ Modern Category Box လေး ထည့်သွင်းလိုက်တယ်။
* အဲ့ဒီ Box လေးကို နှိပ်လိုက်တာနဲ့ အောက်ခြေကနေ ချောမွေ့စွာ တက်လာတဲ့ Modal Bottom Sheet ကနေ ကဏ္ဍအားလုံးကို တစ်ချက်တည်းနဲ့ အလွယ်တကူ ရွေးချယ် ပြောင်းလဲနိုင်အောင် ပြင်ဆင်လိုက်တယ်။

### (ဂ) App Update State Bug ဖြေရှင်းခြင်း
အဝေးက Remote Config (`version.json`) ဆွဲချတဲ့အခါ ဖုန်းထဲမှာ လက်ရှိ Install လုပ်ထားတဲ့ ဗားရှင်းကို Memory ထဲမှာ မှားယွင်းပြီး Override မလုပ်နိုင်အောင် `isLocalAsset` Guard စနစ် ထည့်သွင်းပေးခဲ့တယ်။ ဒါကြောင့် အသုံးပြုသူတွေ အနေနဲ့ Update Notification နှိပ်လိုက်တာနဲ့ Update Dialog ပေါ်လာပြီး Download စတင်နိုင်မှာ ဖြစ်ပါတယ်။

---

## ၆။ Version Synchronizing & Clean Builds

ဒီ Session ထဲမှာ ပြင်ဆင်ခဲ့တဲ့ အရာအားလုံးကို ဗားရှင်းတစ်ခုတည်း အဖြစ် သတ်မှတ်ပြီး **`v1.5.0` (Version Code: `150`)** အဖြစ် Monotonic Versioning စနစ်နဲ့ အဆင့်မြှင့်တင်ခဲ့တယ်-

```bash
python scripts/compile_posts_for_mobile.py
```

အဆိုပါ Script ကနေတစ်ဆင့် `mobile/pubspec.yaml`၊ `package.json`၊ `app_config.json`၊ `version.json` နဲ့ `CHANGELOG.md` တွေကို အလိုအလျောက် ၁၀၀% တစ်ပြိုင်နက် Sync လုပ်ပေးခဲ့တယ်။

`flutter analyze` နဲ့ `flutter test` စစ်ဆေးရာမှာလည်း **0 errors, all 7 unit tests passed** နဲ့ အောင်မြင်စွာ ပြီးမြောက်ခဲ့တယ်။

---

## နိဂုံး

ဒီနေ့ Session ထဲမှာတော့ Google Play Console အကောင့်စဖွင့်တာကနေစပြီး Policy မေးခွန်းတွေ၊ Data Safety ရှင်းလင်းချက်တွေ၊ Tablet Graphics Asset တွေ၊ Privacy Policy စာမျက်နှာတွေနဲ့ Flutter Mobile App UI အသစ်တွေအထိ အပြည့်အစုံ ပြင်ဆင်ပြီးသွားပါပြီ။ Google ရဲ့ Developer Verification ပြီးတာနဲ့ Closed Testing Track ပေါ် တင်ပြီး Tester ၁၂ ယောက်နဲ့ စတင် စမ်းသပ်သွားမှာ ဖြစ်ပါတယ်။
