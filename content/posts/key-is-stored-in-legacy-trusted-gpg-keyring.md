---
title: "Key ကို Legacy Trusted.gpg Keyring မှာ သိမ်းထားခြင်း"
date: 2025-08-01T09:14:21+06:30
author: heinhtetkyaw
image: images/key-is-stored-in-legacy-trusted-gpg-keyring.png
thumbnail_image: images/key-is-stored-in-legacy-trusted-gpg-keyring.png
description: "Debian အခြေပြုစနစ်များတွင် legacy trusted.gpg keyring တွင် key သိမ်းထားခြင်းအကြောင်းသတိပေးချက်ကို ဖြေရှင်းနည်း။"
summary: "Legacy trusted.gpg keyring မှ GPG key များကို အသုံးပြုရန်အကြံပြုထားသော keyring format သို့ ပြောင်းရွှေ့နည်းလမ်းညွှန်။"
tags: ["apt", "gpg", "trusted.gpg", "debian", "ubuntu"]
series: []
keywords: ["trusted.gpg", "apt-key", "keyring migration", "linux security", "debian", "ubuntu"]
slug: key-is-stored-in-legacy-trusted-gpg-keyring
---
Debian, Ubuntu နဲ့ သူတို့ရဲ့ ဆင်းသက်စနစ်တွေလို Debian အခြေပြုစနစ်တွေမှာ software repository တွေကို စီမံခန့်ခွဲတဲ့အခါမှာ အောက်ပါအတိုင်း သတိပေးချက်တစ်ခုကို တွေ့နိုင်ပါတယ်-

```
Warning: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
```

ဒီသတိပေးချက်က repository signing key တချို့ဟာ trusted.gpg keyring အဟောင်းထဲမှာရှိနေတယ်ဆိုတာကို ပြောပါတယ်။ ယနေ့အချိန်မှာတော့ key တစ်ခုချင်းစီကို `/etc/apt/trusted.gpg.d/` ထဲမှာ သီးသန့်ဖိုင်အနေနဲ့ သိမ်းထားဖို့ အကြံပြုပါတယ်။ ဒါကလည်း လုံခြုံရေးနဲ့ စီမံခန့်ခွဲမှုပိုကောင်းစေပါတယ်။

## Important Note

APT က GPG key တွေကို အသုံးပြုပြီး repository မှ packages တွေရဲ့ တရားဝင်မှုနဲ့ တည်ငြိမ်မှုကို စစ်ဆေးပါတယ်။ Key တွေကို တစ်ဖိုင်ထဲ (trusted.gpg) မှာ သိမ်းထားတာက စီမံခန့်ခွဲရခက်စေပြီး လုံခြုံရေးနည်းစေပါတယ်။ အသစ်အနေနဲ့ key တစ်ခုချင်းစီကို သီးသန့်ဖိုင်အနေနဲ့ သိမ်းထားခြင်းက စစ်ဆေးခြင်း၊ ပြင်ဆင်ခြင်း၊ ဖယ်ရှားခြင်းတွေကို ပိုလွယ်ကူစေပါတယ်။ သဘောကတော့ ဖိုင်တွဲအရှည်ကြီး ဖတ်ရတဲ့အစား ဖိုင်တွဲသေးသေးလေးတွေ သက်ဆိုင်တဲ့အကြောင်းလေးတွေကိုပဲ သိမ်းထားလိုက်တာ ပိုကောင်းတာပေါ့။

## Understanding the Warning

`apt update` ကဲ့သို့သော command များ run လုပ်တဲ့အခါ legacy keyring ထဲမှာ key တွေရှိနေတယ်ဆိုရင် ဒီသတိပေးချက်ကို တွေ့ရပါလိမ့်မယ်။ ဒါက ချက်ချင်းစနစ်ပျက်သွားမှာ မဟုတ်ပေမယ့် key တွေကို အသစ် format သို့ ပြောင်းရွှေ့ဖို့ လိုအပ်နေပြီဆိုတာကို ပြောထားတာပဲဖြစ်ပါတယ်။

## Finding Legacy Keys

Legacy keyring ထဲမှာရှိတဲ့ key တွေကို ကြည့်ရန်-

```sh
sudo apt-key list
```

`/etc/apt/trusted.gpg` အောက်မှာရှိတဲ့ key တွေကို ပြောင်းရွှေ့ဖို့ လိုပါတယ်။

## Understanding Keys Shown in apt-key list

`apt-key list` နဲ့ကြည့်မယ်ဆိုရင် သင့်စနစ်မှာ Trsuted ဖြစ်ထားတဲ့ GPG key တွေကို ပြသပေးပါတယ်။ ဥပမာအနေနဲ့:

- **Keybase.io Key**
  - `/etc/apt/trusted.gpg` ထဲမှာရှိတယ်
  - Key ID: `47484E50656D16C7`
  - RSA 4096, 2013-11-19 မှ စတင်သက်တမ်း, 2027-11-11 မှာ သက်တမ်းကုန်မယ်
  - Keybase.io Code Signing (v1) အတွက် သီးသန့် third-party key တစ်ခု

- **Debian Keys**
  - `/etc/apt/trusted.gpg.d/` ထဲမှာရှိတဲ့ key တွေကတော့ Debian ၏ release, security, stable အတွက် အသုံးပြုတဲ့ official key တွေပါ

**သတိပြုရန်**  
- `apt-key` ကို မသုံးတော့ပါနှင့်။ Key အသစ်ထည့်မယ်ဆိုရင် `/etc/apt/trusted.gpg.d/` ထဲသို့ binary format (gpg --dearmour) နဲ့ ထည့်သင့်တယ်။
- သို့မဟုတ်, repository .list ဖိုင်ထဲမှာ `signed-by=/etc/apt/trusted.gpg.d/keybase.gpg` ဆိုပြီး သီးသန့်သတ်မှတ်နိုင်တယ်။

**Keybase.io key ကို modernize လုပ်ချင်ရင်**  
```sh
sudo apt-key export 47484E50656D16C7 | gpg --dearmour | sudo tee /etc/apt/trusted.gpg.d/keybase.gpg > /dev/null
```
ပြီးရင် (လိုအပ်လျှင်) trusted.gpg ထဲကနေ ဖယ်ရှားနိုင်ပါတယ်။

## Migrating Keys to the New Keyring Format

၁။ **Legacy Keyring မှ Key ကို Export လုပ်ပါ**

ပြောင်းရွှေ့လိုတဲ့ key ID (ဥပမာ- `ABC12345`) ကို ရှာပြီး export လုပ်ပါ-

Bash အတွက် (သို့မဟုတ် sh)

```sh
sudo apt-key export ABC12345 > /etc/apt/trusted.gpg.d/ABC12345.gpg
```

Zsh အတွက် (zsh မှာ direct redirect ကို permission denied ဖြစ်နိုင်သဖြင့် tee သုံးပါ)

```sh
sudo apt-key export ABC12345 | sudo tee /etc/apt/trusted.gpg.d/ABC12345.gpg > /dev/null
```

၂။ **Legacy Keyring မှ Key ကို ဖယ်ရှားပါ**

```sh
sudo apt-key del ABC12345
```

၃။ **ပြောင်းရွှေ့မှုကို စစ်ဆေးပါ**

`sudo apt update` ကို ထပ်မံ run လုပ်ပါ။ ပြောင်းရွှေ့ပြီးတဲ့ key အတွက် သတိပေးချက် မပေါ်တော့ပါဘူး။

**မှတ်ချက်**: `/etc/apt/trusted.gpg.d/` ထဲတွင် `.asc` သို့မဟုတ် `.gpg` extension ဖြင့် key ဖိုင်အသစ်တွေ့ရပါက၊ အဲဒီ key များသည် အသစ်သော keyring format ကို အသုံးပြုနေပြီး ဖြစ်ပါသည်။ သတိပေးချက်ပေါ်နေသေးလျှင် legacy key များကို အထက်ပါအဆင့်များအတိုင်း ပြောင်းရွှေ့ပါ။

## Automating the Migration

Key များစွာရှိပါက အောက်ပါ script ဖြင့် အလိုအလျောက် ပြောင်းရွှေ့နိုင်သည်-

```sh
sudo apt-key list | grep -E '^pub' | awk '{print $2}' | cut -d'/' -f2 | while read keyid; do
  sudo apt-key export "$keyid" | sudo tee "/etc/apt/trusted.gpg.d/$keyid.gpg" > /dev/null
  sudo apt-key del "$keyid"
done
```

## Best Practices

- ပြောင်းလဲမှုလုပ်မီ keyring များကို backup ယူထားပါ။
- အသစ် key ထည့်ရာတွင် `apt-key` ကို မသုံးတော့ပါနှင့်။ `gpg` သို့မဟုတ် key ကို တိုက်ရိုက် `/etc/apt/trusted.gpg.d/` ထဲသို့ download လုပ်ပါ။
- ယုံကြည်စိတ်ချရသော key များသာရှိစေရန် သင့် key များကို မကြာခဏ စစ်ဆေးပါ။

## ပြဿနာများနှင့် ဖြေရှင်းနည်း (Troubleshooting)

### unsupported filetype / NO_PUBKEY error

Key ကို export လုပ်ပြီး trusted.gpg.d ထဲသို့ထည့်တဲ့အခါ “unsupported filetype” သို့မဟုတ် NO_PUBKEY error တွေ့ရင်၊ key file ကို binary format (dearmoured) နဲ့ ထည့်ရန်လိုအပ်ပါတယ်။

```sh
sudo apt-key export KEYID | gpg --dearmour | sudo tee /etc/apt/trusted.gpg.d/KEYID.gpg > /dev/null
```
ဥပမာ-
```sh
sudo apt-key export 47484E50656D16C7 | gpg --dearmour | sudo tee /etc/apt/trusted.gpg.d/keybase.gpg > /dev/null
```
ပြီးရင် `sudo apt update` ပြန် run လုပ်ပါ။

### apt-key Deprecation

`apt-key` ကို Debian/Ubuntu မှာ မကြာခဏသုံးနေကြပေမယ့်၊ ယခုအခါ deprecated ဖြစ်ပြီး မကြာမီ release တွေမှာ ဖယ်ရှားသွားမယ်။ အနာဂတ်မှာ key ထည့်ရာမှာ gpg --dearmour နဲ့ binary format သို့မဟုတ် `signed-by` option ကို အသုံးပြုသင့်တယ်။

## Conclusion

Legacy `trusted.gpg` keyring မှ အသုံးပြုရန်အကြံပြုထားသော keyring format သို့ GPG key များကို ပြောင်းရွှေ့ခြင်းသည် သင့်စနစ်၏ လုံခြုံရေးနှင့် စီမံခန့်ခွဲမှုကို တိုးတက်စေပါသည်။ အထက်ပါအဆင့်များအတိုင်း လုပ်ဆောင်ခြင်းဖြင့် သတိပေးချက်ကို ဖြေရှင်းနိုင်ပြီး လက်ရှိအကြံပြုချက်များနှင့် ကိုက်ညီစေပါသည်။