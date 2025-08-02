---
title: "SSH & GPG Keys: Backup, Restore & Secure GitHub Setup"
date: 2025-07-28T20:56:23+06:30
author: heinhtetkyaw
image: images/ssh-gpg-keys.png
thumbnail_image: images/ssh-gpg-keys.png
description: 
    GitHub အတွက် SSH နဲ့ GPG Key များကို လုံခြုံစွာ ဖန်တီးခြင်း၊ Backup လုပ်ခြင်း၊ ပြန်လည် Restore လုပ်ခြင်းနည်းလမ်းများကို လုပ်ဆောင်နိုင်အောင် လုပ်ဆောင်ပုံအဆင့်ဆင့်နဲ့ ပြဿနာဖြေရှင်းနည်းများပါဝင်တဲ့ လက်တွေ့လမ်းညွှန်ပါ။
summary:
    ဒီလမ်းညွှန်မှာ GitHub အတွက် SSH နဲ့ GPG Key များကို လုံခြုံစွာ ဖန်တီးခြင်း၊ Backup လုပ်ခြင်း၊ ပြန်လည် Restore လုပ်ခြင်းနည်းလမ်းများကို အဆင့်လိုက်ရှင်းပြထားပါတယ်။ SSH/GPG Key များကို GitHub တွင် Encrypted Repo အသုံးပြုပြီး သိမ်းဆည်းနိုင်သလို၊ အသစ်သော Device တစ်ခုတွင်လည်း လွယ်ကူစွာ ပြန်လည်သုံးနိုင်ပါသည်။ လုံခြုံရေးအတွက် Key များကို နှစ်စဉ်ပြောင်းလဲသင့်ပြီး Hardware Key အသုံးပြုခြင်းကိုလည်း အကြံပြုထားပါသည်။
categories:
    - Security
    - GitHub
    - DevOps
tags:
    - SSH
    - GPG
    - Backup
    - Restore
    - Encryption
series:
    - GitHub Security Essentials
keywords:
    - SSH keys
    - GPG keys
    - GitHub backup
    - git-crypt
    - key restore
    - encrypted repository
slug: ssh-gpg-keys-backup-restore-secure-github-setup
---
ဒီ Content ကတော့ အခြားမဟုတ်ဘူး ssh keys တွေ ခဏခဏထည့်လိုက် ထုတ်လိုက် ထုတ်လိုက်ထည့်လိုက် လုပ်နေမယ့်အစား တခုထဲကိုပဲ Device အများကြီးမှာသုံးချင်တဲ့အတွက်ကြောင့် ရေးသားပြီး မှတ်ထားလိုက်တဲ့ Content ဆိုလည်း မမှားဘူး။ ။ တကယ်က ခဏခဏ Generate မလုပ်ချင်တာလည်းပါတာပေါ့။ ။

အခုလောလောဆယ်မှာ မရှိသေးတဲ့လူတွေအတွက်ပါ ဒီလိုသိမ်းလို့ရတယ်ဆိုတာမျိုးဖြစ်အောင် အကုန် အစအဆုံး ပြန်ရေးလိုက်တာဆိုပေမယ့် ကျွန်တော့အတွက်ကတော့ ssh key က Server ပေါ်ကနေပြီးတော့ ပြန်သိမ်းထားပြီး ပြန်ထည့်ပြီး ဆိုပေမယ့်။ ။ အကယ်လို့သာ Server မရှိတော့ဘူးဆိုရင်ကောဆိုပြီး တွေးလိုက်မိတဲ့အတွက်ကြောင့်ပါဗျ။ အကယ်လို့ Server မရှိတော့ရင် သိမ်းလို့ရတာမျိုးမဟုတ်တော့ဘူးလားပေါ့။ ။ 

Drive storage တွေဖြစ်တဲ့ Google Drive, One Drive, တို့အပြင် အခြား Dropbox တို့ဘာတို့မှာလည်းထည့်လို့ရတာမျိုးဆိုပေမယ့် အထာမကျဘူးလို့ထင်တယ်။ Key တွေကို Download ဝင်ဆွဲပြီးထည့်လိုက်တာထက်ကို။ ။ cli ကနေပြီးတော့ Command line လေးတွေကို သုံးပြီး တခုချင်း ရိုက်ထည့်သွားတာမျိုးပေါ့။ ။ စကြရရင်တော့။ ။ 

# **The Complete Guide to SSH & GPG Keys: Backup, Restore & Secure GitHub Setup**  
*(SSH / GPG Key များကို GitHub တွင် Backup လုပ်နည်း၊ ပြန်လည်သုံးနည်း)*  

---

## **1. Introduction**  
SSH and GPG keys are essential for:  
🔹 **Password-less GitHub access** (SSH)  
🔹 **Secure commit signing** (GPG)  
🔹 **Encrypted backups** (git-crypt)  

This guide covers:  
✅ **Creating SSH & GPG keys**  
✅ **Backing up securely to GitHub**  
✅ **Restoring on a new machine**  

*(SSH / GPG Key များကို GitHub တွင် အလွယ်တကူ Backup လုပ်နည်း၊ ပြန်လည်သုံးနည်း)*  

---

## **2. Creating SSH Keys**  

### **A. Generate SSH Key**  
```bash {title="bash"}
ssh-keygen -t ed25519 -C "your_email@example.com"
```
- Press `Enter` for default location (`~/.ssh/id_ed25519`)  
- **Set a strong passphrase** (recommended)  

### **B. Add SSH Key to GitHub**  
1. Copy public key:  
   ```bash {title="bash"}
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to **[GitHub → Settings → SSH Keys](https://github.com/settings/keys)** → "New SSH Key"  

### **SSH Key ပြုလုပ်နည်း**  
1. Terminal ဖွင့် `ssh-keygen -t ed25519` ရိုက်ပါ  
2. `~/.ssh/id_ed25519` တွင် သိမ်းပါ  
3. GitHub မှာ **SSH Key ထည့်ပါ**  

---

## **3. Creating GPG Keys**  

### **A. Generate GPG Key**  
```bash
gpg --full-generate-key
```
- Choose: **RSA (1)**, **4096 bits**, **1y expiry**  
- Set **name/email** matching GitHub  

### **B. Add GPG Key to GitHub**  
1. List GPG keys:  
   ```bash
   gpg --list-secret-keys --keyid-format LONG
   ```
2. Export public key:  
   ```bash
   gpg --armor --export YOUR_KEY_ID
   ```
3. Paste at **[GitHub → Settings → GPG Keys](https://github.com/settings/gpg/new)**  

### **GPG Key ပြုလုပ်နည်း**  
1. `gpg --full-generate-key` ဖြင့် key ပြုလုပ်ပါ  
2. GitHub မှာ **GPG Key ထည့်ပါ**  

---

## **4. Backup Keys to GitHub (Secure Method)**  

### **A. Install git-crypt**  
```bash
# macOS
brew install git-crypt

# Linux
sudo apt-get install git-crypt
```

### **B. Create Encrypted Repo**  
```bash
mkdir keys && cd keys
git init
git-crypt init
git-crypt add-gpg-user YOUR_GPG_KEY_ID
```

### **C. Add Keys & Encrypt**  
1. Copy keys:  
   ```bash
   cp -r ~/.ssh .
   cp -r ~/.gnupg .
   ```
2. Configure encryption:  
   ```bash
   echo ".ssh/* filter=git-crypt diff=git-crypt" >> .gitattributes
   echo ".gnupg/* filter=git-crypt diff=git-crypt" >> .gitattributes
   ```
3. Push to GitHub:  
   ```bash
   git add .
   git commit -m "Add encrypted keys"
   git remote add origin git@github.com:username/keys.git
   git push -u origin main
   ```

### **GitHub သို့ Key များ Backup လုပ်နည်း**  
1. `git-crypt` ဖြင့် **encrypted repo** ပြုလုပ်ပါ  
2. SSH/GPG Key များကို repo ထဲထည့်ပါ  
3. GitHub သို့ push လုပ်ပါ  

---

## **5. Restoring Keys from GitHub**  

### **A. Clone & Unlock**  
```bash
git clone git@github.com:username/keys.git && cd keys
git-crypt unlock  # Requires GPG passphrase
```

### **B. Restore SSH Keys**  
```bash
mkdir -p ~/.ssh
cp -p .ssh/* ~/.ssh/
chmod 600 ~/.ssh/id_*
```

### **C. Restore GPG Keys**  
```bash
mkdir -p ~/.gnupg
cp -p .gnupg/* ~/.gnupg/
chmod 700 ~/.gnupg
```

### **Key များကို ပြန်လည်သုံးနည်း**  
1. `git-crypt unlock` ဖြင့် repo ကိုဖွင့်ပါ  
2. SSH/GPG Key များကို မူလနေရာသို့ ပြန်ကူးပါ  

---

## **6. Troubleshooting (အချက်အလက်များ)**  

| **Issue** | **Fix** |  
|-----------|---------|  
| `Permission denied (publickey)` | Run `ssh-add ~/.ssh/id_ed25519` |  
| `GPG signing failed` | Check `git config --global user.signingkey` |  
| `git-crypt unlock fails` | Ensure GPG key is imported |  

---

## **7. Conclusion**  
Now you can:  
✔ **Securely backup SSH/GPG keys**  
✔ **Restore keys on any machine**  
✔ **Use GitHub without passwords**  

**Next Steps:**  
- [ ] **Rotate keys yearly** for security  
- [ ] **Use a YubiKey** for hardware protection  

*(ယခု SSH / GPG Key များကို GitHub တွင် အလွယ်တကူ Backup လုပ်နိုင်ပြီ!)*  

--- 

**🚀 Pro Tip:**  
Use `git-crypt lock` after restoring keys to keep them secure!  

ဒီလောက်ဆိုရင်တော့ အမြဲထာဝရအတွက် သုံးနိုင်မယ့် Key တွေကိုရပြီပဲဖြစ်ပါတယ်။ ။ အဲ့ဒီလိုမှမဟုတ်ပဲ Create လုပ်တဲ့အဆင့်မှာပဲ ကိုယ်သုံးလိုက်တဲ့ PC တိုင်း နေရာတိုင်းမှာ သုံးချင်လည်းရပေမယ့်။ စတွန့်လုပ်ချင်လွန်းတဲ့ ကိုယ့်အတွက် မှတ်သားစရာ Content ဖြစ်နေလေတော့တယ်။ ။  နည်းနည်းရှုပ်သွားရင်တော့ သေချာပြန်ဖတ်လိုက်ရင် အဆင်ပြေမှာပါဗျ။ ။ မဟုတ်ရင်တောင် ရေးတဲ့လူ နားလည်ရင်ဖြစ်ပြီထင်ရဲ့။ ။ xD 