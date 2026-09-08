---
title: "SSH & GPG Keys အစအဆုံး လက်တွေ့လမ်းညွှန်: Generate, Secure Storage နဲ့ Restore လုပ်နည်း (Windows & Linux)"
date: 2026-09-09T00:40:00+06:30
image: images/ssh-gpg-keys.png
thumbnail_image: images/ssh-gpg-keys.png
description: "Windows နဲ့ Linux စနစ်နှစ်ခုလုံးအတွက် SSH နဲ့ GPG Keys တွေကို စနစ်တကျ Generate လုပ်ပုံ၊ Secure Permissions တွေနဲ့ သိမ်းဆည်းပုံ၊ Backup & Restore လုပ်ပုံနဲ့ Git Commit Signing အထိ အစအဆုံး အသေးစိတ်လမ်းညွှန်"
summary: "SSH နဲ့ GPG Keys တွေကို Windows နဲ့ Linux ပေါ်မှာ Ed25519 / RSA နဲ့ စနစ်တကျ ဖန်တီးနည်း၊ File Permissions တွေ သတ်မှတ်ပြီး လုံခြုံအောင် သိမ်းနည်း၊ စက်အသစ်မှာ အလွယ်တကူ Restore ပြန်လုပ်နည်းနဲ့ GitHub Verified Commit ရအောင် Sign လုပ်နည်း အဆင့်ဆင့်ကို ရှင်းပြပေးထားပါတယ်။"
categories: ["Security", "Developer Tools", "Linux", "Windows"]
tags: ["SSH", "GPG", "GitHub", "Linux", "Windows", "Security", "Key Management", "Git"]
series: ["Developer Security Essentials"]
keywords: ["ssh key generation", "gpg key generation", "windows ssh setup", "linux ssh permissions", "gpg backup restore", "git commit sign", "ed25519", "github verified badge"]
slug: "ssh-gpg-keys-setup-storage-restore-windows-linux"
---

Developer တစ်ယောက်အနေနဲ့ နေ့စဉ်အလုပ်လုပ်တဲ့အခါ GitHub, GitLab တွေနဲ့ ချိတ်ဆက်ဖို့ SSH Key လိုသလို၊ ကိုယ် Push လိုက်တဲ့ Commit တွေဟာ ကိုယ်တိုင်ရေးသားတာ အစစ်အမှန်ဖြစ်ကြောင်း သက်သေပြဖို့ GPG (သို့မဟုတ် SSH) Signing Key တွေက မရှိမဖြစ် လိုအပ်ပါတယ်။

ဒါပေမဲ့ Developer အများစု တွေ့ရတတ်တဲ့ ပြဿနာကတော့ စက်အသစ်တစ်လုံး ပြောင်းလိုက်တိုင်း Key တွေကို အစကနေ ပြန်ဖန်တီးရတာ၊ Permission Error တွေတက်တာ၊ Windows နဲ့ Linux မတူလို့ ရှုပ်ထွေးတာနဲ့ Backup စနစ်တကျ မလုပ်ထားမိလို့ Key ပျောက်သွားတာတွေပဲ ဖြစ်ပါတယ်။

ဒီလမ်းညွှန်မှာတော့ **Windows** ရော **Linux** မှာပါ SSH နဲ့ GPG Keys တွေကို အစကနေ အဆုံးထိ ဘယ်လို စနစ်တကျ Generate လုပ်မလဲ၊ File Permission တွေ သတ်မှတ်ပြီး ဘယ်လို Secure Store လုပ်မလဲ၊ Backup နဲ့ စက်အသစ်မှာ Restore ဘယ်လို ပြန်လုပ်မလဲ၊ ပြီးတော့ GitHub မှာ **Verified** Badge ရအောင် Git Commit Signing ဘယ်လို ထည့်မလဲဆိုတာကို အသေးစိတ် ရှင်းပြပေးသွားပါမယ်။

![SSH & GPG Keys](images/ssh-gpg-keys.png)

---

## ၁။ SSH နဲ့ GPG ရဲ့ အခြေခံသဘောတရား

လက်တွေ့မစခင် ဒီ Key နှစ်ခုရဲ့ တာဝန်ကို ရှင်းရှင်းလင်းလင်း သိထားဖို့ လိုပါတယ်။

*   **SSH Key (Secure Shell):** Authentication (အထောက်အထား စိစစ်ခြင်း) အတွက် သုံးပါတယ်။ Server တွေဆီ Remote Login ဝင်တာနဲ့ GitHub/GitLab တွေဆီ Password မလိုဘဲ `git push / git pull` လုပ်ဖို့ သုံးပါတယ်။
*   **GPG Key (GNU Privacy Guard):** Integrity & Identity (အချက်အလက် စစ်မှန်မှုနဲ့ လက်မှတ်ထိုးခြင်း) အတွက် သုံးပါတယ်။ Git Commit တွေကို ကိုယ်တိုင်ရေးတာ ဟုတ်မဟုတ် Verified Signature ထိုးဖို့နဲ့ အရေးကြီး File/Data တွေကို Encrypt/Decrypt လုပ်ဖို့ သုံးပါတယ်။

Key နှစ်ခုလုံးမှာ **Public Key** (လူတိုင်းကို မျှဝေလို့ရတဲ့ သော့ခလောက်) နဲ့ **Private Key** (ကိုယ့်စက်ထဲမှာပဲ လျှို့ဝှက်သိမ်းရမယ့် သော့) ဆိုပြီး အစုံလိုက် ရှိပါတယ်။ **Private Key ကို ဘယ်တော့မှ သူများဆီ မပေးရပါဘူး။**

---

## ၂။ SSH Key ဖန်တီးခြင်း (SSH Key Generation)

အရင်ဆုံး ခေတ်မီပြီး လုံခြုံမှုအမြင့်ဆုံးဖြစ်တဲ့ `Ed25519` Algorithm နဲ့ SSH Key တစ်ခု ဖန်တီးကြပါမယ်။ (အကြောင်းအမျိုးမျိုးကြောင့် RSA သုံးချင်ရင်လည်း 4096-bit သုံးနိုင်ပါတယ်)။

### (က) Linux & macOS ပေါ်တွင် SSH Key ဖန်တီးနည်း

Terminal ကို ဖွင့်ပြီး ဒီ Command ကို ရိုက်ပါ -

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

1.  **File သိမ်းမယ့်နေရာ:** Default အတိုင်း `~/.ssh/id_ed25519` မှာ သိမ်းဖို့ `Enter` ခေါက်ပါ။
2.  **Passphrase ထည့်ခြင်း:** Private Key ကို ကာကွယ်ဖို့ ခိုင်မာတဲ့ Passphrase တစ်ခု မဖြစ်မနေ ထည့်ပေးပါ။ (Passphrase မပါရင် စက်ထဲက Private Key ကို တစ်ယောက်ယောက် ကူးယူသွားတာနဲ့ အကုန်သုံးလို့ ရသွားပါလိမ့်မယ်)။

### (ခ) Windows (PowerShell / Windows Terminal) ပေါ်တွင် SSH Key ဖန်တီးနည်း

Windows 10/11 တွေမှာ OpenSSH Client က Built-in ပါပြီးသား ဖြစ်ပါတယ်။ PowerShell ကို ဖွင့်ပြီး အထက်ပါ Command အတိုင်းပဲ ရိုက်ထည့်နိုင်ပါတယ် -

```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Default အနေနဲ့ `C:\Users\<Username>\.ssh\id_ed25519` ထဲမှာ သွားသိမ်းပေးမှာ ဖြစ်ပါတယ်။

### (ဂ) SSH Public Key ကို GitHub / GitLab ထဲ ထည့်သွင်းခြင်း

Public Key ရဲ့ Content ကို Copy ကူးပါမယ် -

*   **Linux / macOS:**
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
*   **Windows (PowerShell):**
    ```powershell
    Get-Content ~\.ssh\id_ed25519.pub | Set-Clipboard
    ```

ပြီးရင် **GitHub -> Settings -> SSH and GPG keys -> New SSH Key** ထဲကို သွားပြီး Title ပေးကာ Copy ကူးထားတဲ့ Public Key ကို Paste လုပ်ပြီး သိမ်းလိုက်ပါ။

ချိတ်ဆက်မှု အဆင်ပြေမပြေ စမ်းသပ်ဖို့ Terminal/PowerShell မှာ ရိုက်ကြည့်ပါ -

```bash
ssh -T git@github.com
```

`Hi username! You've successfully authenticated...` ဆိုတဲ့ စာသားလေး ပေါ်လာရင် SSH ချိတ်ဆက်မှု အောင်မြင်သွားပါပြီ။

---

## ၃။ GPG Key ဖန်တီးခြင်း (GPG Key Generation)

Git Commit တွေကို Verified အဖြစ် Sign ထိုးဖို့အတွက် GPG Key တစ်ခု ဖန်တီးပါမယ်။

### (က) Linux ပေါ်တွင် GPG Key ဖန်တီးနည်း

Linux မှာ GnuPG Toolset မရှိသေးရင် အရင် Install လုပ်ပါ -

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install gnupg -y
```

ပြီးရင် Full Key Generation Command ကို သုံးပါ -

```bash
gpg --full-generate-key
```

အောက်ပါ အချက်အလက်တွေကို ရွေးပေးရပါမယ် -
1.  **Key Type:** `(9) ECC (Sign and Encrypt)` သို့မဟုတ် `(1) RSA and RSA` (RSA ဆိုရင် 4096 bits ရွေးပါ)။
2.  **Elliptic Curve:** `(1) Curve 25519` (Ed25519/Cv25519 က အကောင်းဆုံးပါ)။
3.  **Key Expiry:** သက်တမ်း ကုန်ဆုံးရက် (ဥပမာ `2y` ဆိုပြီး ၂ နှစ် သတ်မှတ်နိုင်သလို၊ `0` ဆိုပြီး သက်တမ်း အကန့်အသတ်မရှိ ထားနိုင်ပါတယ်)။
4.  **Real Name & Email:** GitHub အကောင့်မှာ သုံးထားတဲ့ နာမည်နဲ့ Email အတိုင်း အတိအကျ ထည့်ပေးပါ။
5.  **Passphrase:** လုံခြုံတဲ့ Passphrase တစ်ခု ပေးပါ။

### (ခ) Windows ပေါ်တွင် GPG Key ဖန်တီးနည်း

Windows မှာတော့ [Gpg4win](https://www.gpg4win.org/) ကို Install လုပ်ပြီး GUI Tool (Kleopatra) ကနေ ဖန်တီးနိုင်သလို၊ Git Bash သို့မဟုတ် PowerShell ကနေလည်း Linux အတိုင်း `gpg --full-generate-key` ရိုက်ပြီး အလွယ်တကူ ဖန်တီးနိုင်ပါတယ်။

### (ဂ) Revocation Certificate ကြိုထုတ်ထားခြင်း

အကယ်၍ နောင်တစ်ချိန်မှာ ကိုယ့် Private Key ပေါက်ကြားသွားတာ ဒါမှမဟုတ် Passphrase မေ့သွားတာမျိုး ဖြစ်ခဲ့ရင် Key ကို ဖျက်သိမ်းနိုင်ဖို့ Revocation Certificate ကို ကြိုထုတ်ပြီး သိမ်းထားသင့်ပါတယ် -

```bash
gpg --output ~/gpg-revocation-cert.asc --gen-revoke YOUR_EMAIL_OR_KEY_ID
```

### (ဃ) GPG Public Key ကို GitHub ထဲ ထည့်သွင်းခြင်း

အရင်ဆုံး ကိုယ့် GPG Key ID ကို ရှာပါမယ် -

```bash
gpg --list-secret-keys --keyid-format LONG
```

Output မှာ အခုလို တွေ့ရပါမယ် -

```text
sec   ed25519/3AA5C34371567BD2 2026-09-09 [SC]
      E2B889F4B3C5...
uid                 [ultimate] Htet Htet <your_email@example.com>
ssb   cv25519/42B3167B3456CDE1 2026-09-09 [E]
```

ဒီနေရာမှာ `3AA5C34371567BD2` ဆိုတာ Key ID ဖြစ်ပါတယ်။ Public Key ကို Export ထုတ်ယူဖို့ -

```bash
gpg --armor --export 3AA5C34371567BD2
```

ထွက်လာတဲ့ `-----BEGIN PGP PUBLIC KEY BLOCK-----` ကနေ `-----END PGP PUBLIC KEY BLOCK-----` အထိ အားလုံးကို Copy ကူးပြီး **GitHub -> Settings -> SSH and GPG keys -> New GPG Key** မှာ သွားထည့်လိုက်ပါ။

---

## ၄။ Keys များကို လုံခြုံစွာ သိမ်းဆည်းခြင်းနဲ့ Permission သတ်မှတ်ခြင်း

SSH နဲ့ GPG Keys တွေရဲ့ Private Key ဖိုင်တွေကို အခြား User တွေ ဖတ်လို့မရအောင် File Permission သေချာ ပိတ်ထားရပါမယ်။ မဟုတ်ရင် SSH Client က `UNPROTECTED PRIVATE KEY FILE!` ဆိုပြီး အလုပ်မလုပ်ဘဲ ငြင်းပယ်ပါလိမ့်မယ်။

### (က) Linux & macOS Permissions သတ်မှတ်နည်း

```bash
# SSH Directory နဲ့ Keys များအတွက်
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/config 2>/dev/null || true

# GPG Directory အတွက်
chmod 700 ~/.gnupg
```

### (ခ) Windows (PowerShell) Permissions သတ်မှတ်နည်း

Windows မှာ Linux လို `chmod` မရှိတဲ့အတွက် Windows Access Control List (ACL) နဲ့ အခြား User တွေရဲ့ Access ကို ဖြတ်တောက်ပေးရပါမယ် -

```powershell
# SSH Private Key Permissions ကို လက်ရှိ User တစ်ဦးတည်းအတွက်သာ ကန့်သတ်ခြင်း
$path = "$env:USERPROFILE\.ssh\id_ed25519"
icacls $path /inheritance:r
icacls $path /grant:r "$($env:USERNAME):(R,W)"
```

### (ဂ) SSH Agent ကို Background မှာ အလိုအလျောက် သုံးနိုင်အောင် လုပ်ခြင်း

Passphrase ကို ခဏခဏ ရိုက်မနေရအောင် SSH Agent ထဲ Key ထည့်ထားနိုင်ပါတယ် -

*   **Linux / macOS:**
    ```bash
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519
    ```
*   **Windows (PowerShell Admin အနေနဲ့ ဖွင့်ပါ):**
    ```powershell
    # OpenSSH Authentication Agent Service ကို Auto-start စတင်ပေးခြင်း
    Set-Service -Name ssh-agent -StartupType Automatic
    Start-Service ssh-agent
    ssh-add ~\.ssh\id_ed25519
    ```

---

## ၅။ Safe Backup & Export ပြုလုပ်နည်း

စက်အသစ်တစ်လုံး ပြောင်းတဲ့အခါ ဒါမှမဟုတ် OS ပြန်တင်တဲ့အခါ အရင် Key တွေကို ပြန်သုံးနိုင်ဖို့ စနစ်တကျ Backup ထုတ်ထားရပါမယ်။

### (က) GPG Keys များကို Backup ထုတ်ခြင်း

GPG Key အတွက် Public Key, Private Key နဲ့ Owner Trust တွေကို Export ထုတ်ပါမယ် -

```bash
# ၁။ Public Key ကို Export ထုတ်ခြင်း
gpg --armor --export YOUR_KEY_ID > gpg-public-key.asc

# ၂။ Private/Secret Key ကို Export ထုတ်ခြင်း (Passphrase တောင်းပါလိမ့်မယ်)
gpg --armor --export-secret-keys YOUR_KEY_ID > gpg-private-key.asc

# ၃။ Owner Trust Database ကို Export ထုတ်ခြင်း
gpg --export-ownertrust > gpg-ownertrust.txt
```

### (ခ) SSH Keys များကို Backup ထုတ်ခြင်း

`~/.ssh/` ထဲမှာရှိတဲ့ `id_ed25519` (Private Key), `id_ed25519.pub` (Public Key) နဲ့ `config` ဖိုင်တွေကို သိမ်းဆည်းရပါမယ်။

### (ဂ) Backup ဖိုင်များကို လုံခြုံစွာ သိမ်းဆည်းခြင်း အကြံပြုချက်

Backup ထုတ်ထားတဲ့ Private Key ဖိုင်တွေကို Plaintext အတိုင်း Google Drive သို့မဟုတ် USB Stick တွေပေါ်မှာ ဒီအတိုင်း မတင်ထားသင့်ပါဘူး။
*   **နည်းလမ်း ၁ (KeePassXC / Bitwarden):** Password Manager ရဲ့ Secure Attachment ထဲမှာ သိမ်းဆည်းခြင်း။
*   **နည်းလမ်း ၂ (Encrypted Archive):** 7-Zip သို့မဟုတ် GPG Symmetric Encryption (`gpg -c backup.tar.gz`) သုံးပြီး ခိုင်မာတဲ့ Master Password ခံကာ Encrypt လုပ်ပြီးမှ သိမ်းဆည်းခြင်း။

---

## ၆။ စက်အသစ်တွင် Keys များ Restore ပြန်လုပ်နည်း

စက်အသစ်တစ်လုံးဆီ ရောက်တဲ့အခါ အောက်ပါအဆင့်တွေအတိုင်း အလွယ်တကူ ပြန်ထည့်သွင်းနိုင်ပါတယ် -

### (က) SSH Keys များ Restore လုပ်ခြင်း

1.  Backup ထားတဲ့ `id_ed25519` နဲ့ `id_ed25519.pub` ဖိုင်တွေကို အသစ်ရောက်တဲ့ စက်ရဲ့ `~/.ssh/` (Linux) သို့မဟုတ် `C:\Users\<Username>\.ssh\` (Windows) ထဲ ကူးထည့်ပါ။
2.  အပိုင်း (၄) မှာ ဖော်ပြထားတဲ့ **File Permission သတ်မှတ်ခြင်း** ကို မဖြစ်မနေ ပြန်လည်လုပ်ဆောင်ပေးပါ။

### (ခ) GPG Keys များ Restore လုပ်ခြင်း

Backup ထားတဲ့ GPG ဖိုင်တွေကို Import ပြန်သွင်းပါမယ် -

```bash
# ၁။ Public Key ကို Import သွင်းခြင်း
gpg --import gpg-public-key.asc

# ၂။ Private Key ကို Import သွင်းခြင်း
gpg --import gpg-private-key.asc

# ၃။ Owner Trust ကို Restore လုပ်ခြင်း
gpg --import-ownertrust gpg-ownertrust.txt
```

Import လုပ်ပြီးတဲ့အခါ ကိုယ့် Key ကို ယုံကြည်စိတ်ချမှု အပြည့် (Ultimate Trust) ရရှိစေဖို့ သတ်မှတ်ပေးပါ -

```bash
gpg --edit-key YOUR_KEY_ID
```
*   `gpg>` Prompt ပေါ်လာရင် `trust` လို့ ရိုက်ပါ။
*   ရွေးချယ်စရာတွေထဲက `5` (I trust ultimately) ကို ရွေးပါ။
*   အတည်ပြုဖို့ `y` နှိပ်ပြီး `quit` နဲ့ ပြန်ထွက်ပါ။

---

## ၇။ Git Commit Signing သတ်မှတ်ခြင်း (Verified Badge ရယူနည်း)

GitHub မှာ Commit တင်တဲ့အခါ အစိမ်းရောင် **Verified** Badge လေး ပေါ်လာအောင် Sign လုပ်နည်း ၂ မျိုး ရှိပါတယ်။

### နည်းလမ်း (၁) - GPG ဖြင့် Commit Sign လုပ်ခြင်း (Standard Method)

Git Global Configuration မှာ GPG Key ID ကို တွဲပေးပါမယ် -

```bash
# GPG Key ID သတ်မှတ်ခြင်း
git config --global user.signingkey YOUR_GPG_KEY_ID

# Commit တိုင်းကို အလိုအလျောက် Sign လုပ်ရန် သတ်မှတ်ခြင်း
git config --global commit.gpgsign true

# Tag များကိုပါ Sign လုပ်ရန် သတ်မှတ်ခြင်း
git config --global tag.gpgSign true
```

*   **Linux အသုံးပြုသူများအတွက် အရေးကြီးချက်:** Terminal မှာ GPG Passphrase Prompt မှန်မှန်ကန်ကန် ပေါ်လာစေဖို့ `~/.bashrc` သို့မဟုတ် `~/.zshrc` ထဲမှာ ဒါလေး ထည့်ထားပေးပါ -
    ```bash
    export GPG_TTY=$(tty)
    ```
*   **Windows အသုံးပြုသူများအတွက် အရေးကြီးချက်:** Git က `gpg.exe` ကို ရှာမတွေ့ရင် လမ်းကြောင်း ညွှန်ပေးရပါမယ် -
    ```powershell
    git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
    ```

### နည်းလမ်း (၂) - SSH Key ဖြင့် Commit Sign လုပ်ခြင်း (ခေတ်မီ လွယ်ကူသော နည်းလမ်းသစ်)

GPG မသုံးချင်ဘဲ လက်ရှိသုံးနေတဲ့ SSH Key နဲ့ပဲ Commit Sign ထိုးချင်တယ်ဆိုရင် Git Version 2.34 ကစပြီး တိုက်ရိုက် သုံးလို့ရနေပါပြီ -

```bash
# Format ကို SSH အဖြစ် သတ်မှတ်ခြင်း
git config --global gpg.format ssh

# SSH Public Key လမ်းကြောင်းကို ပေးခြင်း
# Linux/macOS:
git config --global user.signingkey ~/.ssh/id_ed25519.pub
# Windows:
git config --global user.signingkey "C:/Users/<Username>/.ssh/id_ed25519.pub"

# Commit Signing ဖွင့်ခြင်း
git config --global commit.gpgsign true
```

*(မှတ်ချက် - SSH Key နဲ့ Commit Sign ထိုးမယ်ဆိုရင် GitHub ရဲ့ SSH Keys ထဲမှာ **Key type** ကို **Signing Key** အဖြစ် ထပ်ထည့်ပေးဖို့ လိုပါတယ်)*။

---

## ၈။ အဖြစ်များသော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ (Troubleshooting)

### ပြဿနာ ၁ - `WARNING: UNPROTECTED PRIVATE KEY FILE!`
*   **အကြောင်းရင်း:** Private Key ဖိုင်ရဲ့ Permission က ကျယ်ပြန့်လွန်းနေလို့ ဖြစ်ပါတယ်။
*   **ဖြေရှင်းနည်း:** Linux မှာ `chmod 600 ~/.ssh/id_ed25519` ပေးပါ။ Windows မှာ အပိုင်း (၄-ခ) အတိုင်း `icacls` သုံးပြီး Permissions ကို ပြန်ကန့်သတ်ပါ။

### ပြဿနာ ၂ - `error: gpg failed to sign the data` သို့မဟုတ် `Inappropriate ioctl for device`
*   **အကြောင်းရင်း:** GPG Agent က Terminal TTY ကို မသိတာ ဖြစ်ပါတယ်။
*   **ဖြေရှင်းနည်း:** Terminal မှာ `export GPG_TTY=$(tty)` ရိုက်ထည့်ပြီး Shell configuration (`~/.bashrc` / `~/.zshrc`) ထဲ ထည့်သိမ်းပါ။ ပြီးရင် `gpgconf --kill gpg-agent` နဲ့ agent ကို restart ချလိုက်ပါ။

### ပြဿနာ ၃ - Git Commit မှာ `Unverified` ဖြစ်နေခြင်း
*   **အကြောင်းရင်း:** Git Commit မှာ သုံးထားတဲ့ Committer Email နဲ့ GPG Key မှာ သုံးထားတဲ့ Email မတူညီလို့ ဖြစ်ပါတယ်။
*   **ဖြေရှင်းနည်း:** `git config --global user.email` နဲ့ GPG Key Email တူမတူ စစ်ဆေးပါ။

---

## ၉။ အနှစ်ချုပ် (Summary & Best Practices)

SSH နဲ့ GPG Keys တွေကို စနစ်တကျ ကိုင်တွယ်အသုံးပြုခြင်းဟာ Developer တစ်ယောက်အတွက် လုံခြုံရေးအရ အလွန်အရေးကြီးတဲ့ အလေ့အကျင့်ကောင်းတစ်ခု ဖြစ်ပါတယ်။

အဓိက သတိပြုရမယ့် အချက်တွေကို အကျဉ်းချုပ်ရရင်တော့ -
1.  **Ed25519 Algorithm** ကို ဦးစားပေး သုံးစွဲပါ။
2.  Private Key တွေမှာ **Passphrase အမြဲ ခံထားပါ**။
3.  Private Key ဖိုင်တွေကို File Permissions တင်းကြပ်စွာ သတ်မှတ်ထားပါ။
4.  Backup ဖိုင်တွေကို Plaintext အတိုင်း မထားဘဲ Encrypted လုပ်ပြီး လုံခြုံစွာ သိမ်းဆည်းပါ။
5.  Git Commit Signing ကို အသုံးပြုပြီး ကိုယ့်ရဲ့ Code Identity ကို ကာကွယ်ပါ။

ဒီလမ်းညွှန်မှာ ဖော်ပြထားတဲ့ အဆင့်တွေအတိုင်း လိုက်လုပ်ကြည့်မယ်ဆိုရင် Windows ရော Linux မှာပါ SSH နဲ့ GPG Keys တွေကို စိတ်ချလက်ချ အသုံးပြုသွားနိုင်မှာ ဖြစ်ပါတယ်။
