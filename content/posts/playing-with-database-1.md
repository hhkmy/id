+++
author = 'heinhtetkyaw'
title = "Playing With Database - 1"
date = "2021-11-26T03:44:49+06:30"
image = "/images/runcloud_running_services.png"
thumbnail_image = "/images/runcloud_running_services.png"
description = "တွေ့ရကြုံရ ဖြေရှင်းရင်းနဲ့ ဖြစ်ခဲ့တဲ့ Database အတွေ့အကြုံများအကြောင်းထဲကမှ အကြောင်းအရာ နံပါတ် (၁)"
tags = ["Database"]
categories = ["Database"]
series = ["Database"]
backtotop = true
+++

အလုပ်လုပ်ရင်းနဲ့ တွေ့ကြုံဖြေရှင်းနေရတာနဲ့တင် Blog တောင်မရေးဖြစ်တာ တော်တော်လေးကို ကြာခဲ့ပါပြီ။ ဒီနေ့တော့ ရေးချင်တာရော နောက်ကြုံတွေ့ရရင် ပြန်ရှာလို့ရနိုင်ဖို့အတွက်ရော ရေးသားဖြစ်လိုက်ပါတော့တယ်။

<!--more-->

အခုလောလောဆယ်မှာတော့ Mybb ကို အသုံးပြုပြီး Forum တစ်ခုကို Develop လုပ်နေရင်းနဲ့မှ Database ထဲမှာ **Strict Mode** က Enable ဖြစ်နေတဲ့အတွက်ကြောင့် ရှာရင်း ဖွေရင်းနဲ့ တွေ့ရတဲ့ Solution လေးအကြောင်းကို မှတ်ထားချင်တာကြောင့် ဒီလိုလေးလုပ်ခဲ့ပါတယ်ပေါ့။

ကျွန်တော် အခုလောလောဆယ် Runcloud ကို သုံးနေတာဖြစ်တဲ့အတွက်ကြောင့် မတူညီတာတွေရှိကောင်းရှိနိုင်ပါတယ်။ အဓိကကတော့ သက်ဆိုင်ရာ နေရာအလိုက် ဘယ်လိုလုပ်ရမလဲ ဆိုတာကို အခြားတွေမှာပါ ထပ်ပြီးရှာဖွေစေချင်တာတော့ အမှန်ပါပဲ။ ကျွန်တော် လုပ်ခဲ့တာကိုတော့ အောက်မှာ အသေးစိတ်အဆင့်ဆင့်ရှင်းပြထားပါတယ်။

ပထမဆုံး ssh ကိုလှမ်းချိတ်လိုက်ပါတယ်။ **(Server ရယ်လို့ပြောပြီဆိုရင်တော့ ssh က မပါမဖြစ်နေရာမှာပါပြီပေါ့)** ချိတ်ပြီးရင်တော့ User အနေနဲ့ လုပ်လို့မရတာကြောင့် root user ကိုပြောင်းလိုက်ပါတော့တယ်။

```cmd
su -
```

command ရိုက်ပြီးရင်တော့ **Password:** ဆိုပြီးပေါ်နေရင်တော့ root password ကိုရိုက်ပေးရပါမယ်။ ပြောင်းပြီးသွားရင်တော့ php.ini file ထဲမှာမရှိတဲ့အတွက်ကြောင့် **mysql** folder ထဲကိုပြောင်းပြီး ဆက်လုပ်ရပါတယ်။

```cmd
cd /etc/mysql
```

အရင်ဆုံး my.cnf file ကို touch လုပ်မှာဖြစ်တဲ့အတွက်ကြောင့် Server နဲ့ပက်သက်ပြီး တစ်ခုခုလုပ်ရင် လွဲတတ်တာကြောင့် backup အရင်လုပ်ပါတယ်။ ဒါမှလဲ တစ်ခုခုဖြစ်သွားရင် ပြန်ယူလို့ရတာပေါ့။

```cmd
cp my.cnf my.cnf.b
```

အဲ့ဒီနောက်မှာတော့ my.cnf file ကို modify လုပ်ပါတော့မယ်။ nano ဖြစ်ဖြစ် vim ဖြစ်ဖြစ် သုံးလို့ရပေမယ့် ကျွန်တော်ကတော့ nano ကို သုံးလိုက်ပါတော့တယ်။

```cmd
nano my.cnf
```

ပွင့်လာတဲ့ my.cnf မှာပဲ Nano ရဲ့ command ဖြစ်တဲ့ <kbd>Ctrl</kbd> + <kbd>W</kbd> နဲ့ **sql_mode** ကိုရှာလိုက်ပါတော့တယ်။ ကျွန်တော်ပြင်ချင်တာကလဲ sql_mode ဖြစ်တဲ့အတွက်ကြောင့်ပါပဲ။ ဆိုတော့ တွေ့ပြီဆိုရင်တော့။ Default ရှိပြီးသား Line ရဲ့အောက်မှာ အသစ်လေးကို ထည့်ပေးလိုက်ပါတော့တယ်။ တစ်ခုခုဖြစ်တဲ့အခါ အသစ်ထည့်ထားတဲ့ Line ကို Remove လုပ်လိုက်ရင် ရတာဖြစ်တာကြောင့်ပါပဲ။ Server နဲ့ပက်သက်ပြီး error တက်သွားရင် အချိန်ပိုကုန်တာကြောင့် ကိုယ့်ဘက်က Safe Side ဖြစ်အောင်လုပ်ထားတာအကောင်းဆုံးပါပဲ။ အသစ်ထည့်လိုက်တာကတော့

```cmd
sql_mode                = ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

![Nano Search Result of sql_mode ><](/images/nano_sql_mode_search_result.png)

ဘာကြောင့်လဲဆိုတော့ ကျွန်တော့ mysql ထဲမှာရှိတဲ့ db_queries ကတော့

```
STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

ဖြစ်နေတဲ့အတွက် **STRICT_TRANS_TABLES** ကို Remove လိုက်တဲ့အတွက်ကြောင့်ပဲဖြစ်ပါတယ်။ အခြားဟာတွေကိုလဲ လိုအပ်သလို ထည့်လို့ရပြီး ဖြုတ်ချင်လဲ ဖြုတ်လို့ရပါတယ်။ အခုလောလောဆယ်မှာတော့ **STRICT_TRANS_TABLES** ကို ဖြုတ်ချင်တာဆိုတော့ **STRICT_TRANS_TABLES** လေးကိုပဲ ဖြုတ်ချလိုက်ပြီး Nano ကို Save ပြီး ပိတ်လိုက်ပါတော့တယ်။ အဲ့ဒီနောက်မှာတော့ Terminal ကနေ Smart ကျကျ Command ရိုက်ပြီးလုပ်မယ်ဟဲ့ဆိုပြီး လုပ်လိုက်ပေမယ့်လို့ အဆင်မပြေတဲ့အတွက်ကြောင့် **Runcloud** ရဲ့ GUI ကနေပဲ click click လေး လုပ်လိုက်ပါတော့တယ်။

![Runcloud Running Services ><](/images/runcloud_running_services.png)

MariaDB သုံးထားတာဖြစ်ပြီး **Runcloud** Doc ထဲမှာလဲ MariaDB အကြောင်းသိပ်မပါတာနဲ့ပဲ **Runcloud** GUI ရဲ့ Dashboard ထဲမှ Services ကိုသွားပြီး MariaDB ရဲ့ Option မှာ အထာကျကျပဲ **Restart** လုပ်လိုက်ပါတော့တယ်။ အခုဆိုရင်တော့ ssh ထဲကပဲဖြစ်ဖြစ် phpmyadmin ကဖြစ်ဖြစ် စစ်လိုက်ရင် **STRICT_TRANS_TABLES** ဆိုတာလေး မပါတော့ပါဘူး။ ဆိုတော့ အခုလောလောဆယ် ကြုံနေရတဲ့ **Strict Mode** Disable လုပ်တဲ့ဟာလေးက အဆင်ပြေသွားပြီပဲဖြစ်ပါတော့တယ်။ **STRICT_TRANS_TABLES** ကို စစ်ချင်ရင်တော့ Terminal မှဆိုရင်

```cmd
mysql -e "SELECT @@sql_mode;"
```

![Terminal mysql sql_mode ><](/images/terminal_mysql_sql_mode.png)

လို့ရိုက်ပြီး စစ်နိုင်မှာဖြစ်ပါတယ်။ အကယ်လို့သာ phpmyadmin ထဲမှ စစ်ချင်တယ်ဆိုရင်တော့။

```cmd
SHOW GLOBAL VARIABLES LIKE 'sql_mode';
SHOW SESSION VARIABLES LIKE 'sql_mode';
```

![phpmyadmin sql_mode ><](/images/phpmyadmin_sql_mode.png)

တို့ဖြင့် ကြိုက်နှစ်သက်သလို စစ်လို့ရမှာပါ။ **BOOM!**
