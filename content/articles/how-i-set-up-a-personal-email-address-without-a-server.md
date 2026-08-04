---
title: "How I Set Up a Personal Email Address Without a Server"
date: 2026-08-04T17:20:40+06:30
image: images/Render-Cloudflare-Worker-Gmail-Integration.webp
thumbnail_image: images/Render-Cloudflare-Worker-Gmail-Integration.webp
description: "ကိုယ်ပိုင် Domain Email ကို Server မထောင်ဘဲ Cloudflare Email Routing၊ Gmail နဲ့ Resend SMTP သုံးပြီး လက်ခံ၊ ပို့နိုင်အောင် ပြင်ဆင်ခဲ့ပုံ။"
summary: "Cloudflare Email Routing နဲ့ ကိုယ်ပိုင် Domain Mail ကို Gmail ဆီ Forward လုပ်ပြီး Resend SMTP ကို Gmail ရဲ့ Send mail as နဲ့ ချိတ်ဆက်အသုံးပြုခဲ့တဲ့ အဆင့်ဆင့်မှတ်တမ်း။"
categories: ["Cloudflare", "Email", "Web Services"]
tags: ["Cloudflare", "Email Routing", "Gmail", "Resend", "SMTP", "Custom Domain"]
series: ["Cloudflare Guides"]
keywords: ["personal email without server", "Cloudflare Email Routing", "custom domain Gmail", "Resend SMTP", "Gmail Send mail as"]
slug: "personal-email-address-without-a-server"
---

ဒီနေ့ ရေးမယ့်အကြောင်းကတော့ ကိုယ်ပိုင် Domain ဝယ်ပြီးတဲ့နောက်၊ ကိုယ်ပိုင် Email Address တစ်ခုကို Mail Server သီးသန့်မထောင်ဘဲ အသုံးပြုခဲ့ပုံပါ။ တချို့ Website တွေမှာ `@gmail.com` နဲ့ `@outlook.com` လို Free Email Address တွေကို လက်မခံတာရှိသလို၊ မြင်နေကျနေရာတွေမှာလည်း ကိုယ့် Domain နဲ့ ကိုယ့် Account လေး မြင်ချင်တာ ပါတာပေါ့။

ကျွန်တော်ကတော့ Mail လက်ခံဖို့ [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/) ကိုသုံးပြီး Gmail ဆီ Forward လုပ်ထားတယ်။ Mail ပို့ဖို့အတွက်တော့ [Resend](https://resend.com) ရဲ့ SMTP Relay ကို Gmail ရဲ့ **Send mail as** နဲ့ ချိတ်ထားတယ်။ ဒီနည်းနဲ့ Inbox အသစ်တစ်ခု ထပ်သုံးစရာမလိုဘဲ Gmail တစ်ခုတည်းကနေ ကိုယ်ပိုင် Domain Mail ကို လက်ခံလို့ရသလို ပြန်ပို့လို့လည်း ရတယ်။

## ဘာတွေလိုအပ်မလဲ

- Cloudflare မှာ DNS စီမံထားတဲ့ ကိုယ်ပိုင် Domain တစ်ခု
- Mail လက်ခံမယ့် Gmail Account တစ်ခု
- Mail ပို့ဖို့ Resend Account တစ်ခု
- Resend မှာ Verify လုပ်ထားတဲ့ Domain နဲ့ API Key တစ်ခု

ဒီ Setup မှာ ကိုယ်ပိုင် Mail Server၊ VPS နဲ့ Database တို့ မလိုအပ်ပါဘူး။ ဒါပေမယ့် Cloudflare က Mail လက်ခံပြီး Forward လုပ်ပေးမှာဖြစ်သလို၊ Resend က Mail ပို့ပေးမှာဖြစ်တဲ့အတွက် ကိုယ်တိုင် Host လုပ်ထားတဲ့ အပြည့်အဝလွတ်လပ်တဲ့ Mailbox တစ်ခုတော့ မဟုတ်ပါဘူး။

## Cloudflare Email Routing နဲ့ Mail လက်ခံမယ်

အရင်ကတော့ Domain တစ်ခုချင်းစီထဲက **Email** Menu ကနေ Setup လုပ်ခဲ့ရပေမယ့် လက်ရှိ Dashboard မှာတော့ **Compute & AI » Email Service » Email Routing** ကနေ ဝင်လို့ရတယ်။ ပြီးရင် **Onboard Domain** ကိုရွေးပြီး Cloudflare အကြံပြုထားတဲ့ DNS Records တွေကို ထည့်ပေးလိုက်ရုံပါပဲ။ Cloudflare မှာ DNS ကို စီမံထားရင် လိုအပ်တဲ့ MX နဲ့ TXT Records တွေကို အလိုအလျောက် ထည့်ပေးနိုင်တယ်။

Email Routing ကို Enable လုပ်ပြီးရင် **Destination addresses** ထဲမှာ Mail လက်ခံမယ့် Gmail Address ကို ထည့်ရတယ်။ Cloudflare က အဲဒီ Gmail ဆီ Verification Mail ပို့ပေးလိမ့်မယ်။ Mail ထဲက Link ကိုနှိပ်ပြီး Verify မလုပ်ရသေးသရွေ့ အဲဒီ Address ဆီ Forward လုပ်လို့မရပါဘူး။

Verify ပြီးသွားရင် **Routing rules » Create address** ထဲမှာ အောက်ပါအတိုင်း ထည့်လိုက်တယ်။

- Custom address: `me@hhk.my.id`
- Action: **Send to an email**
- Destination: Verify လုပ်ထားတဲ့ Gmail Address

![Email Routing Send to Gmail](images/email-routing-send-to-gmail.png "Email Routing Send to Gmail")

ပြီးရင် **Save** လုပ်လိုက်ရုံပါပဲ။ တခြား Email Account တစ်ခုကနေ `me@hhk.my.id` ဆီ Test Mail ပို့ပြီး Gmail Inbox ထဲ ရောက်၊ မရောက် စမ်းကြည့်သင့်တယ်။ မရောက်ရင် Spam Folder၊ Destination Address ရဲ့ Verification Status နဲ့ Routing Rule ကို အရင်စစ်ရမယ်။

Domain ထဲက Address အားလုံးကို Gmail တစ်ခုတည်းဆီ လက်ခံချင်ရင် **Catch-all address** ကိုလည်း ဖွင့်နိုင်တယ်။ ဒါပေမယ့် မလိုအပ်တဲ့ Address တွေဆီ ပို့လာတဲ့ Spam တွေပါ ဝင်လာနိုင်တာကြောင့် ကိုယ်တကယ်သုံးမယ့် Address တစ်ခုချင်းစီအတွက် Rule သီးသန့်ထားတာကိုပဲ ပိုသဘောကျတယ်။

## Email Worker က မဖြစ်မနေလိုသလား

Gmail တစ်ခုဆီ ရိုးရိုး Forward လုပ်ရုံပဲဆိုရင် Email Worker **မလိုပါဘူး**။ Routing Rule ရဲ့ **Send to an email** Action နဲ့တင် လုံလောက်တယ်။

Email တစ်စောင်ကို Destination အများကြီးဆီ ပို့ချင်တာ၊ လက်ခံမယ့် Address ကို စစ်ချင်တာ၊ Header ထည့်ချင်တာ၊ ဒါမှမဟုတ် ကိုယ်ပိုင် Logic တစ်ခုခုနဲ့ Filter လုပ်ချင်တာဆိုမှ Worker ကိုသုံးဖို့ လိုလာမယ်။ အဲဒီအချိန်မှာ **Action » Send to a Worker** ကိုရွေးပြီး Deploy လုပ်ထားတဲ့ Worker ကို ချိတ်ပေးရတယ်။

Worker မရှိသေးရင် **Email Routing » Email Workers » Create** ထဲဝင်ပြီး **Create my own** ကိုရွေးရတယ်။ Worker Name ကို ကိုယ်နှစ်သက်သလို ပေးလို့ရပေမယ့် ကျွန်တော်ကတော့ `mails` လို့ပေးပြီး Deploy လုပ်ထားတယ်။

![Create and deploy a Cloudflare Email Worker](images/cloudflare-email-worker-deploy.png "Create and deploy a Cloudflare Email Worker")

Deploy ပြီးသွားရင် **Email Workers** စာမျက်နှာမှာ Worker ရဲ့ Status နဲ့ Request အခြေအနေကို ပြန်ကြည့်နိုင်တယ်။ ဒီနေရာက **Create route** ကိုနှိပ်ပြီး Routing Rule အသစ်တစ်ခုကိုလည်း တိုက်ရိုက်ဖန်တီးလို့ရတယ်။

![Cloudflare Email Workers and routes](images/email-workers-cloudflare-routes.png "Cloudflare Email Workers and routes")

Routing Rule ဖန်တီးတဲ့အခါ **Action » Send to a Worker** ကိုရွေးပြီး Destination မှာ အခု Deploy လုပ်ထားတဲ့ Worker Name ကို ရွေးလိုက်တယ်။

![Email Routing Send to Worker](images/email-routing-send-to-worker.png "Email Routing Send to Worker")

ဥပမာ `me@hhk.my.id` နဲ့ `contact@hhk.my.id` ကိုပဲ လက်ခံပြီး Gmail ဆီ Forward လုပ်ချင်ရင် Worker Code ကို ဒီလို ရိုးရိုးရှင်းရှင်း ရေးလို့ရတယ်။

```js
const allowedRecipients = new Set([
  "me@hhk.my.id",
  "contact@hhk.my.id",
]);

const destinationAddress = "your-address@gmail.com";

export default {
  async email(message) {
    const recipient = message.to.toLowerCase();

    if (!allowedRecipients.has(recipient)) {
      message.setReject("Address not found");
      return;
    }

    await message.forward(destinationAddress);
  },
};
```

`destinationAddress` မှာ ထည့်ထားတဲ့ Gmail Address က Cloudflare Email Routing ထဲမှာ Verify လုပ်ထားပြီးသား ဖြစ်ရမယ်။ ဒီ Worker က Mail ပို့ပေးတဲ့ Outbound SMTP Server မဟုတ်ဘဲ ဝင်လာတဲ့ Mail ကို စစ်ပြီး Forward လုပ်ပေးတာပဲ ဖြစ်တယ်။ DKIM Private Key ထည့်တာ၊ `message.setDkim()` ခေါ်တာနဲ့ HTTP `fetch()` Handler အတုတစ်ခု ထပ်ထည့်တာမျိုး ဒီအလုပ်အတွက် မလိုအပ်ပါဘူး။

## Resend နဲ့ Mail ပို့မယ်

ဒီလောက်ဆိုရင် Mail လက်ခံတဲ့အပိုင်း ပြီးသွားပြီ။ ဒါပေမယ့် Gmail ကနေ `me@hhk.my.id` အဖြစ် ပြန်ပို့ချင်သေးတယ်။ အဲဒါအတွက် Resend ကို SMTP Relay အဖြစ် သုံးလိုက်တယ်။

Resend ရဲ့ Free Plan မှာ လက်ရှိအချိန်အရ တစ်လကို Email 3,000 နဲ့ တစ်ရက်ကို 100 အထိ ပို့နိုင်ပြီး Custom Domain တစ်ခု သုံးလို့ရတယ်။ Pricing နဲ့ Limit တွေက နောက်ပိုင်း ပြောင်းနိုင်တာကြောင့် Account မဖွင့်ခင် [Resend Pricing](https://resend.com/pricing) မှာ ပြန်စစ်သင့်တယ်။ Dedicated IP က Free Plan ထဲမှာ မပါဘဲ အခကြေးငွေပေးရတဲ့ Add-on ဖြစ်တယ်။ ကိုယ်ရေးကိုယ်တာ Mail အနည်းငယ်ပို့ဖို့အတွက်တော့ Free Plan နဲ့ လုံလောက်တယ်။

Resend မှာ **Domains » Add domain** ကနေ ကိုယ့် Domain ကို ထည့်လိုက်တယ်။ DNS က Cloudflare မှာရှိရင် လိုအပ်တဲ့ SPF နဲ့ DKIM Records တွေကို Auto Configure လုပ်နိုင်တယ်။ Auto Configure မသုံးရင် Resend ပြထားတဲ့ Records တွေကို Cloudflare DNS ထဲ ကိုယ်တိုင်ထည့်ပြီး Domain Status က **Verified** ဖြစ်တဲ့အထိ စောင့်ရမယ်။

ဒီနေရာမှာ Cloudflare Email Routing အတွက် သုံးထားတဲ့ MX Records တွေကို မဖျက်မိဖို့ အရေးကြီးတယ်။ Resend က ပို့တဲ့ဘက်အတွက် SPF နဲ့ DKIM ကိုသုံးပြီး Cloudflare Email Routing က လက်ခံတဲ့ဘက်အတွက် MX Records ကိုသုံးတာဆိုတော့ နှစ်ခုက အလုပ်မတူပါဘူး။

Domain Verify ဖြစ်သွားရင် **API Keys » Create API Key** ကနေ Key အသစ်တစ်ခု လုပ်လိုက်တယ်။ Gmail SMTP အတွက် Mail ပို့ခွင့်ပဲလိုတာကြောင့် ဖြစ်နိုင်ရင် **Sending access** ကိုပဲရွေးပြီး Domain ကိုလည်း လိုအပ်တဲ့ Domain တစ်ခုတည်း ကန့်သတ်ထားတာ ပိုကောင်းတယ်။ API Key ကို Create လုပ်တဲ့အချိန် တစ်ကြိမ်ပဲ အပြည့်အစုံမြင်ရတာဖြစ်လို့ လုံခြုံတဲ့နေရာမှာ ခဏသိမ်းထားရမယ်။ Screenshot ရိုက်ပြီး တင်တာ၊ Article ထဲထည့်တာ၊ Git Repository ထဲ Commit လုပ်တာမျိုး မလုပ်သင့်ပါဘူး။

## Gmail ရဲ့ Send mail as နဲ့ ချိတ်မယ်

Gmail ထဲမှာ အောက်ပါအတိုင်း ဝင်လိုက်တယ်။

**Settings » See all settings » Accounts and Import » Send mail as » Add another email address**

ပထမအဆင့်မှာတော့

- Name: Mail လက်ခံသူဆီမှာ ပေါ်စေချင်တဲ့ နာမည်
- Email address: `me@hhk.my.id`

ကိုယ့် Account ကို သီးခြား Identity တစ်ခုအဖြစ်ထားချင်ရင် **Treat as an alias** ကို Uncheck လုပ်နိုင်တယ်။ Gmail Account ရဲ့ တခြား Alias တစ်ခုလိုပဲ သုံးချင်ရင်တော့ Check ထားလည်းရတယ်။ ပြီးရင် **Next Step** ကိုနှိပ်ပြီး Resend SMTP ကို အောက်ပါအတိုင်း ထည့်လိုက်တယ်။

- SMTP Server: `smtp.resend.com`
- Port: `587`
- Username: `resend`
- Password: Resend API Key
- Secured connection: **TLS**

ဒီနေရာမှာ Username က ကိုယ့် Email Address မဟုတ်ဘဲ `resend` ဖြစ်ရမယ်။ Port `465` နဲ့ SSL ကိုလည်း Resend က ထောက်ပံ့ပေမယ့် Gmail Setup မှာတော့ Port `587` နဲ့ TLS ကိုသုံးထားတယ်။

**Add Account** ကိုနှိပ်လိုက်ရင် Gmail က `me@hhk.my.id` ဆီ Confirmation Mail တစ်စောင် ပို့ပေးလိမ့်မယ်။ အစောပိုင်းမှာ Cloudflare Email Routing ကို ပြင်ထားပြီးသားဆိုတော့ အဲဒီ Mail က Gmail Inbox ထဲ ပြန်ဝင်လာမယ်။ Mail ထဲက Link ကိုနှိပ်တာဖြစ်ဖြစ်၊ Confirmation Code ကို Gmail Settings ထဲ ထည့်တာဖြစ်ဖြစ် လုပ်ပြီး Verify လုပ်လိုက်ရတယ်။

Verify ပြီးသွားရင် Gmail မှာ Compose လုပ်တဲ့အခါ **From** ကိုနှိပ်ပြီး `me@hhk.my.id` ကိုရွေးပို့လို့ရပြီ။ ကိုယ်ပိုင် Domain Address ကို အမြဲသုံးချင်ရင် **Accounts and Import » Send mail as** ထဲမှာ Default Address အဖြစ်လည်း သတ်မှတ်ထားနိုင်တယ်။

## Gmail SMTP ကို တိုက်ရိုက်သုံးခဲ့တုန်းက

Resend မသုံးခင် Gmail SMTP နဲ့လည်း စမ်းခဲ့ဖူးတယ်။ အဲဒီ Setup ကတော့

- SMTP Server: `smtp.gmail.com`
- Port: `587`
- Username: Gmail Address
- Password: Gmail App Password

Google Account ရဲ့ ပုံမှန် Password ကို ထည့်လို့မရပါဘူး။ 2-Step Verification ဖွင့်ထားပြီး App Password ဖန်တီးခွင့်ရှိတဲ့ Account ဆိုရင် App Password သုံးရတယ်။ ပုံမှန် Password ထည့်မိရင် `535 5.7.8 Username and Password not accepted` ဆိုတဲ့ Error ရနိုင်တယ်။ ဒါပေမယ့် ဒီနည်းက Custom Domain ရဲ့ SPF/DKIM Alignment နဲ့ Deliverability ကို ကိုယ်လိုသလို စီမံဖို့ မသင့်တော်တာကြောင့် နောက်ဆုံးမှာ Resend ကိုပဲ ရွေးဖြစ်ခဲ့တယ်။

## စမ်းသပ်ပြီး စစ်ဆေးသင့်တာတွေ

Setup အကုန်ပြီးသွားရင် ကိုယ့် Gmail တစ်ခုတည်းနဲ့ပဲ မစမ်းဘဲ တခြား Provider က Email Address တစ်ခုနဲ့ပါ အောက်ပါအတိုင်း စမ်းသင့်တယ်။

1. တခြား Account ကနေ ကိုယ်ပိုင် Domain Address ဆီ ပို့ပြီး Gmail Inbox ထဲ ရောက်၊ မရောက် စစ်မယ်။
2. Gmail ကနေ **From** ကို ကိုယ်ပိုင် Domain Address ရွေးပြီး ပြန်ပို့မယ်။
3. လက်ခံရရှိတဲ့ Mail ထဲမှာ From Address မှန်၊ မမှန်နဲ့ Spam Folder ထဲ ရောက်၊ မရောက် စစ်မယ်။
4. Mail Header ထဲမှာ SPF၊ DKIM နဲ့ DMARC Result တွေ `PASS` ဖြစ်၊ မဖြစ် စစ်မယ်။

Cloudflare Email Routing က Forward လုပ်တဲ့အပိုင်းကို တာဝန်ယူပြီး Resend က Outbound Mail ပို့တဲ့အပိုင်းကို တာဝန်ယူတယ်။ နှစ်ခုကို Gmail နဲ့ ချိတ်လိုက်တဲ့အခါ Mail Server မထောင်ဘဲ ကိုယ်ပိုင် Domain Email Address တစ်ခုကို နေ့စဉ်သုံးနိုင်သွားတာပေါ့။

ဒီ Setup က Mailbox Hosting အပြည့်အစုံ မဟုတ်သလို Calendar၊ Contacts နဲ့ Server-side Sent Folder လို Feature တွေလည်း မပါဘူး။ Gmail ကနေ ပို့ထားတဲ့ Mail တွေကိုတော့ Gmail ရဲ့ Sent Folder ထဲမှာပဲ တွေ့ရမယ်။ Personal Usage နဲ့ Mail အနည်းငယ်အတွက်တော့ ရိုးရှင်းပြီး အသုံးဝင်တယ်။ Business အတွက် Team Mailbox၊ Compliance၊ Archive နဲ့ Support လိုလာရင်တော့ Google Workspace၊ Microsoft 365 ဒါမှမဟုတ် Mailbox Provider တစ်ခုကို စဉ်းစားတာ ပိုသင့်တော်မယ်။

ရေးရင်းနဲ့ ဒါပဲ!
