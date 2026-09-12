---
title: "Telegram Shop Bot နဲ့ Mini App အဆင့်မြှင့်တင်မှု မှတ်တမ်း"
date: 2026-09-13T00:10:00+06:30
image: cover.png
thumbnail_image: cover.png
description: "Telegram Shop Bot နဲ့ Mini App ထဲမှာ Custom Animated Premium Emojis တွေ ချိတ်ဆက်တာ၊ Product Categories ခွဲထုတ်တာ၊ Hugo Spoiler Shortcode ရေးသားတာနဲ့ W3C Accessibility Error တွေ ဖြေရှင်းခဲ့တဲ့ လက်တွေ့မှတ်တမ်းပါ။"
summary: "ဒီဆောင်းပါးမှာ Telegram Shop Bot ရဲ့ Admin Panel ကို အဆင့်မြှင့်တင်ခဲ့တဲ့ အတွေ့အကြုံ၊ Mini App ထဲမှာ Lottie Vector TGS နဲ့ WebP Custom Emojis တွေ တိုက်ရိုက် Render လုပ်ပုံ၊ Website Shop Grid Layout ပြင်ဆင်ပုံနဲ့ Hugo Shortcode ဖန်တီးခဲ့ပုံတွေကို အသေးစိတ် မျှဝေထားပါတယ်။"
categories: ["Web Development", "Cloud Services", "AI"]
tags: ["Telegram", "Mini App", "Cloudflare Workers", "Hugo", "Custom Emoji", "W3C"]
series: ["DevOps & Automation"]
keywords: ["Telegram Bot", "Telegram Mini App", "Telegram Custom Emoji", "Cloudflare KV", "Hugo Spoiler Shortcode", "W3C ARIA"]
slug: "telegram-shop-bot-miniapp-premium-emoji-enhancements"
---

Telegram Bot နဲ့ Mini App ကို ကိုယ်တိုင် Develop လုပ်ပြီး Run ထားတဲ့အခါ အသုံးပြုရတာ အဆင်ပြေချောမွေ့ဖို့နဲ့ UI/UX သေသပ်လှပဖို့က အမြဲတမ်း အရေးကြီးပါတယ်။ ဒီတစ်ခေါက်မှာတော့ ကျွန်တော့်ရဲ့ MPX Store (Telegram Shop Bot) နဲ့ Website Shop Page ကို ပိုမိုစနစ်ကျပြီး စမတ်ကျသွားအောင် တစ်ပြိုင်နက်တည်း အကြီးစား ပြင်ဆင်မှုတွေ ပြုလုပ်ဖြစ်ခဲ့ပါတယ်။

Bot Command တွေ စနစ်တကျ ပြန်စီတာကစလို့ Telegram Premium Custom Emoji တွေကို Website နဲ့ Mini App ထဲမှာ Animation အပြည့်နဲ့ ပေါ်လာအောင် လုပ်တာ၊ Hugo အတွက် Sparkling Spoiler Shortcode ဖန်တီးတာနဲ့ W3C HTML Validator အမှားတွေ ပြင်ဆင်ခဲ့တဲ့အထိ တစ်ဆင့်ချင်းစီ ဘယ်လို ဖြေရှင်းတည်ဆောက်ခဲ့လဲဆိုတာ အသေးစိတ် မှတ်တမ်းတင် မျှဝေပေးလိုက်ပါတယ်။

---

## ၁။ Bot Commands နဲ့ Categories တွေကို စနစ်တကျ ခွဲထုတ်ခြင်း

အရင်တုန်းက Bot ရဲ့ `/start`, `/app`, `/help` တွေမှာ Button တွေ ရောထွေးနေပြီး Admin Plans Edit လုပ်တဲ့အခါမှာလည်း ပစ္စည်းအားလုံး အပြုံလိုက် ပေါ်နေခဲ့ပါတယ်။ 

ဒါကို သေသပ်သွားအောင် Category ၄ မျိုး တိတိကျကျ ခွဲထုတ်လိုက်ပါတယ် -
1. **Telegram Premium** (1 Month, 3 Months, 6 Months, 12 Months)
2. **Telegram Stars** (50 Stars ကနေ 1,000 Stars အထိ Tiers တွေ)
3. **Gram** (Telegram ecosystem တိုကင် ဝန်ဆောင်မှု)
4. **Other Services** (Google Gemini AI, OpenVPN Profile စသည်ဖြင့်)

### Inline Button Emojis သန့်စင်ခြင်း
Telegram Bot Keyboard တွေမှာ `icon_custom_emoji_id` ထည့်ထားရင် Telegram က Custom Emoji ကို သီးသန့် အလှဆင်ပေးပါတယ်။ ဒါပေမဲ့ အရင်က Button Text ထဲမှာ ရိုးရိုး Unicode Emoji ပါ ရောထည့်ထားမိတော့ Emoji နှစ်ထပ် ဖြစ်နေခဲ့ပါတယ်။ ဒါကြောင့် Custom Emoji ID ပါတဲ့ Button တွေမှာ Unicode Emoji တွေကို ဖြုတ်ပြီး Text ကို သန့်သန့်ရှင်းရှင်း ဖော်ပြပေးလိုက်ပါတယ်။ Website Button အတွက်လည်း သီးသန့် Custom Emoji ID (`6134272527817515691`) သတ်မှတ်ပေးခဲ့ပါတယ်။

---

## ၂။ Dynamic Price Editing Flow (ပိုမိုသွက်လက်လာတဲ့ စျေးနှုန်းပြင်ဆင်မှု)

အရင်က Admin ကနေ Plan တစ်ခုရဲ့ စျေးနှုန်းကို ပြင်ချင်ရင် command တွေ ရိုက်ပြီး စာအရှည်ကြီးတွေနဲ့ သွားနေရပါတယ်။

အခုအခါမှာတော့ UI Flow ကို အများကြီး ပေါ့ပါးသွားအောင် ပြင်ဆင်လိုက်ပါတယ် -
- Inline Button ကနေ **"Change Price"** ကို နှိပ်လိုက်တာနဲ့ Prompt စာဟောင်းကို တစ်ခါတည်း ရှင်းထုတ် (delete message) ပေးပါတယ်။
- ဂဏန်းတန်ဖိုး သီးသန့် (ဥပမာ `24500`) ရိုက်ထည့်လိုက်တာနဲ့ အလိုအလျောက် စျေးနှုန်း ပြောင်းလဲပေးပါတယ်။
- ဒါမှမဟုတ် `/setprice <category> <index> <price>` လိုမျိုး Command နဲ့လည်း တိုက်ရိုက် လှမ်းပြင်လို့ ရစေခဲ့ပါတယ်။

---

## ၃။ Cloudflare KV Data Structure ခွဲထုတ်သိမ်းဆည်းခြင်း

အရင်က `services.json` တစ်ခုတည်းမှာ အကုန်လုံး ရောနှောသိမ်းဆည်းထားရာကနေ Cloudflare KV (`SHOP_DATA`) ထဲမှာ Product Categories အလိုက် သီးသန့် ခွဲခြားပြီး Structuring လုပ်လိုက်ပါတယ်။

- Premium Plans
- Stars Plans
- Gram Plans
- Other Services (Gemini AI & OpenVPN)

ဒေသတွင်း စမ်းသပ်မှုနဲ့ Production ကြား အဆင်ပြေစေဖို့ `.dev.vars` မှာ Admin Telegram ID ကို ချိတ်ဆက်ပြီး KV Bulk Sync ပြုလုပ်ပေးခဲ့ပါတယ်။

---

## ၄။ Website Shop Page Layout နဲ့ Grid စနစ် ပြင်ဆင်ခြင်း

Website Shop Page (`/shop`) မှာ ကုန်ပစ္စည်းတွေ ကြည့်ရှုရတာ အမြင်ရှင်းပြီး မျက်စိပသာဒ ဖြစ်စေဖို့ Layout Grid ကို စနစ်တကျ ပြန်လည် အချိုးချခဲ့ပါတယ် -
- **Premium Section:** ပထမတန်းမှာ ၃ ခုပြပြီး၊ အောက်တန်းက 1 Month ကတ်ကို အပြည့် (Full width) ဖြန့်ပြပါတယ်။
- **Gram Section:** သီးသန့်ဖြစ်တဲ့အတွက် Card အပြည့်နဲ့ ထင်သာမြင်သာ ဖော်ပြပါတယ်။
- **Stars Section:** ၃ ခုစီ တန်းစီပြီး ကျန်တာတွေကို Width အညီအမျှ ညှိပြပါတယ်။
- **Other Services:** Google Gemini AI နဲ့ OpenVPN Profile နှစ်ခုကို 2-Column အချိုးကျ ပြသပေးပါတယ်။

Category Switcher Tabs တွေမှာလည်း မလိုလားအပ်တဲ့ Border နဲ့ Background မပါဘဲ သန့်ရှင်းတဲ့ `.shop-filter-grid` Style ပြောင်းလဲခဲ့သလို Custom Emoji တွေ စတင် Load လုပ်ချိန်မှာ Unicode အဟောင်းတွေ Flash မဖြစ်သွားအောင် CSS ကို ညှိပေးခဲ့ပါတယ်။

---

## ၅။ Hugo Spoiler Shortcode ဖန်တီးခြင်း (Text Blur & Twinkling Sparkles)

Shop Page က စျေးနှုန်းတွေကို လျှို့ဝှက်ထားချင်တာ ဒါမှမဟုတ် ပျော်စရာ Feature တစ်ခုအဖြစ် Hover လုပ်ရင်ဖြစ်ဖြစ်၊ Click နှိပ်ရင်ဖြစ်ဖြစ် စာသားလေး ဝေဝါး blur ဖြစ်နေပြီး ပျောက်တောက် ပျောက်တောက် ကလက်တတ်တတ် ကြယ်ပွင့် sparkles လေးတွေ တလက်လက်နဲ့ ပွင့်လာစေချင်တဲ့အတွက် Custom Hugo Spoiler Shortcode တစ်ခုကို ဖန်တီးခဲ့ပါတယ်။

နောက်ခံ solid background box ကြီးတွေ မသုံးဘဲ စာသားကို သဘာဝကျကျ မျက်စိထဲ အချိုးကျစေမယ့် `filter: blur(3.8px)` နဲ့ အလှဆင်ထားပြီး အပေါ်ကနေ asynchronous keyframe animations တွေနဲ့ အစက်ကလေးတွေ ဟိုပေါ်လိုက် ဒီပေါ်လိုက် တလက်လက် တောက်ပနေစေပါတယ်။ Hover လုပ်လိုက်တာ ဒါမှမဟုတ် Click နှိပ်လိုက်တာနဲ့ blur ပြေသွားပြီး မူလ စာသားကို ကြည်လင်ပြတ်သားစွာ ဖော်ပြပေးမှာ ဖြစ်ပါတယ်။

Markdown ထဲမှာဖြစ်စေ၊ HTML Template ထဲမှာဖြစ်စေ အလွယ်တကူ သုံးနိုင်ပါတယ် -

```markdown
{{</* spoiler text="လျှို့ဝှက်စာသား" */>}}
```

ဒါမှမဟုတ် Block အနေနဲ့လည်း သုံးနိုင်ပါတယ် -

```markdown
{{</* spoiler */>}}
ဒီထဲက အကြောင်းအရာကို ကလစ်နှိပ်မှ ပြသပေးမှာပါ ✨
{{</* /spoiler */>}}
```

CSS မှာ text blur ကို base ထားပြီး၊ JavaScript ကနေ Desktop မှာ Mouse Hover နဲ့ Mobile မှာ Touch/Click နှစ်မျိုးစလုံး အဆင်ပြေပြေ အလုပ်လုပ်အောင် ရေးသားပေးထားပါတယ်။

---

## ၆။ Telegram Mini App (`/app`) မှာ Animated Custom Emoji များ တပ်ဆင်ခြင်း

ဒီ Session ရဲ့ အဓိက အဆင့်မြှင့်တင်မှုတစ်ခုကတော့ Telegram Mini App ဖြစ်တဲ့ Admin Dashboard ထဲမှာပါ Telegram Premium Custom Emojis တွေကို Animation အပြည့်နဲ့ ပေါ်လာစေခဲ့တာပါပဲ။

### အသုံးပြုထားတဲ့ Custom Emoji IDs
- **Premium:** `6192798024230505469`
- **Stars:** `6325838686378269641`
- **Gram:** `6169992765795999529`
- **Gemini AI / Others:** `6210689895912968015`

### Mini App UI ပြုပြင်မှုများ
1. **Category Buttons Order:** Category Switcher မှာ **"All"** ကို ရှေ့ဆုံးကနေ ပြသပြီး၊ Default ရွေးချယ်မှုအဖြစ် **"Premium"** ကို Active အနေနဲ့ စတင်ဖွင့်လှစ်ပေးပါတယ်။
2. **Lottie Player Integration:** Telegram ရဲ့ `.tgs` vector animation တွေဟာ Gzip ချုံ့ထားတဲ့ Lottie JSON တွေ ဖြစ်တာကြောင့် Browser ရဲ့ native `DecompressionStream('gzip')` နဲ့ `lottie_light.min.js` ကို ပေါင်းစပ်ပြီး `<tg-emoji>` Custom Component နဲ့ လှပစွာ Render လုပ်ပေးထားပါတယ်။
3. **Live Avatar Preview:** Plan တွေ ပြင်ဆင်တဲ့အခါ Custom Emoji ID ရိုက်ထည့်လိုက်တာနဲ့ Plan Avatar မှာ Live Animation ချက်ချင်း ပြောင်းလဲသွားအောင် Input Listener ထည့်သွင်းပေးခဲ့ပါတယ်။

---

## ၇။ W3C Accessibility Error (`aria-label on div`) ဖြေရှင်းခြင်း

Website ကို W3C HTML Validator နဲ့ စစ်ဆေးတဲ့အခါ အောက်ပါ Error တက်လာခဲ့ပါတယ် -

> `Error: The aria-label attribute must not be specified on any div element unless the element has a role value other than caption, code, deletion, emphasis, generic, insertion, paragraph, presentation, strong, subscript, or superscript.`

### အကြောင်းရင်း
HTML5 နဲ့ W3C ARIA စံနှုန်းတွေအရ သာမန် `<div>` တစ်ခုဟာ Implicit Role အနေနဲ့ `generic` ဖြစ်နေပါတယ်။ Generic element တွေပေါ်မှာ `aria-label` တိုက်ရိုက် တပ်ဆင်ခြင်းကို Screen Reader တွေက သတိမထားမိဘဲ ကျော်သွားနိုင်တာကြောင့် တားမြစ်ထားတာ ဖြစ်ပါတယ်။

### ဖြေရှင်းပုံ
Footer ထဲက Lighthouse Score Box နဲ့ Article စာမျက်နှာတွေက Meta Card တွေမှာ သင့်လျော်တဲ့ ARIA Role ဖြစ်တဲ့ `role="group"` ကို ထည့်သွင်းပေးလိုက်ပါတယ် -

```html
<!-- Before (Error) -->
<div class="lighthouse-score mb-4" aria-label="Lighthouse scores">

<!-- After (Valid) -->
<div class="lighthouse-score mb-4" role="group" aria-label="Lighthouse scores">
```

ဒီလို `role="group"` သတ်မှတ်လိုက်တဲ့အတွက် Assistive Technologies တွေအတွက် အဓိပ္ပာယ်ပြည့်ဝသွားပြီး W3C Validator မှာလည်း Error ကင်းစင်သွားခဲ့ပါတယ်။

---

## အနှစ်ချုပ်

ဒီတစ်ခေါက် Update ဟာ Telegram Bot ရဲ့ Backend Logic သာမက Website ရဲ့ Frontend UI/UX၊ Hugo Shortcodes တွေနဲ့ Cloudflare Workers Serverless Architecture အထိ အစိတ်အပိုင်း အားလုံးကို ချိတ်ဆက် ပိုမိုခိုင်မာစေခဲ့ပါတယ်။

တကယ်လို့ ကိုယ်တိုင်လည်း Telegram Bot နဲ့ Mini App တွေ တည်ဆောက်နေတယ်ဆိုရင် Telegram ရဲ့ Custom Emoji Ecosystem နဲ့ Cloudflare Workers ကို ပေါင်းစပ်ပြီး အခုလို စမတ်ကျတဲ့ Feature တွေကို ထည့်သွင်း ဖန်တီးကြည့်ဖို့ အကြံပြုချင်ပါတယ်ဗျာ။
