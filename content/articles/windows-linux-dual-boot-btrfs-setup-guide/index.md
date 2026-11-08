---
title: "Windows Linux Dual Boot နဲ့ Btrfs အကောင်းဆုံး ပြင်ဆင်နည်း လမ်းညွှန်"
date: 2026-11-08T22:15:00+06:30
lastmod: 2026-11-08T22:15:00+06:30
description: "Windows နဲ့ Linux ကို Dual Boot တွဲသုံးရာမှာ Data မပျက်စီးစေဘဲ Btrfs Shared Drive သုံးနည်း၊ Fast Startup ပိတ်နည်း၊ pagefile.sys ဖယ်ရှားနည်းနဲ့ Clock Sync ပြင်ဆင်နည်း လက်တွေ့လမ်းညွှန်။"
summary: "Windows နဲ့ Linux ကို Dual Boot တွဲသုံးရာမှာ Data မပျက်စီးစေဘဲ Btrfs Shared Drive သုံးနည်း၊ Fast Startup ပိတ်နည်း၊ pagefile.sys ဖယ်ရှားနည်းနဲ့ Clock Sync ပြင်ဆင်နည်း လက်တွေ့လမ်းညွှန်။"
categories: ["Linux", "Windows", "System Administration", "Storage"]
tags: ["Dual Boot", "Btrfs", "WinBtrfs", "Fast Startup", "Pagefile", "Virtual Memory", "Linux", "Windows 11"]
series: ["Dual Boot Optimization"]
keywords: ["Windows Linux dual boot btrfs", "WinBtrfs windows 11 guide", "disable fast startup powercfg", "remove pagefile from secondary drive", "ClearPageFileAtShutdown registry", "dual boot clock sync RealTimeIsUniversal"]
slug: "windows-linux-dual-boot-btrfs-setup-guide"
---

Windows နဲ့ Linux ကို စက်တစ်လုံးတည်းမှာ Dual Boot တွဲသုံးတဲ့အခါ အတွေ့ရဆုံး ခေါင်းခဲစရာ ပြဿနာကတော့ OS နှစ်ခုကြားမှာ File တွေ၊ Project တွေကို မျှဝေသုံးစွဲဖို့ Drive သတ်မှတ်တာနဲ့ Windows ရဲ့ Background Features တချို့ကြောင့် Linux ဘက်မှာ Partition တွေ Corrupt ဖြစ်တာ၊ Lock ကျနေတာတွေပဲ ဖြစ်ပါတယ်။

ရိုးရိုးတန်းတန်း NTFS Partition ကိုပဲ Linux ဘက်ကနေ Mount လုပ်သုံးတဲ့အခါ Linux ရဲ့ File Permissions (`chmod +x`, `chown`) တွေ ပျက်သွားတာ၊ Git repositories တွေမှာ `fileMode` အလွဲတွေ ဖြစ်တာအပြင်၊ Windows Fast Startup ကြောင့် Linux ဘက်မှာ Read-Only အဖြစ် ကပ်ငြိနေတတ်ပါတယ်။

ဒီလမ်းညွှန်မှာတော့ ကျွန်တော် လက်တွေ့ စမ်းသပ်အသုံးပြုနေတဲ့ Windows ရော Linux ပါ ချောမွေ့စွာ တွဲဖက်သုံးနိုင်မယ့် **Btrfs Shared Partition** တည်ဆောက်ပုံ၊ Windows ဘက်မှာ **Fast Startup & Hibernation** အပြီးပိတ်နည်း၊ Shared Drive ပေါ်က **`pagefile.sys`** ကို အပြီးဖယ်ရှားနည်းနဲ့ OS အကူးအပြောင်းမှာ နာရီမလွဲစေမယ့် **UTC Clock Sync** ပြင်ဆင်နည်းတွေကို တစ်ဆင့်ချင်း အသေးစိတ် ရှင်းပြပေးသွားပါမယ်။

---

## ၁။ Windows ဘက်မှာ အခုချက်ချင်း သွားရောက်လုပ်ဆောင်ရမယ့် Tweaks များ

Windows နဲ့ Linux ကြား Data safe ဖြစ်စေဖို့အတွက် Windows OS ဘက်ခြမ်းမှာ အောက်ပါ အဆင့် ၄ ဆင့်ကို အရင်ဆုံး မဖြစ်မနေ လုပ်ဆောင်ပေးရပါမယ်။

### အဆင့် (၁) — Fast Startup နဲ့ Hibernation ကို အပြီးပိတ်ခြင်း

Windows ရဲ့ Fast Startup ဟာ Shutdown လုပ်လိုက်တဲ့အခါ တကယ်မပိတ်ဘဲ Windows Kernel ကို Hibernate လုပ်ပြီး Partition တွေကို In-Use (`dirty bit`) အနေနဲ့ Lock ချထားခဲ့ပါတယ်။ အဲ့ဒီအချိန်မှာ Linux ဘက်ကနေ အဲ့ဒီ Drive တွေကို ဝင်ရောက်ရေးသားမိရင် Data တွေ Corrupt ဖြစ်ပြီး ပျက်စီးသွားတတ်ပါတယ်။

1. Windows Start Menu မှာ **CMD** (သို့မဟုတ် PowerShell) ကို ရှာပြီး **Run as Administrator** နဲ့ ဖွင့်ပါ။
2. အောက်ပါ command ကို ရိုက်ထည့်ပြီး Enter ခေါက်ပါ -

```cmd
powercfg /h off
```

> **ဘာတွေ အကျိုးသက်ရောက်သွားမလဲ?**  
> Hibernation ရော Fast Startup ပါ တစ်ခါတည်း အပြီးတိုင် ပိတ်သွားပြီး C: Drive ပေါ်က နေရာယူထားတဲ့ `hiberfil.sys` ဖိုင်ကြီးပါ ပျက်သွားပါမယ်။ Windows Shutdown အစစ်အမှန် ဖြစ်သွားတဲ့အတွက် Linux ဘက်ကနေ Drive တွေကို စိတ်ချလက်ချ အသုံးပြုနိုင်ပါပြီ။

---

### အဆင့် (၂) — Shared Drive ပေါ်က `pagefile.sys` ကို ဖယ်ရှားနည်း

Windows ဟာ ပုံမှန်ဆိုရင် Paging File (Virtual Memory) ကို စက်မှာရှိသမျှ Drive အားလုံးပေါ် လိုက်ဆောက်တတ်ပါတယ်။ ဒါကြောင့် Shared Drive (ဥပမာ D: Drive) ပေါ်မှာ `pagefile.sys` ကြီး သွားရောက်နေရာယူပြီး Drive ကို Lock ချထားတာမျိုး မဖြစ်ရအောင် C: Drive ပေါ်မှာပဲ သီးသန့် ကန့်သတ်ပေးရပါမယ်။

#### အဆင့်ဆင့် သွားရောက်ပြင်ဆင်ပုံ-

1. ကီးဘုတ်ပေါ်က **`Win + R`** ကို တွဲနှိပ်ပြီး `sysdm.cpl` လို့ ရိုက်ထည့်ကာ Enter ခေါက်ပါ။
2. **System Properties** box ပွင့်လာရင် အပေါ်က **Advanced** tab ကို နှိပ်ပါ။
3. **Performance** အောက်က **Settings...** ခလုတ်ကို နှိပ်ပါ။
4. ပွင့်လာတဲ့ **Performance Options** box ထဲက **Advanced** tab ကို ထပ်သွားပါ။
5. **Virtual memory** အောက်က **Change...** ခလုတ်ကို နှိပ်ပါ။
6. ထိပ်ဆုံးမှာရှိတဲ့ **"Automatically manage paging file size for all drives"** အမှန်ခြစ်ကို **ဖြုတ်** လိုက်ပါ။
7. Drives စာရင်းထဲက မိမိရဲ့ **Shared Drive (ဥပမာ `D:`)** ကို ကလစ်နှိပ်ပြီး ရွေးပါ။
8. အောက်ဘက်က **"No paging file"** option ကို ရွေးပြီး ဘေးနားက **`Set`** ခလုတ်ကို နှိပ်ပါ *(Set ကို မဖြစ်မနေ နှိပ်ပေးရပါမယ်)*။
9. **`C:` Drive** ကို ပြန်ရွေးပြီး **"System managed size"** ထားပေးထားကာ **`Set`** ကို နှိပ်ပါ။
10. **OK → Apply → OK** နှိပ်ပြီး Windows ကို **Restart** ချလိုက်ပါ။

Restart တက်လာတဲ့အခါ Shared Drive ပေါ်မှာ `pagefile.sys` မရှိတော့ဘဲ ရှင်းလင်းသွားပါပြီ။

---

### အဆင့် (၃) — Shutdown ချတိုင်း `pagefile.sys` ကို Auto-Clear လုပ်စေခြင်း

Dual Boot မှာ Windows ကနေ Linux ကို Reboot လုပ်ပြီး ကူးတိုင်း Windows RAM ထဲက အကြွင်းအကျန် ဒေတာတွေ Disk ပေါ်မှာ မကျန်နေစေဖို့အတွက် Windows Shutdown ဖြစ်တိုင်း Pagefile ထဲက အချက်အလက်တွေကို သန့်စင်ပေးမယ့် Registry setting ဖြစ်ပါတယ်။

Administrator CMD သို့မဟုတ် PowerShell ဖွင့်ပြီး အောက်ပါ command ကို Run ပေးပါ -

```cmd
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v ClearPageFileAtShutdown /t REG_DWORD /d 1 /f
```

---

### အဆင့် (၄) — Linux နဲ့ Windows ကြား နာရီမလွဲစေမယ့် UTC Sync Fix

Windows ဟာ Hardware Clock (BIOS) ကို Local Time (မြန်မာစံတော်ချိန် UTC+6:30) အဖြစ် မှတ်ယူပြီး၊ Linux ကတော့ ကမ္ဘာ့စံတော်ချိန် UTC (GMT+0) အဖြစ် မှတ်ယူပါတယ်။ ဒါကြောင့် OS တစ်ခုကနေ တစ်ခု ပြောင်းတိုင်း နာရီ ၆ နာရီခွဲ လွဲနေတတ်တာ ဖြစ်ပါတယ်။

Windows ကို UTC အသုံးပြုအောင် Administrator CMD သို့မဟုတ် PowerShell မှာ အောက်ပါ command ကို Run ပါ -

```cmd
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /t REG_DWORD /d 1 /f
```

ဒီ command ထည့်သွင်းပြီးသွားရင်တော့ Windows ရော Linux ပါ နာရီ လုံးဝ လွဲတော့မှာ မဟုတ်ပါဘူး။

---

## ၂။ Shared Storage အတွက် Btrfs (WinBtrfs) တည်ဆောက်ပုံ

Windows နဲ့ Linux ကြားမှာ File တွေ၊ Git Code တွေ အတူတူ မျှဝေသုံးဖို့အတွက် Shared Data Partition ကို **Btrfs** format သုံးတာဟာ အကောင်းဆုံး ဖြေရှင်းနည်း ဖြစ်ပါတယ်။

* **Linux ဘက်ခြမ်း** — Native kernel driver ဖြစ်တဲ့အတွက် Performance မြန်ဆန်ပြီး File Permissions နဲ့ Symlinks တွေကို အပြည့်အဝ ထိန်းသိမ်းပေးပါတယ်။
* **Windows ဘက်ခြမ်း** — Open-source **WinBtrfs** driver ကို အသုံးပြုပြီး သာမန် `D:\` Drive တစ်ခုလို တိုက်ရိုက် Read/Write လုပ်ဆောင်နိုင်ပါတယ်။

> [!WARNING]
> Windows OS ရှိတဲ့ C: Drive တစ်ခုလုံးကို Btrfs ပြောင်းဖို့ မကြိုးစားပါနဲ့။ C: Drive ကို NTFS အတိုင်း ထားရှိပြီး၊ **Shared Data Partition (D: Drive) တစ်ခုတည်းကိုသာ Btrfs ပြောင်းသုံးရပါမယ်**။

---

### Linux ဘက်မှ Btrfs Partition တည်ဆောက်ခြင်း

1. မိမိ Format ရိုက်မယ့် Shared Partition နာမည်ကို စစ်ဆေးပါ -
   ```bash
   lsblk -f
   ```
   *(ဥပမာ- `/dev/nvme0n1p4` လို့ ယူဆပါမယ်)*

2. Btrfs format ရိုက်ပါ (Label ကို "DataVault" လို့ ပေးပါမယ်) -
   ```bash
   sudo mkfs.btrfs -L DataVault /dev/nvme0n1p4
   ```

3. Subvolume ခွဲသုံးလိုပါက (အကြံပြုချက်) -
   ```bash
   sudo mount /dev/nvme0n1p4 /mnt
   sudo btrfs subvolume create /mnt/@shared
   sudo umount /mnt
   ```

4. Boot တက်တိုင်း Auto-mount ဖြစ်စေဖို့ `/etc/fstab` ထဲ ထည့်သွင်းပါ -
   ```bash
   # Partition ရဲ့ UUID ကို ကြည့်ပါ
   sudo blkid /dev/nvme0n1p4
   ```
   `/etc/fstab` ထဲမှာ အောက်ပါအတိုင်း ထည့်ပါ -
   ```fstab
   UUID=<your-partition-uuid>  /mnt/shared  btrfs  defaults,noatime,compress=zstd:1,discard=async,subvol=@shared  0  0
   ```
   *(မှတ်ချက်: `compress=zstd:1` ဟာ File တွေကို CPU ဝန်မပိစေဘဲ နေရာချွေတာ ချုံ့သိမ်းပေးပြီး SSD အသက်ကိုပါ ရှည်စေပါတယ်)*

5. Mount Point ပြုလုပ်ပြီး Permission ပေးပါ -
   ```bash
   sudo mkdir -p /mnt/shared
   sudo mount -a
   sudo chown -R $USER:$USER /mnt/shared
   ```

---

### Windows ဘက်မှ WinBtrfs Driver ထည့်သွင်းခြင်း

1. Windows သို့ Boot တက်ပါ။
2. GitHub [maharmstone/btrfs Releases](https://github.com/maharmstone/btrfs/releases) သို့ သွားပြီး နောက်ဆုံးထွက် `btrfs-x.xx.zip` ကို ဒေါင်းလုဒ်ဆွဲပါ။
3. Zip ဖိုင်ကို ဖြည်ပြီး ဖိုဒါထဲက **`btrfs.inf`** ဖိုင်ပေါ်မှာ **Right-click နှိပ်ပြီး "Install"** ကို ရွေးပါ။
4. UAC Prompt မှာ **Yes** ပေးပြီး စက်ကို **Restart** ချပါ။
5. Restart ပြန်တက်လာရင် File Explorer ထဲမှာ Btrfs Partition ဟာ Drive Letter (ဥပမာ `D:`) အနေနဲ့ အလိုအလျောက် ပေါ်နေပါလိမ့်မယ်။

---

## ၃။ Coding & Development လုပ်တဲ့အခါ သတိထားရမယ့် အချက်များ

Shared Btrfs Partition ပေါ်မှာ Development Projects (Git Repositories) တွေ ထားရှိတဲ့အခါ အောက်ပါအချက်တွေကို သတိပြုရပါမယ် -

1. **`node_modules` နဲ့ `.venv` များကို Cross-OS မသုံးပါနဲ့**:
   * Windows ပေါ်မှာ compile လုပ်ထားတဲ့ native binaries (`.dll`, `.node`, C++ extensions) တွေနဲ့ Linux ပေါ်က binary format (`.so`, ELF) တွေ မတူပါဘူး။
   * ဒါကြောင့် `node_modules`၊ Python `.venv` နဲ့ Rust `target/` ဖိုဒါတွေကို `.gitignore` ထဲ ထည့်ထားပြီး သက်ဆိုင်ရာ OS အလိုက် သီးသန့် generate လုပ်ပြီး run ပါ။
2. **Windows Defender Exclusion ထည့်ထားပါ**:
   * Windows ဘက်ကနေ Code တွေ compile လုပ်တဲ့အခါ မြန်ဆန်စေဖို့ Shared Drive (ဥပမာ `D:\`) သို့မဟုတ် Projects ဖိုဒါကို Windows Security ရဲ့ **Virus & threat protection → Exclusions** ထဲ ထည့်ပေးထားပါ။

---

## အနှစ်ချုပ် စစ်ဆေးရမည့် Checklist

Windows နဲ့ Linux ကို Dual Boot အသုံးပြုတဲ့အခါ အောက်ပါ Checklist အတိုင်း ပြင်ဆင်ပြီးစီးမှု ရှိမရှိ စစ်ဆေးလိုက်ပါ -

- [ ] Windows မှာ `powercfg /h off` ရိုက်ပြီး Fast Startup ပိတ်ထားပြီးပြီလား?
- [ ] Windows `sysdm.cpl` ထဲမှာ Shared Drive ကို "No paging file" ပြောင်းပြီးပြီလား?
- [ ] Windows Registry မှာ `RealTimeIsUniversal = 1` ထည့်ပြီး Clock Sync ညှိပြီးပြီလား?
- [ ] Shared Data Drive ကို Btrfs format ရိုက်ပြီး Linux မှာ mount ထားပြီးပြီလား?
- [ ] Windows မှာ WinBtrfs driver ကို `btrfs.inf` ကနေ install လုပ်ပြီး Restart ချပြီးပြီလား?

ဒီအချက်တွေကို စနစ်တကျ ပြင်ဆင်ထားမယ်ဆိုရင်တော့ Windows နဲ့ Linux ကြား Data ပျက်စီးမယ့် အန္တရာယ် လုံးဝမရှိတော့ဘဲ စိတ်ချလက်ချ အသုံးပြုနိုင်မှာ ဖြစ်ပါတယ်။
