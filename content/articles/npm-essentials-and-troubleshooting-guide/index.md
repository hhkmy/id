---
title: "NPM အသုံးပြုနည်းနဲ့ ပြဿနာဖြေရှင်းနည်း လမ်းညွှန်"
date: 2026-09-14T02:58:00+06:30
image: npm-guide.jpg
thumbnail_image: npm-guide.jpg
description: "Node Package Manager (npm) ရဲ့ အခြေခံ သဘောတရားများ၊ Global Package တွေကို sudo မလိုဘဲ သွင်းနည်းနဲ့ audit fix ထောင်ချောက် ဖြေရှင်းနည်း လက်တွေ့လမ်းညွှန်။"
summary: "Node Package Manager (npm) ရဲ့ အခြေခံ သဘောတရားများ၊ Global Package တွေကို sudo မလိုဘဲ သွင်းနည်းနဲ့ audit fix ထောင်ချောက် ဖြေရှင်းနည်း လက်တွေ့လမ်းညွှန်။"
categories: ["Node.js", "Linux", "Troubleshooting"]
tags: ["npm", "Node.js", "Linux", "DevOps", "Package Manager", "Troubleshooting", "Debian"]
series: ["Developer Tools"]
keywords: ["npm guide burmese", "npm troubleshooting myanmar", "npm install -g permission denied", "npm audit fix force downgrade", "npm overrides package.json", "npmrc allow-scripts conflict", "node.js package manager"]
slug: "npm-essentials-and-troubleshooting-guide"
---

ဝဘ်ဆိုက်တွေ၊ Web Applications တွေ ဖန်တီးတဲ့အခါ ဒါမှမဟုတ် Hugo လို Static Site Generator တွေမှာ Tailwind CSS, Prettier, Mermaid စတာတွေနဲ့ တွဲဖက် အလုပ်လုပ်တဲ့အခါ Node.js နဲ့ **npm** ဆိုတာ မဖြစ်မနေ ထိတွေ့ရမယ့် Tool ကြီး တစ်ခုပါ။ 

ဒါပေမဲ့ စစချင်း လေ့လာတဲ့သူတွေတင် မဟုတ်ဘဲ Developer တော်တော်များများတောင် `sudo npm install -g` လုပ်မိလို့ File Permission တွေ ရှုပ်ကုန်တာ၊ `npm audit fix --force` နှိပ်လိုက်မိလို့ Version တွေ စောက်ထိုးကျပြီး ပိုဆိုးတဲ့ Vulnerability တွေ ထပ်ဝင်လာတာ၊ `.npmrc` နဲ့ `package.json` ကြားထဲ Script သတ်မှတ်ချက်တွေ ငြိပြီး Warning တွေ တက်လာတာမျိုးတွေ မကြာခဏ ကြုံရတတ်ပါတယ်။

ဒီဆောင်းပါးမှာတော့ npm ရဲ့ အခြေခံ အလုပ်လုပ်ပုံကနေစပြီး Global Package တွေကို System မပျက်စီးစေဘဲ သွင်းနည်းနဲ့ ကျွန်တော်တို့ နေ့စဉ် ကြုံရတဲ့ Dependency / Security ပြဿနာတွေကို လက်တွေ့ အရင်းအမြစ်ကနေ ဘယ်လို သန့်သန့်ရှင်းရှင်း ဖြေရှင်းမလဲဆိုတာကို အသေးစိတ် မျှဝေပေးသွားပါမယ်။

![NPM Guide and Troubleshooting](npm-guide.jpg)

---

## ၁။ npm ဆိုတာ ဘာလဲ? ဘယ်လို အလုပ်လုပ်သလဲ?

**npm** ဆိုတာ **Node Package Manager** ရဲ့ အတိုကောက်ဖြစ်ပြီး JavaScript / Node.js လောကမှာ အကြီးဆုံး Package Ecosystem ပါ။ သူ့မှာ အဓိက အစိတ်အပိုင်း ၃ ခု ရှိပါတယ် -

1. **Website / Registry:** ကမ္ဘာတစ်ဝန်းက Developer တွေ ရေးသားထားတဲ့ Open-source Library တွေ (ဥပမာ Tailwind CSS, Prettier, Mermaid, Pagefind) ကို Host လုပ်ပေးထားတဲ့ Cloud Database ကြီးပါ။
2. **CLI (Command Line Interface):** ကျွန်တော်တို့ Terminal ကနေ Package တွေကို Download ဆွဲတာ၊ Update လုပ်တာ၊ Script တွေ စီမံခန့်ခွဲတာတွေကို ခိုင်းစေတဲ့ Command Line Tool ပါ။
3. **Ecosystem & Dependency Tree:** ကိုယ့် Project ထဲက Tool တွေ တစ်ခုနဲ့တစ်ခု ချိတ်ဆက် အလုပ်လုပ်အောင် စီစဉ်ပေးတဲ့ စနစ်ပါ။

### Project တစ်ခုထဲက အဓိက ဖိုင်များ

* **`package.json`:** ကိုယ့် Project ရဲ့ သတ်မှတ်ချက် စာအုပ်ပါပဲ။ ဘယ် Library တွေ သုံးထားလဲ (`dependencies`), Development အတွက်ပဲ သီးသန့် သုံးတာလား (`devDependencies`), ဘာ Command တွေ Run လို့ရလဲ (`scripts`) ဆိုတာတွေကို ကြေညာပေးပါတယ်။
* **`package-lock.json`:** ကိုယ်သွင်းလိုက်တဲ့ Package တွေရဲ့ အတိအကျ Version နဲ့ Hash Code တွေကို Lock ခတ်ထားတဲ့ မှတ်တမ်းပါ။ နောက်တစ်ကြိမ် တခြားစက်မှာ ပြန်သွင်းတဲ့အခါ Version ကွဲလွဲမှု မရှိအောင် အာမခံပေးပါတယ်။
* **`node_modules/`:** npm ကနေ Download ဆွဲချလိုက်တဲ့ Third-party Code အကုန်လုံး စုစည်း သိမ်းဆည်းထားတဲ့ Folder ဖြစ်ပါတယ်။ ဒီ Folder ကို Git ထဲ ဘယ်တော့မှ Commit မလုပ်ရပါဘူး (`.gitignore` ထဲ ထည့်ရပါတယ်)။

---

## ၂။ Node.js နဲ့ npm ကို ဘယ်လို Install လုပ်သင့်သလဲ?

Linux (Debian / Ubuntu) မှာ အများစု မှားတတ်တဲ့ အချက်က `sudo apt install nodejs npm` ဆိုပြီး OS Default Repository ထဲကနေ တိုက်ရိုက် သွင်းလိုက်တာပါပဲ။ အဲဒီလို သွင်းရင် အလွန်ဟောင်းနွမ်းတဲ့ Version တွေ ရောက်လာတတ်သလို Global သွင်းတဲ့အခါ Permission Error တွေ တန်းတက်ပါတယ်။

အကောင်းဆုံး နည်းလမ်း ၂ ခု ရှိပါတယ် -

### နည်းလမ်း (က) - Node Version Manager (NVM / FNM) သုံးခြင်း (အကြံပြုလိုဆုံး)

NVM သုံးရင် Node.js နဲ့ npm ဟာ ကိုယ့် User Home Folder (`~/.nvm`) ထဲမှာပဲ သီးသန့် တည်ရှိတာကြောင့် Root Permission လုံးဝ မလိုသလို Version မျိုးစုံကိုလည်း စိတ်ကြိုက် အပြောင်းအလဲ လုပ်နိုင်ပါတယ်။

```bash
# NVM တပ်ဆင်ခြင်း
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Terminal ကို Restart လုပ်ပြီး Node.js LTS ဗားရှင်း သွင်းခြင်း
nvm install --lts
nvm use --lts
```

### နည်းလမ်း (ခ) - NodeSource Official Repository ကနေ သွင်းခြင်း

Production Server တွေမှာ NVM မသုံးချင်ရင် NodeSource ကနေ Node.js ဗားရှင်းအသစ်ကို တိုက်ရိုက် သွင်းနိုင်ပါတယ် -

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## ၃။ Global Package (`-g`) သွင်းရင် ကြုံရတဲ့ ပြဿနာနဲ့ အဖြေ

Terminal ကနေ `npm install -g <package>` ဆိုပြီး တစ်စက်လုံးမှာ သုံးရမယ့် Tool တွေ (ဥပမာ Wrangler, Pagefind, Lighthouse) သွင်းတဲ့အခါ အောက်ပါ Permission Error မျိုး တက်လာတတ်ပါတယ် -

```text
npm error code EACCES
npm error syscall mkdir
npm error path /usr/local/lib/node_modules
npm error errno -13
npm error Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

### ❌ ဘယ်တော့မှ မလုပ်သင့်တဲ့ အမှား - `sudo npm install -g`

အများစုက Error တက်တာနဲ့ `sudo npm install -g` ဆိုပြီး `sudo` ခံ ရိုက်တတ်ကြပါတယ်။ ဒါဟာ အလွန် အန္တရာယ်များတဲ့ အလေ့အကျင့်ပါ -
1. System Directory တွေရဲ့ Ownership တွေ ရှုပ်ကုန်ပြီး နောက်ပိုင်း `~/.npm` cache တွေပါ Root ဖြစ်သွားကာ သာမန် User အနေနဲ့ `npm install` လုပ်မရတော့တဲ့ အထိ ဖြစ်သွားနိုင်ပါတယ်။
2. Third-party Install scripts တွေထဲမှာ မသမာတဲ့ Code တွေ ပါလာရင် Root Privilege ရသွားနိုင်ပါတယ်။

### ✅ မှန်ကန်တဲ့ ဖြေရှင်းနည်း - Custom NPM Global Prefix သတ်မှတ်ခြင်း

System Node သုံးထားရင်တောင် ကိုယ့် User Folder အောက်မှာပဲ Global package တွေ သီးသန့် သိမ်းဆည်းအောင် သတ်မှတ်လိုက်တာ အသန့်ရှင်းဆုံးပါ -

```bash
# ၁။ User home အောက်မှာ folder ဆောက်ခြင်း
mkdir -p ~/.npm-global

# ၂။ npm ရဲ့ prefix အဖြစ် သတ်မှတ်ပေးခြင်း
npm config set prefix '~/.npm-global'

# ၃။ PATH ထဲကို ထည့်ပေးခြင်း (~/.zshrc သို့မဟုတ် ~/.bashrc တွင် ထည့်ပါ)
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

ဒီလို သတ်မှတ်ပြီးသွားရင် နောက်ပိုင်း `npm install -g <package>` ကို `sudo` လုံးဝ ခေါ်စရာ မလိုတော့ဘဲ ချောချောမောမော သွင်းယူနိုင်ပါပြီ။

---

## ၄။ လက်တွေ့မှာ ခေါင်းကိုက်ရတဲ့ npm ပြဿနာများနှင့် ဖြေရှင်းနည်းများ

အခု ကျွန်တော်တို့ Project ထဲမှာ ကြုံခဲ့ရတဲ့ ပြဿနာတွေ အပါအဝင် တကယ် အသုံးဝင်တဲ့ Troubleshooting နည်းလမ်းတွေကို စုစည်းဖော်ပြပေးလိုက်ပါတယ်။

### ပြဿနာ (၁) - `npm warn install-scripts .npmrc allow-scripts setting is being ignored`

ဒီ Warning က ဘာကြောင့် ပေါ်လာတာလဲဆိုတော့ စက်ထဲက Global `.npmrc` (ဥပမာ `~/.npmrc`) ထဲမှာ `allow-scripts = [...]` ဆိုတဲ့ Setting အဟောင်းတစ်ခု ကျန်နေပြီး၊ Project ရဲ့ `package.json` ထဲမှာတော့ npm v11 Standard အရ `allowScripts` field အသစ်ကို သုံးထားတဲ့အခါ npm က Conflict ဖြစ်ပြီး Warning ပေးတာပါ။

**စစ်ဆေးနည်း:**
```bash
npm config list
```

**ဖြေရှင်းနည်း:**
Global `.npmrc` ထဲက မလိုအပ်တဲ့ Conflict ဖြစ်နေတဲ့ ကောင်ကို ဖျက်ချလိုက်တာနဲ့ Warning လုံးဝ ပျောက်သွားပါတယ် -
```bash
npm config delete allow-scripts
```

---

### ပြဿနာ (၂) - `npm audit fix --force` ရဲ့ ထောင်ချောက် (The Downgrade Trap)

Project ထဲမှာ `npm audit` လုပ်တဲ့အခါ Vulnerability တွေ့ရင် အလွယ်တကူ `npm audit fix --force` နှိပ်လိုက်မိတတ်ကြပါတယ်။

**ဘာတွေ ဖြစ်သွားတတ်လဲဆိုတော့:**
* `sonarqube-scanner@5.0.0` သုံးထားတုန်းက သူ့ရဲ့ Sub-dependency ဖြစ်တဲ့ `adm-zip@0.6.0` မှာ အားနည်းချက် (GHSA-vwc7-r8mq-g2x9) ရှိနေခဲ့တယ်။
* `npm audit fix --force` နှိပ်လိုက်တဲ့အခါ npm က Breaking Changes တွေကို ဂရုမစိုက်တော့ဘဲ `sonarqube-scanner` ကို Major Version အဟောင်းကြီးဖြစ်တဲ့ `3.0.1` အထိ အတင်း ပြန်နှိမ့် (Downgrade) ချပစ်လိုက်တယ်။
* ရလဒ်အနေနဲ့ `sonarqube-scanner@3.0.1` မှာ ပါတဲ့ `decompress` ဆိုတဲ့ library ကနေတစ်ဆင့် **Critical Severity Vulnerability** အကြီးကြီး ထပ်တက်လာပါတယ်။
* နောက်တစ်ခါ `npm audit fix` ထပ်နှိပ်တော့ `3.5.0` ဖြစ်သွားပြီး `adm-zip` High Severity ၂ ခု ပြန်ပေါ်လာကာ Loop ပတ်နေရော။

**မှန်ကန်တဲ့ ဖြေရှင်းနည်း - `overrides` သုံးခြင်း:**
Upstream package က ဗားရှင်းအသစ် မထွက်သေးပေမယ့် သူ့အောက်က sub-dependency ကို အားနည်းချက် ပြင်ဆင်ပြီးသား ဗားရှင်း ပြောင်းချင်ရင် `package.json` ထဲမှာ `overrides` ထည့်ပေးရပါတယ် -

```json
  "overrides": {
    "adm-zip": "^0.6.1"
  }
```

ပြီးရင် `npm install` တစ်ချက် ပြန် run လိုက်တာနဲ့ `sonarqube-scanner@5.0.0` ကိုလည်း မထိခိုက်ဘဲ `adm-zip` က patched version `0.6.1` ကို ရောက်သွားပြီး **0 vulnerabilities** နဲ့ အသန့်ရှင်းဆုံး ပြီးသွားပါတယ်။

---

### ပြဿနာ (၃) - Node 24 Network IPv6 Timeout

Linux ပေါ်မှာ Node 24 သုံးတဲ့အခါ Undici Fetch / Registry ချိတ်ဆက်မှုတွေမှာ IPv6 DNS ကြောင့် `ETIMEDOUT` ဒါမှမဟုတ် `network timeout` တွေ မကြာခဏ ဖြစ်တတ်ပါတယ်။ 

အဲဒီလို ဖြစ်လာရင် IPv4 ကို ဦးစားပေးဖို့ Environment Variable ခံပြီး Run နိုင်ပါတယ် -

```bash
NODE_OPTIONS="--dns-result-order=ipv4first" npm install
```

---

### ပြဿနာ (၄) - `node_modules` ရှုပ်ထွေးသွားတဲ့အခါ အသစ်ကနေ ပြန်စတင်နည်း

Package တွေ ထပ်ခါတလဲလဲ သွင်းပြီး အချင်းချင်း ရောထွေးသွားရင် အောက်ပါအဆင့်အတိုင်း Clean Reinstall လုပ်နိုင်ပါတယ် -

```bash
# ၁။ Folder အဟောင်းကို ရှင်းထုတ်ခြင်း
rm -rf node_modules

# ၂။ သန့်ရှင်းစွာ ပြန်လည်သွင်းခြင်း
npm install
```

> **Tip (`npm install` vs `npm ci`):**
> * Development လုပ်နေချိန်နဲ့ Package အသစ်တွေ စမ်းသပ်ချိန်မှာ `npm install` ကို သုံးပါ။
> * Production Deployment (ဥပမာ Cloudflare, GitHub Actions, CI/CD) တွေမှာတော့ `package-lock.json` အတိုင်း တစ်သဝေမတိမ်း သွင်းပေးပြီး lockfile ကို ပြင်ဆင်ခွင့်မပြုတဲ့ `npm ci` ကို သုံးသင့်ပါတယ်။

---

## ၅။ အနှစ်ချုပ် အကြံပြုချက်

1. **`sudo` နဲ့ npm ကို ဘယ်တော့မှ မတွဲပါနဲ့:** Global packages တွေအတွက် User Prefix (`~/.npm-global`) သို့မဟုတ် NVM ကို သုံးပါ။
2. **`npm audit fix --force` ကို သတိထားပါ:** အဆင်မပြေရင် Version တွေ စောက်ထိုးကျပြီး ပိုဆိုးသွားတတ်ပါတယ်။ Nested dependency ပြဿနာဆိုရင် `package.json` ရဲ့ `overrides` ကို ဦးစားပေး သုံးပါ။
3. **`package-lock.json` ကို အမြဲတမ်း Git ထဲ Commit လုပ်ပါ:** ဒါမှ အဖွဲ့သားတွေ ဒါမှမဟုတ် CI/CD Build Server တွေပေါ်မှာ Version ကွဲလွဲမှု ကင်းရှင်းမှာ ဖြစ်ပါတယ်။
