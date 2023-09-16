+++
author = 'heinhtetkyaw'
title = 'Hyper + Git Terminal Windows 10'
date = 2023-08-23T07:01:30+07:00
categories = ["Terminal", "Windows"]
tags = ["Terminal", "Windows"]
series = ["Tools"]
image = "/images/hyper-terminal-windows-10.png"
thumbnail_image = "/images/hyper-terminal-windows-10.png"
description = "Windows ပြန်တင်ပြီးတော့ Clean Installation တွေလုပ်လိုက်တော့ စိတ်ထဲ Command Prompt တစ်ခုကို ကောင်းကောင်းသုံးချင်လာတော့တယ်။"
backtotop = "true"
+++

Windows ပြန်တင်ပြီးတော့ Clean Installation တွေလုပ်လိုက်တော့ စိတ်ထဲ Command Prompt တစ်ခုကို ကောင်းကောင်းသုံးချင်လာတော့တယ်။ Customize လည်းလုပ်လို့ရ၊ Open Source သဘောမျိုးလည်းဖြစ်တာမျိုးရှာရင်းနဲ့ပဲ Hyper ကို တွေ့မိတော့တယ်။ အရင်ကတော့ cmder နဲ့ zsh ကိုသုံးပေမယ့် နောက်ပိုင်း အီလာတာနဲ့ အသစ်ရှာရင်း ဒီနေ့တော့ Hyper ကိုတွေ့တာနဲ့ နည်းနည်းလေး Customize ချင်လာတာနဲ့ပဲ ဒီ Content လေးတစ်ခုရသွားပါတော့တယ်ပေါ့။ အစောပိုင်း လောဘကြီးပြီးတော့ Content အရှည်ကြီးရေးချင်တာဆိုပေမယ့် content တွေခွဲပြီး Customize လှလှလေးပဲ လုပ်သွားတော့မယ်။

<!--more-->

Fresh installed ဖြစ်တဲ့အညီအကုန်လုံးကိုတော့ လုံးဝ အသေးစိတ်ပဲ ပြောပြပေးသွားပါတော့မယ်။ ပထမဦးဆုံး app ကို Download လုပ်ဖို့ဖြစ်တဲ့အတွက်ကြောင့် မူရင်း Website မှာပဲ Download သွားလုပ်လိုက်ပါ။

- [hyper.is](https://hyper.is/)
- [nodejs](https://nodejs.org/en/download/)
- [git bash](https://git-scm.com/downloads)

Download လုပ်ပြီးတော့ Installation တွေပြီးသွားရင်တော့ command line တွေကို မသိတဲ့အခါမျိုးရှိတတ်ပါတယ်၊ အဲ့ဒါအတွက်ကတော့ [Hyper's Github Installation Method](https://github.com/vercel/hyper) အတိုင်းပဲ လုပ်သွားရင် အဆင်ပြေပါတယ်။ အဲ့ဒါကတော့

```cmd
choco install hyper
```

ဆိုပြီး Powershell Administration ကနေပြီးတော့ Installation လုပ်သွားရမှာပဲဖြစ်ပါတယ်။ ပြီးရင်တော့

```cmd
npm install --global yarn
yarn global add windows-build-tools
```

နဲ့လိုအပ်တာတွေကို Installed လုပ်ထားဖို့လိုအပ်ပါလိမ့်မယ်။ Git Bash ကိုလည်း Installed လုပ်ပြီးသွားရင်တော့ Hyper Program ကိုဖွင့်ပြီး **Ctrl + ,** နဲ့ Configure file ကိုဖွင့်လိုက်ပါ။ ပြီးရင်တော့

```js
// - Example: `C:\\cygwin64\\bin\\bash.exe`
shell: '',
// for setting shell arguments (i.e. for using interactive shellArgs: `['-i']`)
// by default `['--login']` will be used
shellArgs: ['--login'],
// for environment variables
env: {},
```

အစား

```js
// if you're using powershell, make sure to remove the `--login` below
shell: "C:\\Program Files\\Git\\git-cmd.exe",

// for setting shell arguments (i.e. for using interactive shellArgs: ['-i'])
// by default ['--login'] will be used
shellArgs: ["--command=usr/bin/bash.exe", "-l", "-i"],

// for environment variables
env: { TERM: "cygwin" },

```

<script src="https://gist.github.com/coco-napky/404220405435b3d0373e37ec43e54a23.js"></script>

ကိုရှာပြီးတော့ ဆိုပြီးပြောင်းလိုက်ပါ။ configure အပြည့်ဆိုရင်တော့ အပေါ်ကလိုမျိုးဖြစ်သွားပါလိမ့်မယ်။

CMD ကို မသုံးတာဘာကြောင့်လဲဆိုတော့ Customize ကောင်းကောင်းလုပ်ဖို့အတွက်ဆိုရင်တော့ Windows Default Command Prompt က အရမ်းကြီး customize လို့မကောင်းပါပဲ၊

```text
Microsoft Windows [Version 10.0.19045.3324]
(c) Microsoft Corporation. All rights reserved.

C:\Users\UserName>
```

ဆိုပြီး ပြန်ပေါ်နေလို့ပါ။ အဲ့ဒါပြီးသွားရင်တော့ နည်းနည်းလေး ထပ်ပြီးလုပ်သင့်တာကတော့ _C:\Users\UserName_ အောက်မှာပဲ bashrc file လေး create လုပ်ပေးဖို့အတွက်ပါပဲ။ ဒါမှလည်း နောက်အရာတွေအတွက် Customize လုပ်ပြီး hyper ကို ကောင်းကောင်း customize လုပ်လို့ရမှာပါ။

```cmd
cd ~ && touch .bashrc
```

အပေါ်က နည်းအတိုင်း သေချာ Installed လုပ်ခဲ့ပြီးပြီဆိုရင်တော့ plugin တစ်ခုကို Install လုပ်ကြည့်လိုက်ပါ့မယ်။

```cmd
hyper i verminal
verminal installed successfully!
```

ဆိုရင်တော့ Hyper ကောင်းကောင်းအလုပ်လုပ်သွားပြီပဲဖြစ်ပါတယ်။ ပြီးရင်တော့ Hyper Terminal ထဲဝင်ပြီး Tools > View > Reload // Full Reload ကိုလုပ်လိုက်မယ်ဆိုရင်တော့ အပေါ်က သွင်းထားတဲ့ verminal theme ပြောင်းလဲသွားပြီပဲဖြစ်ပါတယ်။ Shortcut အနေနဲ့ကတော့ `Ctrl` <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> နဲ့ ရိုးရိုး Reload လုပ်လို့ရပြီး <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F5</kbd> ဆိုပြီး Full Reload လုပ်လို့ရပါပြီ။ ဒါဆိုရင်တော့ အောက်ကလို Theme Color လေးပြောင်းသွားရင်တော့ Success ဖြစ်သွားပြီပဲဖြစ်ပါတယ်။

![Hyper Verminal Theme](/images/hyper-verminal.png)

အားလုံးအဆင်ပြေသွားတဲ့အတွက် — enjoy your new terminal and Wait other Content for Customize ~ :clapping_hands:
