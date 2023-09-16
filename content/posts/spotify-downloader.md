+++
author = 'heinhtetkyaw'
date = 2021-08-15T14:39:23+06:30
title = "Spotify Downloader"
image = "/images/spotDL_spotify-downloader.png"
thumbnail_image = "/images/spotDL_spotify-downloader.png"
description = "Download Spotify Public Playlist without Login with spotDL Python spotify Downloader."
tags = ["Python"]
categories = ["Python"]
series = ["Python"]
+++

ဒီရက်ပိုင်းက စရတဲ့ Blog တွေကများနေပြီ မတတ်နိုင်ဘူး။ ဒီ Content ကိုလဲ ဒီရက်ပိုင်းက စရမှာပဲဗျ။ ဒီရက်ပိုင်းမှာ အလုပ်လုပ်မယ် ဆိုပြီးသီချင်းနားထောင်တဲ့အခါမှာ Rock နဲ့ Alternative ဘက်ကို နားထောင်ဖြစ်ပေမယ့်လို့ အရမ်းနားထောင်ဖြစ်တဲ့အထဲမှာမပါတာကြောင့်ကော အာရုံမရတာကောကြောင့် Lofi လေးတွေ နားထောင်ရင်း အလုပ်လုပ်ချင်တာရယ်။ အေးအေးချမ်းချမ်းလေးမှာ Lofi Beat လေးတွေ နားထောင်ချင်တာကြောင့် Spotify က သီချင်းတွေ နားထောင်ရင်းလုပ်မယ်လို့ စဉ်းစားဖြစ်ခဲ့ပါသေးတယ်။

<!--more-->

ဟိုးအရင်ကတော့ Spotify ကို Family package ဝယ်ပြီး နားထောင်ဖြစ်ပေမယ့် အလုပ်နားထားတာကော အပိုဝင်ငွေမရှိသေးတာကောကြောင့် နားထားရတာကြာနေပြီဖြစ်တာကြောင့် Spotify ကိုပြန်မဝယ်ဖြစ်ဘူးဖြစ်နေတယ်။ ဆိုတော့ Spotify က သီချင်းတော်တော်များများကိုလဲ နားမထောင်ဖြစ်ဘူးပေါ့။ ဒီရက်ပိုင်း Lofi ကို အာသီသဖြစ်နေတာနဲ့ပဲ Spotify ကနားထောင်ရရင် အဆင်ပြေမယ်လို့ တွေးမိတာကြောင့် Spotify ကို ဖွင့်ပေမယ့် အကောင့်ဝင်ပြီး နားထောင်လို့ရရင်း မူးနေလို့လား ဘာကြောင့်လဲတော့မသိဘူး နားထောင်ရင်းတန်းလန်းကြီး Account က မီးပျက်လို့ Computer Restart ကျပြီးတော့ Password မှားနေတယ်ပဲ ပြောတာနဲ့ အာရုံအတော်နောက်သွားရတယ်။ ဖြစ်ချင်တော့ ပြောင်းထားတဲ့ Recovery Mail ကလဲ အရင် domain name နဲ့ ဝယ်ထားတဲ့ Gsuite ဖြစ်နေတာကြောင့် Recovery ပြန်ခေါ်လို့မရပြန်ဘူး။ ဆိုတော့ ဘာလုပ်ရမယ်ကမသိ Mail ကို Recovery ပြန်လိုက်ဖို့အတွက် ဟိုလုပ်ဒီလုပ်ရင်း အချိန်ပေးရမှာမလို့ မလုပ်တော့ဘူး ထားလိုက်တော့မယ်ဆိုပြီး၊ ထားလိုက်ရင်းနဲ့ အရင်ကတည်းက သုံးဖြစ်ခဲ့တဲ့ Python Script လေးအကြောင်းကို သတိရသွားတာနဲ့ပဲ ပြန်သုံးဖြစ်ခဲ့ရင်း အခုအချိန်အထိလဲ အတော်ကို အဆင်ပြေနေတာကိုတွေ့ရပြီး Update လဲ တော်တော်ကိုဖြစ်နေတာနဲ့ အဆင်ပြေတာကြောင့် မှတ်စုလေးအဖြစ်ရေးရင်း လာသိမ်းမိပြန်ပါတော့တယ်။ ✍️ စကားချပ်၊ ၊ Youtube က နားထောင်လို့ရပေမယ့် Opera မှာဘာကြောင်တယ်မသိဘူး။ နားထောင်ရင်းနဲ့ ရပ်ရပ်သွားတာကလဲ အာရုံ တော်တော်နောက်တာနဲ့ပဲ Spotify ကို သတိရမိတော့တယ်။

- [spotDL](https://github.com/spotDL/spotify-downloader)

ရှည်ရှည်ဝေးဝေးတော့ပြောနေဖို့မလိုအောင် Source မှာလဲ [Installation](https://github.com/spotDL/spotify-downloader#installation) တွေကော [Usage](https://github.com/spotDL/spotify-downloader#usage) တွေကိုရော ပြထားပြီးသားဖြစ်တာကြောင့် အလွယ်ပဲ အသုံးပြုလို့ရပါတယ်။

အလွယ်ဆုံးကတော့ Python Install လုပ်ထားတာဖြစ်ပြီး pip နဲ့ Install လုပ်လိုက်တာပါပဲ။ Source Code တွေကို Download လုပ်နေစရာမလိုအပ်တော့ပါဘူး။

```cmd
pip install spotdl
```

Example အချို့ကို နည်းနည်းကူးပြရရင်တော့ သီချင်း တစ်ပုဒ်ကို Download လုပ်ချင်ရင် spotdl command ကိုအသုံးပြုပြီးတော့ ဒေါင်းနိုင်ပါတယ်။

```command
spotdl [trackUrl]
spotdl https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b
```

အကယ်လို့သာ Playlist ကို Down ချင်ရင်တော့

```command
spotdl [playlistUrl]
spotdl https://open.spotify.com/playlist/37i9dQZF1E8UXBoz02kGID
```

ဆိုပြီး အလွယ်ပဲ ဒေါင်းနိုင်ပါတယ်။ pip ကနေ Install ထားရင်တော့ Python Installed Folder ထဲကိုရောက်သွားမှာဖြစ်ပြီး။ သင့်လျော်တဲ့နေရာမှာ Folder Create လုပ်ပြီး Folder အတွင်းမှာ Command ကို Run ပေးရမှာပဲဖြစ်ပါတယ်။ ဒါဆိုရင်တော့ ကြိုက်နှစ်သက်တဲ့ သီချင်းကို Offline ရပြီပဲဖြစ်ပါတယ်။ မူရင်း Source မှာတော့ အခြားသော Options တွေရှိသေးတာဖြစ်ပြီး။ spotDL script မှာကတော့ Spotify အပြင် Youtube Music က သီချင်းတွေကို Download လုပ်ထားနိုင်မှာပဲဖြစ်ပါတယ်။ Download လုပ်ပြီးနားထောင်တာလဲ အကောင်းဆုံးဖြစ်မယ်ထင်ရဲ့။ Storage တော့ပေးရပေမယ့် App နဲ့နားထောင်ရင်လဲ Cache အဖြစ်နဲ့ သိမ်းတာပဲဆိုတော့ ထူးတော့မထူးလောက်ပါဘူး။
