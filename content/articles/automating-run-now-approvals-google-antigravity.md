---
title: "Google Antigravity မှာ Terminal Command တွေအတွက် 'Run now' Auto Select / Always-Proceed ပြင်ဆင်နည်း"
date: 2026-09-11T20:00:00+06:30
image: images/antigravity-auto-run-now.webp
thumbnail_image: images/antigravity-auto-run-now.webp
description: "Google Antigravity နဲ့ Pair Programming လုပ်တဲ့အခါ Terminal Command တိုင်းမှာ 'Run now' Option ခဏခဏ ရွေးစရာမလိုဘဲ Auto-Proceed ဖြစ်အောင် ပြင်ဆင်ပြီး auto-run-now skill တည်ဆောက်ခဲ့တဲ့ လက်တွေ့မှတ်တမ်း။"
summary: "Antigravity 2.0၊ IDE နဲ့ CLI (agy) မှာ Tool Execution Policy ကို always-proceed ပြောင်းလဲတာ၊ Command Allowlist သတ်မှတ်တာနဲ့ Safety Boundary ထိန်းသိမ်းပြီး အလိုအလျောက် command run စေမယ့် နည်းလမ်းများ။"
categories: ["AI", "Development", "Productivity"]
tags: ["Google Antigravity", "AI Agent", "CLI", "Developer Tools", "Automation", "Pair Programming"]
series: ["Antigravity Workflows"]
keywords: ["Google Antigravity auto run now", "Antigravity tool approval", "always-proceed policy", "agy cli auto run", "AI pair programming automation"]
slug: "automating-run-now-approvals-google-antigravity"
---
Google Antigravity (သို့မဟုတ် Antigravity 2.0 / CLI / IDE) နဲ့ အတူတွဲပြီး Code ရေးတာ၊ Scripts တွေ Run တာ ဒါမှမဟုတ် Telegram Sticker/Emoji တွေကို Vector အဖြစ် ပြောင်းလဲတဲ့ အလုပ်တွေကို လုပ်တဲ့အခါ Agent က Terminal Command တစ်ခု စတင် Run တော့မယ်ဆိုတိုင်း Screen ပေါ်မှာ Confirmation Modal Box တစ်ခု အမြဲတမ်း ပေါ်လာတတ်တယ်။ 

အဲဒီ Modal ထဲမှာ ရွေးချယ်စရာ Option ၄ ခု ပါဝင်ပြီး ပထမဆုံး Option ဖြစ်တဲ့ `[1] Run now` ကို တစ်ခေါက်ချင်းစီ လိုက်နှိပ်ပေးနေရတာက Command အကြိမ် ၅၀-၁၀၀ မက Run ရတဲ့အခါ Coding Flow ပြတ်တောက်စေပြီး အချိန်တော်တော် ကုန်စေတယ်။ ဒါကြောင့် ဒီနေ့ Session မှာတော့ ဒီ Option ၄ ခုရဲ့ အဓိပ္ပာယ်ကို ရှင်းလင်းလေ့လာပြီး `always-proceed` Setting နဲ့ အလိုအလျောက် Run သွားစေမယ့် **`auto-run-now` Skill** တစ်ခု ဖန်တီးခဲ့တဲ့ အတွေ့အကြုံကို ပြန်လည် မျှဝေပေးလိုက်ပါတယ်။

![Google Antigravity Automating Tool Approvals](images/antigravity-auto-run-now.webp)

---

## ၁။ Antigravity ရဲ့ Permission Options ၄ ခုကို နားလည်ခြင်း

Agent က `run_command` tool ကို ခေါ်သုံးပြီး Bash command တွေ Run တဲ့အခါ Default အနေနဲ့ `request-review` Policy သတ်မှတ်ထားတဲ့အတွက် အောက်ပါ Option ၄ ခုကို ပြသပေးတယ်-

| Option | အမည် | ဘာလုပ်ပေးတာလဲ | သက်ရောက်မှု အတိုင်းအတာ |
| :---: | :--- | :--- | :--- |
| **[1]** | **Run now** *(Target)* | လက်ရှိ Command ကို ချက်ချင်း အတည်ပြုပြီး Run ပေးတယ်။ | Command တစ်ခုတည်းအတွက်သာ |
| **[2]** | **Always allow in this session** | လက်ရှိ Terminal Session မပိတ်မချင်း ဒီ Command ပုံစံကို နောက်ထပ် ထပ်မမေးတော့ဘူး။ | လက်ရှိ Session တစ်ခုလုံး |
| **[3]** | **Always allow in this workspace** | လက်ရှိ Project/Workspace ရဲ့ Setting ထဲမှာ ဒီ Command Pattern ကို အပြီးအပိုင် Whitelist ထည့်ပေးလိုက်တယ်။ | Workspace / Repository တစ်ခုလုံး |
| **[4]** | **Reject / Cancel** | Command မ Run ဘဲ ပယ်ဖျက်လိုက်ပြီး Agent ဆီ Error ပြန်ပို့တယ်။ | ချက်ချင်း ရပ်တန့်ခြင်း |

ဒီနေရာမှာ ကျွန်တော်တို့ အများဆုံး လိုချင်တာက Option 1 (`Run now`) ဖြစ်ပေမယ့် အကြိမ်တိုင်း ခလုတ်လိုက်နှိပ်နေရတာ သို့မဟုတ် Terminal ထဲ `1` လိုက်ရိုက်နေရတာ အဆင်မပြေပါဘူး။

---

## ၂။ Always-Proceed သုံးပြီး အပြီးအပိုင် Auto-Run ပြုလုပ်နည်း

ဒီ Confirmation Box မတက်လာစေဘဲ Safe Command တွေကို တိုက်ရိုက် Auto Run သွားစေဖို့ Antigravity Surface တစ်ခုချင်းစီအလိုက် အောက်ပါအတိုင်း ပြင်ဆင်နိုင်တယ်-

### က။ Antigravity 2.0 (Desktop App) ထဲမှာ ပြင်ဆင်နည်း
1. ဘယ်ဘက်အောက်ထောင့်က **Gear Icon (⚙️ Settings)** ကို နှိပ်ပါ။
2. **Agent Settings** $\longrightarrow$ **Tool Execution Policy** ဆီ သွားပါ။
3. Default ဖြစ်နေတဲ့ `request-review` ကနေ **`always-proceed`** သို့မဟုတ် **`proceed-in-sandbox`** ကို ပြောင်းလဲပေးပါ။
4. Project အလိုက် သီးသန့်ထားချင်ရင်တော့ **Project Settings** အောက်က **Auto-Execution Policy** ကို `always-proceed` ပေးထားနိုင်ပါတယ်။

### ခ။ Antigravity IDE (VS Code Extension) ထဲမှာ ပြင်ဆင်နည်း
1. Settings (`Ctrl+,` သို့မဟုတ် `Cmd+,`) ကို ဖွင့်ပါ။
2. `antigravity.terminal` လို့ ရှာဖွေပါ။
3. **Tool Execution Policy** ကို `always-proceed` လို့ သတ်မှတ်ပေးပါ (သို့မဟုတ် `antigravity.terminal.autoApprove: true` ကို အမှန်ခြစ်ပေးပါ)။

### ဂ။ Antigravity CLI (`agy`) မှာ အသုံးပြုနည်း
CLI ကို သုံးပြီး Terminal ကနေ အလုပ်လုပ်တဲ့အခါ Flag သုံးပြီး တိုက်ရိုက် Run နိုင်တယ်-
```bash
# Auto-run mode နဲ့ စတင်ဖွင့်လှစ်ခြင်း
agy --auto-run
```
*(ယုံကြည်စိတ်ချရတဲ့ Workspace တွေမှာ `agy -y` သုံးနိုင်ပါတယ်)*။

TUI ပွင့်နေချိန်မှာတော့ `/config` လို့ ရိုက်ထည့်ပြီး Permissions Menu ထဲက **Tool Execution Policy** ကို **`always-proceed`** ပြောင်းလဲထားနိုင်ပါတယ်။

---

## ၃။ Dedicated `auto-run-now` Skill ဖန်တီးခြင်း

အခြား Workspace တွေနဲ့ စက်တွေမှာပါ အလွယ်တကူ သုံးနိုင်ဖို့အတွက် Antigravity Skill အသစ်တစ်ခုကို တည်ဆောက်ခဲ့တယ်။

ဒီ Skill ကို Global လမ်းကြောင်းဖြစ်တဲ့ `~/.gemini/config/skills/auto-run-now/SKILL.md` အပြင် လက်ရှိ Project ရဲ့ `.agents/skills/auto-run-now/SKILL.md` ထဲမှာပါ ထည့်သွင်းထားပေးတယ်-

```markdown
---
name: auto-run-now
description: Configures and automates Antigravity command execution and tool approvals. Automatically selects "Run now" (Option 1 of 4) or enables "always-proceed" mode across Antigravity 2.0, IDE, and CLI, eliminating manual confirmation prompts.
---
```

ဒီ Skill ရှိနေတဲ့အတွက် Agent ဟာ Command တွေကို မလိုအပ်ဘဲ ရပ်တန့်မစောင့်ဆိုင်းတော့ဘဲ Task အဆုံးထိ သွက်သွက်လက်လက် ပြီးစီးအောင် ဆောင်ရွက်ပေးနိုင်သွားပါတယ်။

---

## ၄။ Command Allowlists သတ်မှတ်ခြင်း

သတ်မှတ်ထားတဲ့ Developer Command တွေကိုပဲ အလိုအလျောက် ခွင့်ပြုပေးချင်ရင် `/permissions` ထဲမှာဖြစ်စေ၊ Project Configuration ထဲမှာဖြစ်စေ Allowlist သတ်မှတ်ပေးထားနိုင်တယ်-

```json
{
  "permissions": {
    "terminal": {
      "allowlist": [
        "git *",
        "python3 *",
        "python *",
        "hugo *",
        "flutter *",
        "dart *",
        "npm *",
        "npx *",
        "ls *",
        "cat *",
        "find *",
        "grep *"
      ]
    }
  }
}
```

---

## ၅။ Safety Boundary (လုံခြုံရေး စည်းမျဉ်း) ထားရှိခြင်း

Auto-run လုပ်ခိုင်းထားတယ်ဆိုပေမယ့် စနစ်တစ်ခုလုံး ပျက်စီးသွားနိုင်တဲ့ အန္တရာယ်ရှိတဲ့ Command တွေအတွက်တော့ User ဆီက တိုက်ရိုက် အတည်ပြုချက် ရယူရမယ်ဆိုတဲ့ စည်းကမ်းကို `AGENTS.md` ထဲမှာ အတိအလင်း သတ်မှတ်ထားဖို့ လိုအပ်တယ်-

* **ဘယ်လို Command တွေလဲ:** `rm -rf /`၊ Force Git Push (`git push --force`)၊ Hard Reset (`git reset --hard`) ဒါမှမဟုတ် Unrecoverable Branch Deletion စတဲ့ အရာတွေ ဖြစ်ပါတယ်။
* ဒီလို Dangerous Commands တွေ မပါဝင်သရွေ့တော့ Safe Build / Test / Compile အလုပ်တွေကို ချောချောမောမော အလိုအလျောက် ပြီးမြောက်စေမှာ ဖြစ်ပါတယ်။

---

## အနှစ်ချုပ်

AI Coding Assistant တွေနဲ့ အလုပ်လုပ်တဲ့အခါ Command တိုင်းအတွက် 'Run now' ခလုတ်ကို အကြိမ်ကြိမ် လိုက်နှိပ်ပေးနေရတာက တကယ်တော့ Developer ရဲ့ Focus ကို အနှောင့်အယှက် ဖြစ်စေပါတယ်။ 

အခုလို `always-proceed` Policy နဲ့ `auto-run-now` Skill ကို သတ်မှတ်လိုက်တဲ့အခါ စိတ်အနှောင့်အယှက်ကင်းကင်းနဲ့ တကယ့် Coding ပိုင်းကိုပဲ အပြည့်အဝ အာရုံစိုက်နိုင်သွားတာကြောင့် အချိန်ကုန် သက်သာစေတဲ့ အလေ့အကျင့်ကောင်းတစ်ခုအဖြစ် မျှဝေလိုက်ရပါတယ်။
