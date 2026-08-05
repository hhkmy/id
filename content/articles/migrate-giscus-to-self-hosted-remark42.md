---
title: "Giscus ကနေ Self-hosted Remark42 ဆီ ပြောင်းခဲ့ပုံ"
date: 2026-08-04T23:58:00+06:30
image: images/hugo-remark42-cloudflare-tunnel-architecture.webp
thumbnail_image: images/hugo-remark42-cloudflare-tunnel-architecture.webp
description: "Hugo Website ရဲ့ Comment System ကို Giscus ကနေ Raspberry Pi ပေါ်မှာ Docker နဲ့ Run ထားတဲ့ Remark42 ဆီ ပြောင်းပြီး Cloudflare Tunnel နဲ့ ချိတ်ဆက်ခဲ့ပုံ။"
summary: "GitHub Discussions ကို အခြေခံတဲ့ Giscus အစား ကိုယ်တိုင်ထိန်းချုပ်နိုင်တဲ့ Remark42 ကို Raspberry Pi ပေါ်မှာ Self-host လုပ်ပြီး Hugo Website၊ Dark Mode နဲ့ Cloudflare Tunnel တို့ကို ချိတ်ဆက်ခဲ့တဲ့ Migration မှတ်တမ်း။"
categories: ["Hugo", "Docker", "Self-hosting"]
tags: ["Remark42", "Giscus", "Hugo", "Docker", "Cloudflare Tunnel", "Raspberry Pi", "Comments"]
series: ["Hugo Guides"]
keywords: ["Remark42 Hugo", "self-hosted comments", "Giscus to Remark42", "Remark42 Docker", "Remark42 Cloudflare Tunnel"]
slug: "migrate-giscus-to-self-hosted-remark42"
---

ဒီ Website မှာ Comment System အတွက် အရင်က [Giscus](https://giscus.app) ကို သုံးထားခဲ့တယ်။ Setup လုပ်ရတာလွယ်တယ်၊ GitHub Discussions နဲ့ တိုက်ရိုက်ချိတ်ထားလို့ Database သီးသန့်ထိန်းစရာမလိုဘူး၊ Spam အတွက်လည်း အရမ်းစိတ်ပူစရာမရှိဘူး။ ဒါပေမယ့် Comment ရေးမယ့်သူမှာ GitHub Account ရှိဖို့လိုတာက Personal Blog တစ်ခုအတွက် နည်းနည်းအကန့်အသတ်ဖြစ်လာတယ်။

Blog ဖတ်တဲ့သူတိုင်း Developer မဟုတ်သလို GitHub Account ရှိချင်မှရှိမှာပေါ့။ Comment တစ်ခုရေးဖို့ GitHub Login ဝင်ရတာထက် Email၊ Social Login ဒါမှမဟုတ် Anonymous နဲ့ ရေးလို့ရတာက ပိုအဆင်ပြေမယ်လို့ တွေးမိတယ်။ အဲဒါနဲ့ ကိုယ့် Server ပေါ်မှာ ကိုယ်တိုင်ထိန်းချုပ်လို့ရတဲ့ [Remark42](https://remark42.com) ကို ပြောင်းသုံးဖြစ်ခဲ့တယ်။

ဒီ Post က Giscus မကောင်းလို့ ပြောင်းတာမဟုတ်ဘဲ ကိုယ့် Website နဲ့ ပိုကိုက်တဲ့ Comment System တစ်ခုကို ရွေးခဲ့တဲ့ Migration မှတ်တမ်းပဲ။

## ဘာကြောင့် Remark42 ကို ရွေးခဲ့လဲ

Self-hosted Comment System တွေထဲမှာ Remark42 ကို ရွေးဖြစ်ခဲ့တဲ့အကြောင်းက Setup က သိပ်မရှုပ်ဘဲ လိုအပ်တဲ့ Feature တွေ တော်တော်စုံလို့ပါ။

- Docker Image အသင့်ရှိတယ်
- Comment Data ကို ကိုယ့် Storage ထဲမှာပဲ သိမ်းထားနိုင်တယ်
- Anonymous၊ Email နဲ့ OAuth Login တွေ သုံးနိုင်တယ်
- Light နဲ့ Dark Theme နှစ်မျိုးလုံးရှိတယ်
- Hugo လို Static Site ထဲကို JavaScript အနည်းငယ်နဲ့ ထည့်လို့ရတယ်
- Server အကြီးကြီးမလိုဘဲ Raspberry Pi ပေါ်မှာ Run လို့ရတယ်

အဓိက သဘောကျတာက Website က Static အတိုင်းပဲ ဆက်ရှိနေပြီး Comment အပိုင်းတစ်ခုတည်းကို Remark42 က သီးသန့်တာဝန်ယူပေးတာပဲ။ Hugo Build နဲ့ Remark42 Server ကို တစ်ခုနဲ့တစ်ခု ရောထွေးထားစရာမလိုဘူး။

## ကျွန်တော့် Setup ပုံစံ

ဒီ Migration မှာ Traffic သွားတဲ့လမ်းကြောင်းက အောက်ကလိုပါ။

```goat {title="Remark42 setup architecture"}
                         Public HTTPS
 .------------------.   .------------------------.
 | Article on       |-->| comments.hhk.my.id     |
 | hhk.my.id        |   | Cloudflare Edge (TLS)  |
 '------------------'   '-----------+------------'
                                    |
                         Cloudflare Tunnel
                                    |
                                    v
 Raspberry Pi / Docker Network
                         .------------------------.
                         | cloudflared container  |
                         '-----------+------------'
                                     |
                           http://remark42:8080
                                     |
                                     v
                         .------------------------.
                         | Remark42 container     |
                         +------------------------+
                         | ./remark42/var         |
                         '------------------------'
```

Browser က `comments.hhk.my.id` ကို HTTPS နဲ့ ခေါ်ပေမယ့် Raspberry Pi ထဲမှာတော့ Cloudflare Tunnel က Remark42 Container ဆီ `http://remark42:8080` နဲ့ ဆက်သွယ်တယ်။ Public ဘက်မှာ HTTPS ဖြစ်ပြီး Docker Network အတွင်းမှာ HTTP သုံးထားတာက မှားနေတာမဟုတ်ဘူး။ TLS ကို Cloudflare Edge မှာ အဆုံးသတ်ပေးပြီး Private Docker Network ထဲက Origin ဆီ HTTP နဲ့ ဆက်သွားတာပဲ။

## Docker Compose နဲ့ Remark42 Run မယ်

Remark42 အတွက် Compose Service ကို ရိုးရိုးရှင်းရှင်း ဒီလိုထားလို့ရတယ်။

```yaml
services:
  remark:
    image: ghcr.io/umputun/remark42:latest
    container_name: remark42
    hostname: remark42
    restart: unless-stopped
    environment:
      REMARK_URL: ${REMARK_URL:?set REMARK_URL in .env}
      SECRET: ${REMARK_SECRET:?set REMARK_SECRET in .env}
    volumes:
      - ./remark42/var:/srv/var
    networks:
      - remark42

networks:
  remark42:
    name: remark42
```

`.env` ထဲမှာတော့ Public URL နဲ့ Secret ကို ထည့်ထားရမယ်။

```dotenv
REMARK_URL=https://comments.example.com
REMARK_SECRET=replace-with-a-long-random-secret
```

`REMARK_SECRET` ကို Article၊ Screenshot ဒါမှမဟုတ် Git Repository ထဲ မထည့်သင့်ဘူး။ ဒီ Value က Remark42 ရဲ့ Authentication Token တွေကို Sign လုပ်ရာမှာ သုံးတာဖြစ်လို့ ရှည်ပြီး ခန့်မှန်းရခက်တဲ့ Random Value တစ်ခု သုံးတာပိုကောင်းတယ်။

`./remark42/var:/srv/var` Volume က Comment နဲ့ Application Data တွေကို Container ပြန်တည်ဆောက်တဲ့အခါ မပျောက်အောင် သိမ်းပေးထားတယ်။ Container ကို Update လုပ်တာနဲ့ Comment Data ကို ဖျက်ပစ်တာက အလုပ်မတူတဲ့အတွက် ဒီ Volume ကို Backup လုပ်ထားဖို့လည်း လိုတယ်။

## Cloudflare Tunnel နဲ့ ချိတ်မယ်

ကျွန်တော့် `cloudflared` နဲ့ Remark42 Container နှစ်ခုကို `remark42` Docker Network တစ်ခုတည်းထဲ ထည့်ထားတယ်။ Cloudflare Tunnel ရဲ့ Published Application Route ကတော့ ဒီလိုပါ။

```text
Hostname: comments.hhk.my.id
Service:  http://remark42:8080
```

ဒီနေရာမှာ `localhost:8080` မသုံးရတဲ့အကြောင်းက `cloudflared` ကိုယ်တိုင်လည်း Container ထဲမှာ Run နေလို့ပါ။ Container တစ်ခုအတွင်းက `localhost` က အဲဒီ Container ကိုပဲ ပြန်ညွှန်တယ်။ Remark42 ရှိတဲ့ တခြား Container ဆီ သွားချင်ရင် Docker DNS က သိတဲ့ `remark42` ဆိုတဲ့ Hostname ကို သုံးရတယ်။

Remark42 က Port `8080` မှာ HTTP နဲ့ Listen လုပ်နေတာကြောင့် Tunnel Service ကို `https://remark42:8080` လို့ မထားသင့်ဘူး။ HTTPS လို့ သတ်မှတ်လိုက်ရင် TLS မပြောတတ်တဲ့ HTTP Origin ဆီ TLS Handshake စလုပ်မှာဖြစ်လို့ တကယ့် Protocol Error ဖြစ်သွားမယ်။

## Hugo ထဲက Giscus ကို ဖြုတ်မယ်

အရင် Giscus Partial ကို Article Template ထဲမှာ ဒီလို ခေါ်ထားခဲ့တယ်။

```go-html-template
{{ partial "giscus.html" . }}
```

Migration လုပ်တဲ့အခါ Partial Name ကို Comment Provider နာမည်နဲ့ တိုက်ရိုက်မချိတ်တော့ဘဲ နောက်ပိုင်း ပြန်ပြောင်းရလွယ်အောင် `comments.html` လို့ ပြောင်းထားလိုက်တယ်။

```go-html-template
{{ partial "comments.html" . }}
```

`layouts/_partials/comments.html` ထဲမှာ Remark42 Configuration နဲ့ Embed Script ကို ထည့်ထားတယ်။

```html
<div class="article-comments">
  <h2>Comments</h2>
  <script>
    window.remark_config = {
      host: "https://comments.hhk.my.id",
      site_id: "remark",
      theme: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
      components: ["embed"],
    };
  </script>
  <script>
    !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);
  </script>
  <div id="remark42">Comments loading...</div>
</div>
```

`site_id` က Backend မှာ သတ်မှတ်ထားတဲ့ `SITE` နဲ့ တူရမယ်။ Backend မှာ `SITE` မသတ်မှတ်ထားရင် Remark42 ရဲ့ Default Site ID ဖြစ်တဲ့ `remark` ကို သုံးလို့ရတယ်။ Site ID မတူရင် Server Run နေပေမယ့် Comment Thread ကို မှန်မှန်မဖွင့်နိုင်ဘူး။

## Dark Mode ပြောင်းတဲ့အခါ Theme လိုက်ပြောင်းမယ်

Page စဖွင့်တဲ့အချိန် Theme မှန်ရုံနဲ့ မလုံလောက်သေးဘူး။ Website ပေါ်က Theme Toggle ကို နှိပ်တဲ့အခါ Remark42 ကို Reload မလုပ်ဘဲ Theme လိုက်ပြောင်းစေချင်သေးတယ်။ Remark42 က `window.REMARK42.changeTheme()` API ပေးထားလို့ Site Theme ပြောင်းတဲ့ Function ထဲမှာ ဒီလိုခေါ်ထားတယ်။

```js
const setRemark42Theme = (theme) => {
  window.REMARK42?.changeTheme(theme === "dark" ? "dark" : "light");
};
```

Optional Chaining (`?.`) သုံးထားတာက Remark42 Script မတက်သေးခင် Theme Function အရင် Run သွားရင် Error မတက်အောင်ပါ။ Widget စတက်တဲ့အချိန်မှာတော့ `remark_config.theme` က HTML ရဲ့ လက်ရှိ `.dark` Class ကို ဖတ်ထားတာကြောင့် Initial Theme မှန်နေမယ်။ နောက်ပိုင်း Toggle လုပ်တဲ့အခါ `changeTheme()` က ဆက်တာဝန်ယူပေးတယ်။

## Localhost မှာ `Protocol mismatch` ပေါ်ခဲ့တာ

Migration ပြီးစမ်းတဲ့အခါ Browser Console ထဲမှာ ဒီ Warning ကို တွေ့ခဲ့တယ်။

```text
Remark42: Protocol mismatch.
```

ပထမမြင်တဲ့အချိန်မှာ Cloudflare Tunnel က HTTP သုံးထားတာမှားသလား၊ Docker Network မှာ ပြဿနာရှိသလားဆိုပြီး ထင်မိနိုင်တယ်။ တကယ်တော့ Local Development URL နဲ့ Remark42 Host ရဲ့ Protocol မတူလို့ပဲ။

```text
Local Hugo: http://localhost:1313
Remark42:   https://comments.hhk.my.id
```

Remark42 Embed Script က Page နဲ့ Comment Host ရဲ့ Protocol ကို စစ်ပြီး မတူရင် Warning ထုတ်ပေးတယ်။ Production မှာတော့ Website နဲ့ Remark42 နှစ်ခုစလုံး HTTPS ဖြစ်လို့ ဒီ Warning မပေါ်တော့ဘူး။ Localhost မှာပေါ်တာက Tunnel Origin ကို HTTPS ပြောင်းရမယ်ဆိုတဲ့ အဓိပ္ပာယ်မဟုတ်ဘူး။

ဒီလို Error တစ်ခုတွေ့ရင် အလွယ်တကူ Configuration ပြောင်းမယ့်အစား အပိုင်းလိုက်စစ်တာ ပိုကောင်းတယ်။

1. Remark42 Container က Healthy ဖြစ်၊ မဖြစ် စစ်မယ်။
2. Container အတွင်း `http://127.0.0.1:8080/web/` ပြန်၊ မပြန် စစ်မယ်။
3. `cloudflared` နဲ့ Remark42 က Docker Network တူ၊ မတူ စစ်မယ်။
4. Tunnel Route က `http://remark42:8080` ဖြစ်၊ မဖြစ် စစ်မယ်။
5. Public `https://comments.example.com/web/` က HTTP 200 ပြန်၊ မပြန် စစ်မယ်။

ဒီငါးခုလုံးမှန်ရင် Origin Protocol က ပြဿနာမဟုတ်တော့ဘူး။ Browser Console Warning က ဘယ် URL နှစ်ခုကို နှိုင်းယှဉ်ပြီး ထုတ်တာလဲဆိုတာ ဆက်ကြည့်ရမယ်။

## အရင် Comment တွေက အလိုအလျောက်ပါလာမလား

Giscus က Comment တွေကို GitHub Discussions ထဲမှာ သိမ်းပြီး Remark42 က ကိုယ်ပိုင် Data Store ထဲမှာ သိမ်းတယ်။ Storage ပုံစံနှစ်ခု မတူတာကြောင့် Script ပြောင်းလိုက်ရုံနဲ့ အရင် Giscus Comment တွေ Remark42 ထဲ အလိုအလျောက် ရောက်မလာဘူး။

အရင် Discussion တွေကို GitHub မှာ ဆက်ထိန်းထားတာ၊ လိုအပ်တဲ့ Comment တွေကို ကိုယ်တိုင်ပြန်ရွှေ့တာ၊ ဒါမှမဟုတ် Migration Tool တစ်ခု သီးသန့်ရေးတာဆိုပြီး ရွေးစရာရှိတယ်။ ကျွန်တော့် Website မှာ အရင် Comment Data မများသေးတာကြောင့် Comment System အသစ်ကို Clean Start လုပ်လိုက်တာ ပိုရိုးရှင်းတယ်။

## Migration ပြီးနောက်

အခုဆို Article Page တွေမှာ GitHub Account မရှိလည်း Remark42 က ခွင့်ပြုထားတဲ့ Login နည်းလမ်းနဲ့ Comment ရေးနိုင်သွားပြီ။ Comment Data၊ Backup နဲ့ Update တို့ကို ကိုယ်တိုင်တာဝန်ယူရတာက Self-hosting ရဲ့ အပိုအလုပ်ဖြစ်ပေမယ့် ဘယ်လို Run မလဲ၊ Data ဘယ်မှာထားမလဲဆိုတာ ကိုယ်တိုင်ဆုံးဖြတ်လို့ရတာကိုတော့ ပိုသဘောကျတယ်။

Giscus က Setup လွယ်ပြီး Developer Audience များတဲ့ Website တွေအတွက် ကောင်းတုန်းပဲ။ Remark42 ကတော့ Login ရွေးချယ်စရာပိုလိုတာ၊ Comment Data ကို ကိုယ်တိုင်ပိုင်ချင်တာ၊ Server နဲ့ Backup ကို ကိုယ်တိုင်ထိန်းနိုင်တာမျိုးဆို ပိုကိုက်တယ်။ ဘယ်ဟာက ပိုကောင်းလဲဆိုတာထက် ကိုယ့် Website ကို ဘယ်သူတွေဖတ်ပြီး ကိုယ်က ဘယ်လောက်ထိ ထိန်းချုပ်ချင်လဲဆိုတာနဲ့ ရွေးတာ ပိုမှန်မယ်။

ကျွန်တော့်အတွက်တော့ Raspberry Pi ပေါ်မှာ Run နေပြီးသား Docker Stack နဲ့ Cloudflare Tunnel ရှိနေတော့ Remark42 ကို ထပ်ထည့်ရတာ အရမ်းမရှုပ်ဘူး။ Comment System ကို ကိုယ်တိုင်ထိန်းနိုင်သွားသလို Hugo ဘက်က Integration ကိုလည်း `comments.html` Partial တစ်ခုထဲ သီးသန့်ထားနိုင်တာကြောင့် နောက်ပိုင်းထိန်းရတာ ပိုရှင်းသွားတယ်။

ရေးရင်းနဲ့ ဒါပဲ!
