+++
author = 'heinhtetkyaw'
title = 'Hyper Terminal Customize'
date = 2023-08-25T04:11:08+07:00
categories = ["Terminal", "Windows"]
tags = ["Terminal", "Windows"]
series = ["Windows"]
image = "/images/hyper-terminal-windows-10.png"
thumbnail_image = "/images/hyper-terminal-windows-10.png"
description = "Hyper Terminal Install လုပ်ပြီးပြီဆိုတော့ Customize လုပ်ဖို့အပိုင်းလေးပေါ့။ အစကတော့ အကုန်လုံးကို Content တစ်ခုထဲရေးမယ်ဆိုပေမယ့် အရမ်းရှည်သွားမှာဆိုတော့ ၂ ခုခွဲရေးဖြစ်သွားတော့တာလေးပေါ့"
toc = "true"
backtotop = "true"
+++

Hyper Terminal Install လုပ်ပြီးပြီဆိုတော့ Customize လုပ်ဖို့အပိုင်းလေးပေါ့။ အစကတော့ အကုန်လုံးကို Content တစ်ခုထဲရေးမယ်ဆိုပေမယ့် အရမ်းရှည်သွားမှာဆိုတော့ ၂ ခုခွဲရေးဖြစ်သွားတော့တာလေးပေါ့။ ဒီ Content လေးကတော့ Hyper Terminal ကို Customize လုပ်ဖို့အတွက်ပဲဖြစ်ပါတယ်။ အရင် [Hyper + Git Terminal Windows 10]({{< ref "hyper-git-terminal-windows-10.md" >}} "Hyper + Git Terminal Windows 10") လေးရေးခဲ့ပြီးသားဆိုတော့ ဆက်သွားလိုက်ကြတာပေါ့။

<!--more-->

အရင်ဆုံး Customize လုပ်ဖို့အတွက်ဆိုရင်တော့ လိုအပ်တဲ့ Plugins လေးတွေ သွင်းထားဖို့လိုအပ်ပါတယ်။ ဒါကြောင့်လည်း တစ်ခုပြီးတစ်ခုကို install လုပ်သွားဖို့လိုတာပေါ့။ Theme တွေကတော့ ကြိုက်ရာကို သွင်းနိုင်ပြီးတော့ [Hyper Themes](https://hyper.is/themes) မှာ သွားရှာနိုင်ပါတယ်။ ၄ ခုထဲ Display ပြထားပေမယ့်လို့ <kbd>Features</kbd> <kbd>Newest</kbd> ဆိုတာလေးမှာ <kbd>Newest</kbd> ကိုရွေးလိုက်ရင်တော့ အကုန်လုံး မြင်ရပါလိမ့်မယ်။ အောက်က Commands တွေကို တစ်ကြောင်းချင်းကူးထည့်လိုက်ပါ။

```cmd
hyper install hyperborder
hyper install hyper-opacity
hyper install hyper-tab-icons
hyper install hyper-search
hyper install hyperpower
```

- hyperborder - Hyper Terminal ကို ဘောင်လေးအတွက်ပါ
- hyper-opacity - နောက်ခံကြီးကိုဖျောက်လိုက်ဖို့အတွက်ပါ Terminal ကို opacity ထားလိုက်တဲ့သဘောမျိုးပေါ့။
- hyper-tab-icons - Hyper Terminal မှာ Tab တွေအတွက် Icon လေးတွေပေါ်နေအောင်ပါ။
- hyper-search - ကတော့ Terminal အတွက် Search Function အတွက်ပါ။
- hyperpower - Style/ Design အတွက် အဆင်ပြေအောင်ပါ။

ပြီးသွားရင်တော့ C:\Users\Username အောက်က .bash ကို အဆင်ပြေတဲ့ Text Editor နဲ့ဖွင့်လိုက်ပါ။ အခုလောလောဆယ် ကျွန်တော်က VS Code သုံးထားတဲ့အတွက်ကြောင့် VS Code နဲ့ပဲ ဖွင့်လိုက်ပြီး အောက်က Code တွေ အကုန်ကူးထည့်ထားလိုက်ပါတယ်။

<script src="https://gist.github.com/h2kyaw/3b71327ffe9af153dbdc3669349f9cef.js"></script>

ပြီးသွားရင်တော့ Terminal ကို Reload or Full Reload ဖြစ်ဖြစ် ပိတ်ပြီးဖွင့်လိုက်ရင်တော့ လှတယ်လို့ ထင်ရတဲ့ ကျွန်တော် သဘောကျတဲ့ Terminal ကိုရသွားပြီပဲဖြစ်ပါတယ်။

![Hyper Terminal ><](/images/hyper-terminal-windows-10.png 'Hyper Terminal')
