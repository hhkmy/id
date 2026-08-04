---
title: Apply Hugo Module Twemoji
date: 2021-08-01T16:52:52+06:30
image: images/Twemoji-Hugo.png
categories: ["Web Development", "Hugo"]
description:
  Hugo Website မှာ Twitter Emoji အတွက်ရှာရင်း ဖွေရင်း Error တွေ တက်ရင်း
  အဆင်ပြေသွားတာလေးကို Blog အဖြစ်နဲ့ Note လာသိမ်းရင်း Share ပေးလိုက်ပါတယ်။
summary:
  Emoji တွေထဲမှာကတော့ Twitter ရဲ့ Emoji ကို တော်တော်သဘောကျတာဆိုတော့ ရှာရင်း
  ဖွေရင်းနဲ့ တွေ့ဖြစ်တာလေးကို ပြန်ရေးပေးလိုက်ပါတော့မယ်။ ထည့်ခဲ့တုန်းက Error တွေ
  တက်ခဲ့ရတာဆိုတော့ အဆင်ပြေသွားတော့ Note လေးအဖြစ်နဲ့ သိမ်းထားရင်းနဲ့ပေါ့။ Hugo
  Version အမြင့်တွေမှာ အဆင်ပြေမပြေမသိပေမယ့် အနိမ့်တွေမှာတော့
  အဆင်ပြေခဲ့တာဆိုတော့။ တော်တော်လေးကို အဆင်ပြေခဲ့ရတာပါ။
tags:
  - hugo
  - Emoji
keywords:
  - hugo
slug: apply-hugo-module-twemoji
---

Emoji ထဲမှာတော့ Saumsung နဲ့ iPhone က Emoji တွေကို သဘောကျပေမယ့်
လိုက်ရှာကြည့်တဲ့အခါမှာတော့ Twitter က Emoji လေးတွေကလဲ
တော်တော်လှတဲ့အထဲပါတာဖြစ်ပြီး Twiiter Emjoi တွေကိုတော့ Open Source သဘောမျိုးနဲ့
Share ပေးထားတာတွေ့တာကြောင့် အခုရက်ပိုင်း Website တွေထဲ ထည့်ထည့်သုံးဖြစ်ရင်း
အခြားအရာတွေမှာလဲ ထည့်သုံးမယ်လို့ တွေးထားတာကြောင့် လိုက်ရှာရင်း။ ဒီ Site က
[Hugo](https://gohugo.io) နဲ့ရေးထားတာဖြစ်တာကြောင့် Hugo အတွက်ပါ လိုက်ရှာ
ဖြစ်ခဲ့တော့တယ်။

အရင်ဆုံး လိုက်ရှာကြည့်တဲ့အခါမှာတော့ twemoji ကိုတွေ့တယ်ဆိုပေမယ့် Twemji က hugo
ရဲ့ Module တစ်ခုအဖြစ်နဲ့တွေ့တာကြောင့် ဘယ်လို လုပ်ရမယ်ဆိုတာကို
သေသေချာချာမသိဖြစ်သွားခဲ့ရင်း။ အခုတော့ အဆင်ပြေသွားတာကြောင့် ဒီလိုမျိုး
ပြန်ရေးနိုင်တော့တာပဲဖြစ်ပါတယ်။ Twemoji အတွက်ကတော့ Twitter ရဲ့ soure မှာ
ဝင်ရောက်ပြီးရယူနိုင်တယ်ဆိုပေမယ့် hugo အတွက်ကတော့ Module အဖြစ်နဲ့ဆိုတော့လဲ module
အရပေါ့။

- [jakejarvis/hugo-mod-twemoji](https://github.com/jakejarvis/hugo-mod-twemoji)

မူရင်း Source ကတော့

- [twitter/twemoji](https://github.com/twitter/twemoji)

![Twemoji Hugo](images/Twemoji-Hugo.png "Twemoji Hugo")

မှာသွားရောက်ရယူနိုင်ပြီး Template ထဲ ထည့်သုံးရင်အဆင်ပြေပါတယ်။ ဒါပေမယ့်
ပိုပြေသွားအောင်ကတော့ ကျွန်တော် Module နဲ့ ဘယ်လိုအဆင်ပြေခဲ့တယ်ဆိုတာကို
မှတ်စုအဖြစ်နဲ့ စပြီးရေးပေးပါတော့မယ်။

အရင်ဆုံး
[jakejarvis/hugo-mod-twemoji](https://github.com/jakejarvis/hugo-mod-twemoji)
ကိုတွေ့ခဲ့ပြီး သူ့နည်းလမ်းအတိုင်းလုပ်တဲ့အခါမှာ သိပ်ပြီးအဆင်မပြေတာနဲ့
ဟိုရှာဒီရှာရှာကြည့်တဲ့အခါမှာတော့ အဆင်ပြေသွားတဲ့အရာကတော့ Golang ကို Install
မလုပ်ခဲ့တာကြောင့် Install လုပ်ပြီးတဲ့အခါမှာလဲ Error
နည်းနည်းရှိနေသေးတာနဲ့ဆက်ရှာရင်း ဟိုရှာဒီရှာကြည့်တဲ့အခါမှာတော့ Hugo ရဲ့ Docs
ထဲမှာ
[Initialize a New Module](https://gohugo.io/hugo-modules/use-modules/#initialize-a-new-module)
ကိုသွားတွေ့တာနဲ့ လုပ်ကြည့်လိုက်တဲ့အခါမှာ အဆင်ပြေသွားခဲ့တယ်။ အဲ့ဒီနောက်မှာတော့
[jakejarvis/hugo-mod-twemoji](https://github.com/jakejarvis/hugo-mod-twemoji)
မှာ Readme ထဲရေးထားတဲ့အတိုင်း config.toml file အတွင်း ထည့်သင့်တာတွေထည့်ပြီး
စမ်းသပ်တဲ့အခါမှာတော် အကုန်လုံးလိုလို အဆင်ပြေသွားပြီး Twemoji က ကောင်းကောင်း Run
ခဲ့ပြီပဲဖြစ်ပါတယ်။

```toml
[module]
 [[module.imports]]
  path: "github.com/jakejarvis/hugo-mod-twemoji"
```

ထည့်ခိုင်းပေမယ့်။ config.toml file ထဲမှာ

```toml
themesDir: "themes"
```

ထည့်လိုက်မှပဲ အဆင်ပြေတော့တယ်။ config.toml ထဲမှာ ထည့်လိုက်တဲ့ code
အပြည့်အစုံကတော့

```toml
themesDir: "themes"

[module]
  [[module.imports]]
    path: "github.com/jakejarvis/hugo-mod-twemoji"
  [[module.mounts]]
    source: "static"
    target: "static"
  [[module.imports]]
    path: "github.com/twitter/twemoji"
    [[module.imports.mounts]]
          source: "assets/svg"
          target: "static/twemoji/svg"
```

ပဲဖြစ်ပါတယ်။ ဒီလိုလုပ်လိုက်ခြင်းအားဖြင့် config.toml file အပိုင်းပြီးသွားပြီး။
Console မှာ

```cmd
hugo mod init github.com/jakejarvis/hugo-mod-twemoji
```

လို့ရိုက်လိုက်တဲ့အခါမှာ Error ကင်းဝေးသွားပြီး။ Site အတွင်း Emoji
ကောင်းကောင်းမြင်နိုင်ပြီပဲဖြစ်ပါတယ်။ နောက်တစ်ဆင့်အနေနဲ့ကတော့ မမြင်ရသေးဘူးဆိုရင်
Template ပြင်ရပါမယ်။ အခုလို လုပ်ဖို့ဆိုရင်တော့ ... လက်ရှိအသုံးပြုနေတဲ့ Theme
ကိုသွားပြီး

```dir
📦 Hugo project
 ┣ 📂 themes
 ┣ 📂 theme_name
 ┣ 📂 layouts
 ┣ 📂 _default
  ┗ 📜 baseof.html
```

ရဲ့ အတွင်းမှာ

```HTML
</body>
```

အပေါ်မှာ

```partial template
{{ partial "twemoji" . }}
```

လို့ ထည့်ပေးလိုက်မယ်ဆိုရင် "twemoji" file အတွင်းမှာရှိတဲ့ partial ကို Embed
လုပ်ပြီး သုံးလို့ရပြီပဲဖြစ်ပါတယ်။ အဲ့ဒါတွေအကုန်လုံးပြီးသွားရင်တော့ css file
ထဲကိုသွားပြီး emoji ရဲ့ size ကို Twitter ရဲ့ Suggest css code တွေကို
ထည့်ပေးလိုက်မယ်ဆိုရင်တော့ လုံးဝ Perfect [Hugo mod
Twemoji]({{< ref "apply-hugo-module-twemoji.md" >}} "hugo-mod-twemoji")
ကိုရရှိပြီပဲဖြစ်ပါတယ်။

```css
img.emoji {
  height: 1em;
  width: 1em;
  margin: 0 0.05em 0 0.1em;
  vertical-align: -0.1em;
}
```

ဒါလေးကိုတော့ တစ်ချိန်ပြန်အသုံးဝင်ကောင်းဝင်နိုင်တာရယ် မှတ်စုအဖြစ်ရယ်
လာသိမ်းတာရယ်။ Hugo အသုံးပြုသူတွေအတွက်
အဆင်ပြေအသုံးပြုနိုင်အောင်ရည်ရွယ်ပြီးရေးလိုက်ပါတယ်။ ဖတ်တဲ့ကြားထဲက
မရှင်းတာများရှိရင် မေးမြန်းထားခဲ့လို့ရပါတယ်။
