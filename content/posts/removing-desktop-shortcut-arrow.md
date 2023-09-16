+++
author = 'heinhtetkyaw'
title = "Removing Desktop Shortcut Arrow"
date = 2023-08-21T01:15:41+07:00
categories = ["Windows", "Tips & Tricks"]
tags = ["Windows", "Tips & Tricks"]
image = "/images/BlankShortcut.png"
thumbnail_image = "/images/BlankShortcut.png"
backtotop = true
description = "ကွန်ပျူတာမှာမြင်မြင်ကြ Shortcut Arrow လေးတွေက ကြည့်ပါများတော့ မျက်စိနောက်လာပြီ"
+++

ကွန်ပျူတာမှာမြင်နေကြ Desktop icon ပေါ်က shortcut arrow လေးက မျက်စိနောက်တာမဟုတ်ပေမယ့် ဖျောက်ထားချင်ကြတဲ့ ကျွန်တော့လိုလူတွေအတွက်လိုက်ရှာရင်း Error တက်ရင်းနဲ့ပဲ ဒါလေးကို မှတ်ထားချင်လာတော့တယ်။

<!--more-->

အရင်ဆုံး shell32.dll ကိုသုံးတဲ့နည်းရှိပေမယ့် အဲ့ဒီနည်းက သိပ်အဆင်မပြေတာနဲ့ နောက်တစ်နည်းကို ထပ်ရှာမိတော့တယ်။

အရင် ဦးဆုံးလုပ်ရမှာကတော့ <kdb>Window Key + R</kdb> ကိုနှိပ်ပြီး **regedit** လို့ရိုက်ပြီး **OK** ကိုနှိပ်ပေးရပါမယ်။ မဟုတ်ရင်တော့ <kdb>Window Key</kdb> ကိုနှိပ်ပြီး **regedit** လို့ရိုက်လိုက်ရင်လည်း အတူတူပါပဲ။ သူက Permission တောင်းရင်တော့ Yes ကိုရွေးပြီးတော့ ဖွင့်လိုက်ပါ။

ပွင့်လာတဲ့ Regedit Window ကနေပြီးတော့။

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer
```

အထိ အဆင့်ဆင့်သွားလိုက်ပါ။ ရောက်ပြီဆိုရင်တော့ **Explorer** ပေါ်ကို Right Click နှိပ်ပြီး **New > Key** ကိုနှိပ်လိုက်ပါ။ **New Key #1** အစား **Shell Icons** လို့ပေးလိုက်ပါ။ ဒါဆိုရင်တော့ ညာဘက်အကွက်ထဲမှာ တစ်ခါ။ Right Click ကိုနှိပ်ပြီး **New > String Value** ကိုနှိပ်လိုက်ပါ။ **New Value #1 အစား 29** လို့ပေးလိုက်ပါ။ ပြီးရင်တော့ 29 ကို Double Click နှိပ်ပြီးတော့။

```
%windir%\System32\shell32.dll,-50
```

![Edit String ><](/images/Edit-String.png)

ပုံပါအတိုင်းလေးကူးထည့်ပြီး Ok ကိုနှိပ်လိုက်ပြီး။

**Task Manager > File Explore > Right Click > Restart** ဆိုရင်တော့ Shortcut Arrow လေးတွေ ပျောက်သွားပြီပဲဖြစ်ပါတယ်။

အကယ်လို့သာ ဒီနည်းလမ်းက Error တက်ခဲ့မယ်ဆိုရင်တော့ နောက်ထပ် တစ်နည်းကတော့

```
%windir%\System32\shell32.dll,-50
```

အစား။ Blank.ico file နဲ့အစားထိုးလိုက်တာပဲဖြစ်ပါတယ်။ အပေါ်က နည်းလမ်းက ဘာ Error ဖြစ်နိုင်သလဲဆိုရင်တော့ Shortcut arrow လေးနေရာမှာ black box လေးဖြစ်နေတာမျိုးဖြစ်နိုင်တဲ့အတွက် နောက်နည်းလမ်းနဲ့တော့ အဆင်ပြေသွားတဲ့အတွက် တစ်ခါထဲပဲ ရေးလက်စနဲ့ ဆက်ရေးရမယ်ဆိုရင်တော့။

အကုန်လုံး အပေါ်က နည်းအတိုင်းလေးပဲ လုပ်သွားရင်အဆင်ပြေပါတယ်။ လိုအပ်တာကတော့ Black.ico လေးပဲဖြစ်တဲ့အတွက်ကြောင့် Download လုပ်လိုက်ပါ့မယ်။

[Download Blank.ico](/files/Blank.ico.zip)

Download လုပ်ပြီးသွားရင်တော့။ Extract လုပ်ပြီး Folder တစ်ခုထဲကို သွားထားထားလိုက်ပါ။ ကျွန်တော်ကတော့ Document ထဲက Pictures ထဲမှာပဲ ထည့်ထားလိုက်တာဆိုတော့။ ကျွန်တော့ Location က

```
C:\Users\h2kyaw\OneDrive\Pictures\Blank.ico
```

ဆိုပြီးဖြစ်နေပါလိမ့်မယ်။ အဲ့ဒီ ရလာတဲ့ Location လေးကို ခုဏက အပေါ်က 29 ဆိုတဲ့ Value မှာပြန်ပြီး Double Click လုပ်ပြီး Edit လုပ်ပေးရပါ့မယ်။

![Edit String ><](/images/Edit-String-Blank.png)

Edit လုပ်ထားတဲ့အတိုင်းရပြီဆိုရင်တော့ အပေါ်ကလိုပဲ Task Manager ထဲကနေပြီး Restart လုပ်ပေးတာဖြစ်ဖြစ် Computer Restart ချပြီးတော့ ပြန်ပွင့်လာရင်ပဲဖြစ်ဖြစ် အဆင်ပြေသွားပြီပဲဖြစ်ပါတယ်။
