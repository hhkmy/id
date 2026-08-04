---
title: "Upgrade Pi After Long Time"
date: 2026-08-03T14:38:50+06:30
image: images/Pi5_Upgrade_cover.jpg
thumbnail_image: images/Pi5_Upgrade_front.jpg
description: "Raspberry Pi 5 ကို microSD Card ကနေ 512 GB NVMe SSD သို့ rpi-clone သုံးပြီး ပြောင်းရွှေ့ကာ NVMe Boot နဲ့ PCIe Speed ကို သတ်မှတ်ခဲ့တဲ့ အတွေ့အကြုံ။"
summary: "Storage ပြည့်နေတဲ့ Raspberry Pi 5 ကို Active Cooler၊ M.2 HAT+ နဲ့ 512 GB NVMe SSD တပ်ဆင်ပြီး microSD Card ထဲက System နဲ့ Docker Data တွေကို NVMe ဆီ ပြောင်းရွှေ့ခဲ့တဲ့ အဆင့်တွေကို ဒီ Post မှာ မျှဝေထားတယ်။"
categories: ["Linux", "Raspberry Pi", "System Administration"]
tags: ["Raspberry Pi 5", "NVMe SSD", "M.2 HAT+", "rpi-clone", "Docker", "Raspberry Pi OS"]
series: ["Raspberry Pi Guides"]
keywords: ["Raspberry Pi 5 NVMe upgrade", "Raspberry Pi NVMe boot", "clone microSD to NVMe", "rpi-clone NVMe", "Raspberry Pi M.2 HAT+", "Raspberry Pi 5 PCIe Gen 3"]
slug: "raspberry-pi-5-nvme-upgrade"
---

Raspberry Pi 5 ကို Japan က အသိတစ်ယောက်ဆီကတစ်ဆင့် လှမ်းမှာပြီး ဝယ်ထားခဲ့ပေမယ့် အချိန်တော်တော်ကြာတဲ့အထိ Upgrade မလုပ်ဖြစ်ခဲ့ဘူး။ မလုပ်ဖြစ်ခဲ့တာကလည်း Budget မလောက်တာ ပါတာပေါ့။

အရင်ဆုံး ဝယ်ထားခဲ့တာတွေကတော့

- Raspberry Pi 5 (16 GB RAM)
- Official Case
- Official Power Adapter
- 32 GB microSD Card

ဒီအတိုင်း တော်တော်ကြာ သုံးလာပြီးနောက်ပိုင်း Docker Image တွေ Run ထားတာနဲ့ Storage က 24 GB လောက်အထိ ပြည့်လာတယ်။ နေရာလွတ် 3.1 GB လောက်ပဲ ကျန်တော့တာဆိုတော့ Storage ပြဿနာကို မဖြစ်မနေ ဖြေရှင်းရတော့မယ့်အခြေအနေ ဖြစ်လာတာပေါ့။ အဲဒါနဲ့ အိမ်က မိန်းမနဲ့တိုင်ပင်ပြီး အောက်ကပစ္စည်းတွေ ထပ်ဝယ်လိုက်တယ်။

- Raspberry Pi 5 Active Cooler
- 512 GB NVMe SSD (Second-hand)
- Raspberry Pi M.2 HAT+

![Pi 5 Upgraded](images/Pi5_Upgraded.jpg "Pi 5 Upgraded")

မူလီတွေကြပ်ပြီး Installation လုပ်ပြီးတဲ့အချိန်မှာမှ အရင်ဝယ်ထားတဲ့ Pi 5 Official Case ကို M.2 HAT+ နဲ့ အပြည့်ပြန်ပိတ်လို့မရတာ သိလိုက်ရတယ်။ Official M.2 HAT+ က Active Cooler နဲ့ တွဲသုံးလို့ရပေမယ့် Official Case နဲ့ဆိုရင် Case အဖုံးနဲ့ ပါလာတဲ့ Fan ကို ဖယ်ထားမှ အဆင်ပြေမယ်။ လောလောဆယ် Case အသစ်လည်း မဝယ်နိုင်သေးတာနဲ့ အပေါ်ပိုင်းကို Tape နဲ့ပဲ ယာယီပြန်ပိတ်ထားလိုက်ရတော့တယ်။

Hardware အပိုင်းပြီးသွားပေမယ့် အလုပ်က ဒီမှာတင် မပြီးသေးဘူး။ microSD Card ထဲက System နဲ့ Data တွေကို NVMe ဆီ ပြောင်းရဦးမယ်။ NVMe ကနေ Boot တက်အောင်လုပ်ပြီး microSD Card ကို ဖြုတ်သိမ်းထားရင် တစ်ခုခုဖြစ်တဲ့အချိန် အနည်းနဲ့အများ Backup တစ်ခုအဖြစ်လည်း ပြန်သုံးလို့ရတာပေါ့။

## ကိုးကားခဲ့တဲ့ လမ်းညွှန်တွေ

- [rpi-clone - Jeff Geerling](https://rpi-clone.jeffgeerling.com)
- [NVMe SSD boot with the Raspberry Pi 5 - Jeff Geerling](https://www.jeffgeerling.com/blog/2023/nvme-ssd-boot-raspberry-pi-5)
- [Configure Raspberry Pi 5 to run from NVMe SSD - YouTube](https://www.youtube.com/watch?v=bspiPRGB_T4)
- [Raspberry Pi NVMe Boot Documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#nvme-boot)

YouTube Video ကို အရင်ကကြည့်ပြီး မှတ်ထားခဲ့ပေမယ့် အဲဒီအချိန်မှာ Device တွေ မရှိသေးလို့ ကိုယ်တိုင်မစမ်းဖြစ်ခဲ့ဘူး။ ကိုယ့်အလှည့်ရောက်မှ `rpi-clone` လမ်းညွှန်နဲ့ Raspberry Pi Documentation ကို တွဲကြည့်ပြီး လုပ်လိုက်တာ အဆင်ပြေသွားတယ်။

## မစခင် Destination Disk ကို စစ်မယ်

ပထမဆုံး System နဲ့ Bootloader ကို Update လုပ်ထားတာ ပိုကောင်းတယ်။

```bash
sudo apt update
sudo apt full-upgrade
sudo reboot
```

Reboot ပြန်တက်လာရင် NVMe ကို စက်ကမြင်၊ မမြင် စစ်လိုက်မယ်။

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS,MODEL
```

ဒီ Post ထဲမှာ ကျွန်တော့် NVMe ရဲ့ Device Name က `/dev/nvme0n1` ဖြစ်တယ်။ ကိုယ့်စက်မှာတော့ Device Name တူချင်မှတူမယ်။ နောက်က Command တွေ မ Run ခင် `lsblk` Result ထဲက Model နဲ့ Size ကို သေချာတိုက်စစ်ဖို့လိုတယ်။ Destination မှားရွေးလိုက်ရင် အဲဒီ Disk ထဲက Data တွေ ပျက်သွားနိုင်တယ်။

## `rpi-clone` Install လုပ်မယ်

အလွယ်ဆုံးနည်းက Install Script ကို သုံးတာပဲ။

```bash
curl https://raw.githubusercontent.com/geerlingguy/rpi-clone/master/install | sudo bash
```

`curl | sudo bash` နဲ့ မလုပ်ချင်ရင် Repository ကို Clone လုပ်ပြီး ကိုယ်တိုင် Copy ကူးလို့ရတယ်။

```bash
git clone https://github.com/geerlingguy/rpi-clone.git
cd rpi-clone
sudo cp rpi-clone rpi-clone-setup /usr/local/sbin
```

## microSD Card ကနေ NVMe ဆီ Clone လုပ်မယ်

`rpi-clone` ကို Run လိုက်တဲ့အခါ Destination Disk ကို Initialize လုပ်ပြီး Partition နဲ့ Filesystem တွေ ဖန်တီးပေးနိုင်တာကြောင့် NVMe အသစ်တစ်လုံးကို သီးသန့် Format ချထားစရာ မလိုဘူး။ ကျွန်တော့်စက်မှာတော့ အောက်က Command နဲ့ Clone လုပ်ခဲ့တယ်။

```bash
sudo rpi-clone nvme0n1
```

တခြား Destination တွေအတွက် Device Name ပေါ်မူတည်ပြီး အောက်ကလို သုံးလို့ရတယ်။

```bash
# microSD Card ကနေ external USB drive ဆီ
sudo rpi-clone sda

# external USB drive ကနေ internal microSD Card ဆီ
sudo rpi-clone mmcblk0
```

> ဒီ Command တွေထဲက `nvme0n1`၊ `sda` နဲ့ `mmcblk0` တွေက ဥပမာ Device Name တွေပဲ။ ကိုယ့်စက်ရဲ့ Destination Disk ကို `lsblk` နဲ့ စစ်ပြီးမှ Run သင့်တယ်။ `rpi-clone` က Destination Disk ကို ပြန်လည်ပြင်ဆင်မှာဖြစ်လို့ အဲဒီ Disk ထဲက ရှိပြီးသား Data တွေကို အရင် Backup လုပ်ထားရမယ်။

Clone လုပ်တဲ့ကြာချိန်က microSD Card ထဲမှာ သုံးထားတဲ့ Storage နဲ့ Card ရဲ့ Speed ပေါ်မူတည်တယ်။ ကျွန်တော့်မှာ Docker Image နဲ့ Volume တွေလည်း ရှိနေတာကြောင့် ၁၅ မိနစ်ကျော်လောက် ကြာသွားတယ်။

```text
Hit Enter when ready to unmount the /dev/nvme0n1 partitions ...
```

ဒီစာပေါ်လာရင် Enter နှိပ်ပြီး ဆက်လုပ်လို့ရပြီ။ Clone လုပ်ပြီးသွားတဲ့အခါ `rpi-clone` ကို မထားချင်တော့ရင် အောက်က Command နဲ့ ပြန်ဖယ်လို့ရတယ်။

```bash
sudo rm /usr/local/sbin/rpi-clone /usr/local/sbin/rpi-clone-setup
```

ဆက်သုံးချင်သေးရင်တော့ ဒီအတိုင်းထားလို့ရတယ်။ နောက်ပိုင်း Incremental Sync ပြန်လုပ်တဲ့အခါ ပထမအကြိမ်ထက် ပိုမြန်သွားမယ်။

## PCIe နဲ့ NVMe Boot ကို သတ်မှတ်မယ်

Official M.2 HAT+ လို HAT+ Specification နဲ့ ကိုက်ညီတဲ့ Adapter တွေကို Raspberry Pi OS က Auto-detect လုပ်နိုင်တယ်။ NVMe မပေါ်လာဘူးဆိုရင်တော့ `/boot/firmware/config.txt` ကို ဖွင့်ပြီး PCIe Connector ကို Enable လုပ်ကြည့်လို့ရတယ်။

```bash
sudo nano /boot/firmware/config.txt
```

ဖိုင်အောက်ဆုံးမှာ အောက်က Line ကို ထည့်လိုက်မယ်။ `dtparam=nvme` ကလည်း ဒီ Setting ရဲ့ Alias ပဲ။ နှစ်ကြောင်းလုံး တစ်ပြိုင်တည်းထည့်စရာ မလိုဘူး။

```ini
dtparam=pciex1
```

Raspberry Pi 5 က Default အနေနဲ့ PCIe Gen 2 (5 GT/s) သုံးတယ်။ Gen 3 (8 GT/s) သုံးချင်ရင် အောက်က Line ကို ထပ်ထည့်နိုင်တယ်။

```ini
dtparam=pciex1_gen=3
```

> Raspberry Pi 5 ကို PCIe Gen 3 Speed အတွက် Certification မလုပ်ထားတာကြောင့် NVMe နဲ့ Cable အချို့မှာ မတည်ငြိမ်တာ ဖြစ်နိုင်တယ်။ Error တက်တာ၊ Drive ပျောက်တာမျိုး ဖြစ်လာရင် `dtparam=pciex1_gen=3` ကို ပြန်ဖြုတ်ပြီး Default Gen 2 နဲ့ သုံးတာ ပိုစိတ်ချရတယ်။

ပြောင်းပြီးရင် Reboot လုပ်ကာ Link Speed ကို စစ်လို့ရတယ်။

```bash
sudo reboot
sudo lspci -vv | grep -A 20 -i 'Non-Volatile memory controller'
```

Result ထဲက `LnkSta` မှာ `Speed 8GT/s` လို့ ပြရင် Gen 3 Speed နဲ့ Link တက်နေပြီ။ `downgraded` ဆိုတဲ့စာ ပေါ်နေရုံနဲ့ Error ဖြစ်တယ်လို့ မဆိုလိုဘူး။ Device ရဲ့ Capability နဲ့ လက်ရှိ Link Width ကိုပါ တွဲကြည့်ဖို့လိုတယ်။

NVMe ကို Boot Priority ထဲ ထည့်ဖို့ အလွယ်ဆုံးနည်းက `raspi-config` သုံးတာပဲ။

```bash
sudo raspi-config
```

`Advanced Options` > `Boot Order` ထဲက NVMe ပါတဲ့ Boot Order ကို ရွေးပြီး `Finish` လုပ်ကာ Reboot ချလိုက်မယ်။

EEPROM Configuration ကို ကိုယ်တိုင်ပြင်ချင်ရင်တော့ အောက်က Command ကို သုံးနိုင်တယ်။

```bash
sudo rpi-eeprom-config --edit
```

```ini
BOOT_ORDER=0xf416
```

`BOOT_ORDER` ကို ညာဘက်ကနေ ဘယ်ဘက်သို့ ဖတ်တာဖြစ်လို့ `0xf416` က NVMe (`6`) ကို အရင်စမ်းပြီး၊ မရရင် SD Card (`1`) နဲ့ USB Mass Storage (`4`) ကို ဆက်စမ်းကာ နောက်ဆုံးမှာ ပြန်လည်စတင် (`f`) မယ့် အစီအစဉ်ပဲ။ Non-HAT+ Adapter သုံးထားရင်တော့ PCIe Device ကို Bootloader က ရှာနိုင်အောင် အောက်က Setting ကိုပါ ထည့်ဖို့လိုနိုင်တယ်။

```ini
PCIE_PROBE=1
```

Save လုပ်ပြီး Reboot ချလိုက်ရင် EEPROM Configuration အသစ် အသက်ဝင်လာမယ်။

## NVMe ကနေ Boot တက်နေတာ စစ်မယ်

Reboot ပြန်တက်လာပြီးနောက် Root Filesystem က NVMe ပေါ်မှာ ရှိ၊ မရှိ အရင်စစ်လိုက်မယ်။

```bash
findmnt /
findmnt /boot/firmware
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINTS
```

Root (`/`) နဲ့ `/boot/firmware` နှစ်ခုစလုံး NVMe Partition တွေဆီ ညွှန်နေတာ သေချာမှ microSD Card ကို ဖြုတ်သင့်တယ်။ စက်ဖွင့်ထားတုန်း Card ကို ဆွဲမဖြုတ်ဘဲ Power Off အရင်လုပ်တာ ပိုစိတ်ချရတယ်။

```bash
sudo poweroff
```

စက်ပိတ်သွားမှ microSD Card ကို ဖြုတ်ပြီး ပြန်ဖွင့်လိုက်တယ်။ NVMe တစ်ခုတည်းနဲ့ Boot တက်လာပြီဆိုရင် Migration အောင်မြင်ပြီ။ ဖြုတ်ထားတဲ့ microSD Card ကိုတော့ လိုအပ်တဲ့အချိန် ပြန်သုံးနိုင်အောင် Backup အဖြစ် သိမ်းထားလိုက်တယ်။

## အရင်နဲ့ အခု Storage အခြေအနေ

### အရင် - microSD Card

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/mmcblk0p2   29G   24G  3.1G  89% /
```

```text
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          37        25        8.17GB    1.057GB (12%)
Containers      29        29        14.13MB   0B (0%)
Local Volumes   16        15        3.005GB   544.3kB (0%)
Build Cache     40        0         1.095GB   1.766MB
```

နေရာလွတ် 3.1 GB ပဲရှိပြီး 89% အထိ သုံးထားတာဆိုတော့ System က တော်တော်ကျဉ်းကျပ်နေပြီ။

### အခု - NVMe SSD

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p2  468G   24G  421G   6% /
```

```text
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          37        25        8.17GB    1.057GB (12%)
Containers      29        29        14.13MB   0B (0%)
Local Volumes   16        15        3.005GB   544.3kB (0%)
Build Cache     40        0         1.095GB   1.766MB
```

| အချက် | microSD Card (အရင်) | NVMe SSD (အခု) |
|:---|:---|:---|
| Root Filesystem | `/dev/mmcblk0p2` | `/dev/nvme0n1p2` |
| စုစုပေါင်း Storage | 29 GB | 468 GB |
| အသုံးပြုထားမှု | 24 GB | 24 GB |
| နေရာလွတ် | 3.1 GB | 421 GB |
| အသုံးပြုမှု | 89% | 6% |
| Docker Images | 8.17 GB | 8.17 GB |
| Docker Volumes | 3.005 GB | 3.005 GB |

Clone လုပ်ထားတာဖြစ်လို့ Docker Image၊ Container နဲ့ Volume အရေအတွက်တွေက အရင်အတိုင်းပဲရှိပြီး Root Filesystem ရဲ့ နေရာလွတ်ကတော့ 3.1 GB ကနေ 421 GB အထိ တိုးသွားတယ်။ အခုဆို Storage ပြည့်မှာ စိုးရိမ်နေရတာ မရှိတော့ဘဲ နောက်ထပ် Project တွေကိုပါ အေးအေးဆေးဆေး Run လို့ရသွားတာကြောင့် တော်တော်လေး စိတ်ချမ်းသာသွားတယ်။
