---
title: Download m3u8 with ffmpeg
date: 2023-09-28T18:12:51+06:30
image: /images/m3u8-data.png
thumbnail_image: /images/m3u8-data.png
description: m3u8 url တွေကို ffmpeg နဲ့ ဘယ်လို Download လုပ်ရမလဲဆိုတာကို လာမှတ်ထားတာပါ။ ဒီနည်းကတော့ တော်တော်များများသော key တွေနဲ့ ပိတ်ထားတာကိုတောင် download လုပ်နိုင်ပါတယ်။
summary: online ပေါ်က Downloader တွေနဲ့တောင် download လုပ်လို့မရတဲ့ m3u8 file format တွေကို ffmpeg software နဲ့ဘယ်လို Download လုပ်လို့ရသလဲဆိုတာလေးကို လာမှတ်ထားတာပါ။ IDM paid version နဲ့တောင် Download လုပ်လို့မရဘူး (ကြွားတာ) ဆိုတော့ အခြားနည်းရှာကြည့်တဲ့အခါ ffmpeg က တော်တော်လေးကိုအဆင်ပြေလှပေတော့တယ်။
categores:
  - m3u8
  - ffmpeg
tags:
  - m3u8
  - ffmpeg
series: m3u8
keywords:
  - ffmpeg
  - m3u8
slug: download-m3u8-ffmpeg
---

ကျွန်တော်တို့ m3u8 format ကို Download လုပ်ဖို့အတွက်ဆိုရင် Downloader တွေနဲ့ download လုပ်လို့မရတဲ့ အချိန်တွေလည်းရှိပါတယ်။ အဲ့ဒါကြောင့်လိုက်ရှာကြည့်တဲ့အခါမှာတော့ ffmpeg နဲ့ ဘယ်လို Download လုပ်ပရမလဲဆိုတာကို တွေ့ပြီး သုံးကြည့်တဲ့အခါမှာ တော်တော်လေးကို သဘောကျနေတာနဲ့ပဲ Note အဖြစ်လာသိမ်းရင်း၊ ဒီ Content လေးကို ရေးရရင်တော့ဖြင့် xD
ပထမဆုံး လိုအပ်တာကတော့ ffmpeg ဖြစ်လို့ Google မှာပဲ သွားရှာပြီး download လုပ်လိုက်ပါ ပြီးရင်တော့ **System Environment Variables** ထဲမှာ Download လုပ်ထားတဲ့ ffmpeg direction ကိုသွားပြီးတော့ ရွေးပေးထားဖို့လိုအပ်ပါတယ်။ ကျွန်တော်ကတော့ app တော်တော်များများကို သုံးတာဆိုတော့ bins ဆိုပြီးတော့ Folder သီးသန့်လေးလုပ်ထားပြီး အသုံးပြုဖြစ်တာများတဲ့ app တော်တော်များများကို အဲ့ဒီအထဲထည့်ထားပါတယ်။ ဆိုတော့ app တစ်ခုခု သုံးချင်တိုင်း သီးသန့် variables တွေကို သတ်မှတ်နေစရာမလိုတော့ပဲ folder ထဲက app တွေကို အကုန်အလုပ်လုပ်ပါလိမ့်မယ်။ ကျွန်တော် လုပ်ထားသလိုဆိုရင်တော့။

**C:\bins** ဆိုပြီးတော့ သီးသန့် Folder လေးတစ်ခုလုပ်ထားပါတယ်။ အဲ့ဒီထဲမှာ **ffmpeg**, **hugo** နဲ့ အခြားသောအရာတွေအကုန်ထည့်ထားလိုက်ပါတယ်။

![Bins Folder](/images/bins-folder.png)

အခုလိုမျိုး bins folder ထဲမှာ သီးသန့်ထားပြီးသွားရင်တော့

**System Environment Variables > Environment Variables > User variables > Path** အောက်ထဲမှာ bin folder ကို ထည့်ပေးရမှာပါ။ ကျွန်တော်ကတော့ **C:\bins** ဖြစ်လို့ **C:\bins** လေးကိုထည့်ပေးထားလိုက်ပါတယ်။

![Edit Environment Variable](/images/edit-environment-variable.png)

ထည့်ပြီးသွားရင်တော့ ffmpeg ကို အလုပ်လားမလုပ်လား စမ်းဖို့အတွက်တော့ Command Prompt ဖြစ်ဖြစ် bash ဖြစ်ဖြစ် Terminal တစ်ခုခုဖွင့်ပြီး **ffmpeg** လို့ ရိုက်ကြည့်လိုက်ပါ။အောက်ကလိုပေါ်လာရင်တော့ အဆင်ပြေပါပြီ။

![ffmpeg](/images/ffmpeg.png)

ရှေ့ဆက်ရရင်တော့ဖြင့် ffmpeg လည်းရပြီ အဆင်ပြေပြီဆိုတော့ ကျွန်တော်တို့ m3u8 file ကို ဘယ်လိုရှာမလဲဆိုတာကို ဆက်ပြီး ပြောပြပေးသွားရရင် ကျွန်တော်တို့ download ဆွဲချင်တဲ့ webpage ကိုသွားပြီးတော့ Inspect Element ကိုဖွင့်ပေးရပါမယ်။ ပြီးရင်တော့ Networks Tab ကိုသွားပြီး Network tab လေးမှာ **m3u8** ဆိုပြီး search box မှာ ရိုက်ရှာပေးလိုက်ပါ။ ရိုက်ရှာဖို့ဆိုရင်တော့ ပထမဆုံး Network tab ကိုဖွင့်တာဖြစ်လို့ ပေါ်မလာရင်တော့ Webpage ကို Refresh လုပ်ပြီးတော့ **m3u8** ကိုရိုက်ရှာလိုက်ပါ။ တွေ့လာတဲ့ m3u8 file လေးကို ထောက်လိုက်ရင်တော့ သက်ဆိုင်ရာ Information လေးတွေ ကျလာမှာပြဖြစ်ပါတယ်။

![m3u8 URL Data](/images/m3u8-data.png)

အဲ့ဒါပြီးသွားရင်တော့ Request URL: ဘေးက url link တွေအကုန်လုံးကို copy ကူးပေးလိုက်ပြီး notepad or some text editor တစ်ခုခုမှာ မှတ်ထားလိုက်ပါ။ download လုပ်ရမယ့် code ကတော့။

```command
ffmpeg -multiple_requests 1 -reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 5 -i RequestURL -c copy -bsf:a aac_adtstoasc name.mp4
```

ffmpeg ဆိုတာကတော့ ffmpeg ကို downloader အဖြစ်နဲ့ အသုံးပြုလို့ရအောင်အတွက် ကျန်တာတွေကတော့ command တွေနဲ့ RequestURL မှာကတော့ ကျွန်တော်တို့ရဲ့ Request URL: link ပါ ပြီးရင်တော့ နောက်ဆုံးက name.mp4 ကတော့ download လုပ်ပြီး ဘယ် file အနေနဲ့ သိမ်းမယ်ဆိုတာကိုပြောတာပဲဖြစ်ပါတယ်။ ဆိုတော့ ကျွန်တော်တို့ real data နဲ့သွားကြည့်လိုက်ရအောင် ...

```command
ffmpeg -multiple_requests 1 -reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 5 -i https://dash.realurl.link/videos/651501e91688661414df2978/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJ2aWV3IiwiaWF0IjoxNjk1OTIzMjU0LCJleHAiOjE2OTU5MjMzNTR9.g6GaM9H29Q7IxmKtE3jy2r8jhtV0h71EshP0D-n464U -c copy -bsf:a aac_adtstoasc hi.mp4
```

![m3u8 Downloader](/images/m3u8-download.png)

အခုလိုမျိုး ပုံပါအတိုင်းတွေ့ရပြီဆိုရင်တော့ဖြင့် m3u8 file ကို hi.mp4 အဖြစ်နဲ့ download လုပ်နေပြီပဲဖြစ်ပါတယ်။ installation ကတော့ အရမ်းကြီးလိုအပ်တာမျိုးမဟုတ်ပါပဲ ffmpeg application လေးကို bin folder ထဲထည့်ပြီး ရိုးရိုး cmd or terminal ကနေပဲ download လုပ်သွားတာပဲဖြစ်ပါတယ်။

အခုလောလောဆယ်မှာတော့ Linux မသုံးဖြစ်သေးတော့ linux အတွက်ကတော့ ffmpeg ဘယ်လို installation လုပ်ရမလဲရှာပြီး ffmpeg နဲ့ m3u8 file တွေကို အဆင်ပြေပြေ download ဆွဲနိုင်ပြီပဲဖြစ်ပါတယ်။

တကယ့်တကယ်မှာတော့ ffmpeg နဲ့ပဲ Youtube နဲ့ Spotify က သီချင်းတွေကို Download လုပ်လို့ရသေးတာဆိုတော့ နောက်များမှ ffmpeg အကြောင်းကို ဆက်ရှာပြီး ရေးပေးပါအုံးမယ်။ အခုတော့ Download လုပ်နည်းလေးကို txt file နဲ့ သိမ်းထားတာ ပြန်တွေ့လို့ရေးရင်းနဲ့ပဲ။ ဒီ Post ရေးပြီး ဘယ်လောက်ကြာကြာအထိ New Content မလာနိုင်သေးဘူးလည်းဆိုတာကို မသိရင်းနဲ့ပဲ ... အားလုံးပဲ အဆင်ပြေကြဖို့တော့ တကယ်ကို မျှော်လင့်မိပါတယ်။
