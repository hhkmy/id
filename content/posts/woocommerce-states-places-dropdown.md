+++
author = 'heinhtetkyaw'
date = "2021-02-03T20:05:29+06:30"
title = "Woocommerce States Places Dropdown"
description = "Wordpress ရဲ့ Sates တွေ နေရာတွေ ကို Dropdown လုပ်ဖို့ ရှာနေတဲ့လူတွေအတွက် အဆင်ပြေမှာအမှန်ပါပဲ"
image = "/images/woocommerce-states-places-dropdown.gif"
thumbnail_image = "/images/woocommerce-states-places-dropdown.gif"
tags = [
    "wordpress",
    "woocommerce",
]
categories = [
    "Wordpress",
    "Woocommerce",
]
series = ["Woocommerce"]
aliases = ["wordpress-collection"]
backtotop = "true"
+++

ဒီရက်ပိုင်း လုပ်ဖြစ်တဲ့အလုပ်တွေထဲက တစ်ခုလို့ပြောလို့ရတဲ့ ecommerce CMS တွေထဲကမှ တစ်ခုဖြစ်တဲ့ Woocommerce နဲ့ပတ်သက်တာကို စမ်းနေရင်းနဲ့ Website တစ်ခုတွေ့ပြီးကတည်းက လိုချင်နေခဲ့တာ ကြာခဲ့ပါပြီ။ ဒီနေ့တော့ ကိုယ်တိုင်လိုက်ရှာရင်း တွေ့တော့တွေ့တယ်မြန်မာနိုင်ငံအတွက် မရှိသေးတာနဲ့ နည်းနည်းအပင်ပန်းခံပြီးလုပ်ဖြစ်ခဲ့တာလေးကို အသေးစိတ်ဘယ်လို အသုံးပြုရမလဲဆိုတာကို ပြန်ရှင်းပြပေးမှာပဲဖြစ်ပါတယ်။

<!--more-->

ဒီရက်ပိုင်း အတော်အားနေတာနဲ့ပဲ ကိုယ်ပိုင်ရေးချင်တာရေးဖို့အတွက် [Personal Website is Up Again]({{< ref "personal-website-is-up-again.md" >}} "Personal Website is Up Again") ဆိုပြီးတောင် အစချီပြီး လုပ်ဖြစ်ခဲ့ပါသေးတယ်။ ဒီလိုတွေထဲမှာမှ နောက်အားနေတာနဲ့ပဲ Wordpress နဲ့ eCommerce လေး အစမ်းလုပ်ရင်းနဲ့ သဘောကျတာလေးတွေရှိတာနဲ့ ရှာရင်းရှာရင်း လိုချင်တာလေးကို ရခဲ့တယ်။ မြန်မာနိုင်ငံအတွက် မပါသေးတာနဲ့ဘာသာပြန် ပြည်နယ်နဲ့တိုင်းတွေထည့်ပြီး မြန်မာနိုင်ငံအတွက် သီးသန့် Custom Plugin တစ်ခုကိုတောင် ဖန်တီးခဲ့မိပါသေးတယ်။ ဆိုတော့ စမ်းခဲ့တဲ့အတိုင်းမှာ ဘယ်လိုအဆင်ပြေခဲ့တာလဲဆိုတာကိုတော့ နည်းနည်းလေး ရေးချင်စိတ်ရှိတာနဲ့ ချရေးပြီး မှတ်သားမျှဝေပါအုံးမးယ်။

အရင်ဦးဆုံးလုပ်ခဲ့တာကတော့ Local Wordpress Site လေးတစ်ခုကို တည်ဆောက်ပါတယ်။ Local Site လုပ်ရတာကလဲ အင်တာနက်လိုင်းမကောင်းတာရော Internet မရတဲ့အချိန်မှာပါ အလုပ်လုပ်ဖို့ အဆင်ပြေအောင်ပါ local [WampServer](https://www.wampserver.com/en/) လေးနဲ့ စပြီးရေးဖြစ်ခဲ့လေသည်နဲ့စရမယ်ထင်တယ်။ အစကတော့ ဟိုလုပ်ဒီလုပ်ပဲ Down ထားပေမယ့် နောက်ပိုင်း [Woocommerce](/categories/woocommerce) လေးစမ်းချင်တာနဲ့ပဲ Local မှာ Store တစ်ခုကိုစမ်းဖြစ်ခဲ့ရင်း နည်းနည်းလေး Tip and Trick လေးတွေလဲရေးချင် ကိုယ်လုပ်ထားတာလေးကို မျှပေးချင်တာနဲ့ ဒီ Post ကို ရေးဖို့အတွက် စိတ်ကူးမိသွားခြင်းလို့ဆိုရမယ် 😂

Wordpress ကလဲ Offline လုပ်ပြီးသွားပြီ Theme လဲရှာပြီးသွားပြီ Plugins တွေလဲ သွင်းပြီးသွားပြီဆိုတော့ လုပ်ရမယ့် အဆင့်တွေကိုပဲ လိုတိုရှင်း ရေးလိုက်တော့မယ်။

Requirement in this Post.

- [Wordpress](https://wordpress.org)
- Theme (Search Yourself)
- Woocommerce Checkout Form Editor
- [**Myanmar States, Cities, and Places for WooCommerce**](https://github.com/h2kyaw/myanmar-states-and-cities-for-woocommerce/releases/tag/v9.0) ([Main Source](https://wordpress.org/plugins/states-cities-and-places-for-woocommerce/))

ဆိုပြီးလိုအပ်မှာပဲဖြစ်ပါတယ်။ Checkout Form Editor ကို အသုံးပြုရတဲ့ ရည်ရွယ်ချက်ကတော့ အချို့မလိုအပ်တဲ့ Field တွေကို ဖျောက်ဖို့ Require တွေကို ဖြုတ်ဖို့နဲ့ မြန်မာလို ထည့်ချင်ရင် ထည့်လို့ရအောင်အတွက်ပါပဲ။ Field တွေကို ဖျောက်ချင်ရင်တော့ function.php ထဲမှာ Function variable တွေနဲ့ ဖျောက်လို့ရပါတယ်။ ဆိုတော့ လုပ်စရာရှိတာလေးကိုလုပ်လိုက်ကြတာပေါ့။

အရင်ဆုံး Woocommer Theme Install ပြီးသွားရင် Theme မှာလိုအပ်တဲ့ Plugin တွေကို သွင်းပါလိမ့်မယ်။ Slider, Framework, Woocommerce အစရှိသဖြင့်ပေါ့ လိုအပ်တာတွေကိုသွင်းပြီးသွားရင်တော့ Woocommerce Checkout Form Editor ကို Plugin ထဲမှာ ရှာပြီးသွင်းဖို့တော့လိုအပ်ပါတယ်။ အကုန်ပြည့်စုံသွားပြီဆိုရင်တော့ Woocommerce Checkout Form Editor ကိုဝင်ပြီး

- billing_last_name
- billing_address_2
- billing_postcode
- shipping_last_name
- shipping_address_2
- shipping_postcode

တွေကို Select လုပ်ပြီး Disable လုပ်ပေးလိုက်ပါ။ မြန်မာနိုင်ငံမှာကတော့ Full Name ကိုအသုံးပြုပြီး Last Name မသုံးတဲ့အတွက်ကြောင့် Disable လုပ်တာပါ အကယ်လို့သာ ထည့်ချင်ရင်တော့ မဖြုတ်လဲ ကိစ္စမရှိပါဘူး။ အခြားသော address_2 ကတော့ လိပ်စာကို၊ ပြည်နယ်နှင့်တိုင်းဒေသကြီး တွေထဲမှာမှ မြို့နယ်တွေကိုထည့်ပေးထားတဲ့အတွက် အိမ်အမှတ်၊ လမ်းနံပါတ် စတဲ့ အရှည်ကြီးရေးဖို့မလိုဘူးထင်လို့ဖြုတ်ခိုင်းရတာပါပဲ။ postcode ကတော့ ထည့်လဲ ကိစ္စမရှိပေမယ့် မြန်မာနိုင်ငံမှာတော့ postcode နဲ့ အရမ်းကြီး တွင်တွင်ကျယ်ကျယ် မဖြစ်သေးဘူးထင်လို့ ဖြုတ်သုံးတာပါ။(မတွင်ကျယ်ချက်ကတော့ Google Map က Verify Letter တောင် ၅ နှစ်ကျော်အထိ အကြောင်းမကြားရ ဘာရနဲ့) ဆိုတော့ လိုအပ်တာတွေကိုတော့ လုပ်ပြီးသလောက် လုပ်ပြီးပြီပဲဖြစ်ပါတယ်။ နောက်ဆုံးမင်းသား Plugin ဖြစ်တဲ့ **Myanmar States, Cities, and Places for WooCommerce** ကိုဒေါင်းပြီး Plugin ထဲမှာ Manual Install လုပ်လိုက်ပါ။ သူများ code ကို မြန်မာနိုင်ငံအတွက် အဆင်ပြေအောင် Modify ပြန်လုပ်ထားတာဖြစ်တဲ့အတွက်ကြောင့်မလို့ Main Wordpress Plugin Source မှာတော့ မတင်တော့ပါဘူး။ ဆိုတော့ ဒီလောက်ဆိုရင် ကျွန်တော်တို့ လုပ်စရာရှိတာတွေကို စလုပ်လို့ရပါပြီ။

နောက်တစ်ဆင့်အနေနဲ့ကတော့ **Wordpress Dashboard** ထဲက **Woocommerce Settings** ကိုသွားလိုက်ပါ။ ပြီးရင်တော့ **Selling location(s)** နဲ့ **Ship to specific countries** မှာ **Sell/Ship to specific countries** လို့ရွေးပြီး **Sell/Ship to specific countries** မှာ **Myanmar** ဆိုတာကိုရွေးပေးဖို့တော့လိုအပ်ပါတယ်။ ဘာကြောင့်လဲဆို Customer က မြန်မာနိုင်ငံ Only ကို ရောင်းချဖို့အတွက် Target လုပ်ထားလို့ပဲဖြစ်ပါတယ်။ International ကို Distribution လုပ်နေတာဆိုရင်တော့ ရွေးစရာမလိုအပ်သလို မူရင်း Main Source ကိုသာ Install လုပ်သင့်ပါကြောင်းကို ပြောချင်ပါတယ်။ ဆိုတော့လိုအပ်တာတွေကလဲ လုပ်ပြီးသွားပြီဆိုရင်တော့ css အနည်းငယ် ပြင်ဖို့ကျန်ပါသေးတယ်။ ဒါကလဲ theme အပေါ်မူတည်ပေမယ့် တော်တော်များများသော Theme တွေက တူကောင်းတူနိုင်ပါတယ်။ **Woocommerce Settings** ထဲမှာ မြန်မာနိုင်ငံတစ်နိုင်ငံတည်းကိုပဲရောင်းမယ်လုပ်ထားတဲ့အတွက် Woocommerce Checkout Page မှာ Country Dropdown က **Myanmar** ဆိုပြီး ဖြစ်နေပြီးရွေးမရမယ့်အတူတူတော့ ကျွန်တော်တို့ ဖျောက်လိုက်တာပိုအဆင်ပြေမယ်လဲထင်မိတာလဲပါတာပေါ့။ 😁

အောက်က css code တွေကိုတော့ **Wordpress Dashboard** > **Appearance** > **Theme Editor** ရဲ့ အောက်ဆုံးအကြောင်းမှာ ကူးထည့်လိုက်တာ ပိုအဆင်ပြေပါတယ်။

```css
#shipping_country_field,
#billing_country_field,
#calc_shipping_country_field,
#calc_shipping_postcode_field {
  display: none !important;
}
```

ကူးထည့်ပြီးရင်တော့ **Save** လုပ်လိုက်ပြီး Website ကို Refresh လုပ်လိုက်ရင် Cache မငြိရင် Webpage Refresh နောက်တစ်ဆင့်မှာ ပြောင်းလဲမှု အနေနဲ့ Country Selection မရှိတော့တာကို မြင်ရမှာပဲဖြစ်ပါတယ်။

ပြောခဲ့တဲ့ Step အားလုံးကို လုပ်ခဲ့ပြီးပြီဆိုရင်တော့ ကျွန်တော်တို့အောက်ကအတိုင်း မြင်တွေ့ရမှာပဲဖြစ်ပါတယ်။

![tates, Cities, and Places Dropdown for WooCommerce](/images/woocommerce-states-places-dropdown.gif)

နောက်တစ်အဆင့်အနေနဲ့ကတော့ သက်ဆိုင်ရာ တိုင်းဒေသကြီးအလိုက် ပို့ဆောင်ခတွေကို တွက်ချက်တဲ့ နည်းလမ်းပဲဖြစ်ပါတယ်။ အဲ့ဒါကိုတော့ အခုလောလောဆယ် စမ်းနေတုန်းဖြစ်တဲ့အတွက် နောက်ထပ် Post တစ်ခုနဲ့ မြဝတီလို သင့်အတွက်မနက်ဖြန်အနေနဲ့ အစမ်းလေးပြပြီး မျှော်ခိုင်းလိုက်ပြီပဲ ဖြစ်ပါတယ်။

အကယ်လို့ နားမလည်ခဲ့သည်များရှိရင် Comment မှာလဲ ဝင်ရောက်မေးမြန်းနိုင်ပါတယ်။ 😁 အားလုံးကိုတော့ အဆင်ပြေကြမယ်လို့ မျှော်လင့်မိပါတယ်။ :P
