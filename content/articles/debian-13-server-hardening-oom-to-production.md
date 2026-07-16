---
title: "Debian Server Hardening: From OOM Killer to Production Ready"
date: 2026-07-17T04:39:56+06:30
author: heinhtetkyaw
image: images/server_hardening.webp
thumbnail_image: images/server_hardening.webp
description: "Debian Server တစ်လုံးမှာ MySQL OOM Killer ကြောင့် ပြိုကျနေတဲ့ ပြဿနာကနေ fail2ban, UFW, SSH Hardening အထိ အဆင့်ဆင့် ပြင်ဆင်ခဲ့ပုံ"
summary: "Memory 75% သုံးနေပြီး Swap မရှိတဲ့ Debian Server ကို MySQL Performance Schema ပိတ်၊ 1GB Swap ထည့်၊ fail2ban နဲ့ UFW တပ်ဆင်ပြီး Production Ready ဖြစ်အောင် ပြင်ဆင်ခဲ့ပုံ အဆင့်ဆင့်။"
categories: ["Linux", "System Administration", "Security"]
tags: ["Debian", "MySQL", "Security", "fail2ban", "UFW", "SSH", "Server Hardening"]
series: ["Debian Server Administration"]
keywords: ["debian server hardening", "mysql oom killer", "fail2ban setup", "ufw firewall", "ssh port change", "performance schema disable", "server security"]
slug: "debian-13-server-hardening-oom-to-production"
---

ဒီနေ့ ကျွန်တော် Debian Server တစ်လုံးကို Production အတွက် အဆင်သင့်ဖြစ်အောင် Hardening လုပ်ဖြစ်တယ်။ ဒီ Post မှာတော့ အစပိုင်းမှာ Memory 75% အထိ သုံးနေပြီး OOM Killer ကြောင့် MySQL ပြိုကျနေတဲ့ Server တစ်လုံးကို ဘယ်လို Debug လုပ်ခဲ့လဲ၊ ဘယ်လို Optimization တွေ လုပ်ခဲ့လဲ၊ ပြီးတော့ Security အတွက် fail2ban, UFW, SSH Hardening တွေ ဘယ်လို ပြင်ဆင်ခဲ့လဲဆိုတာကို အဆင့်ဆင့် ပြန်လည်မျှဝေသွားမှာပါ။

![Server Hardening](images/server_hardening.jpeg)

## ပြဿနာရဲ့ အစ - Memory ကျပ်နေတဲ့ System

Server ကို ပထမဆုံး SSH နဲ့ ဝင်လိုက်တာနဲ့ `system information` ကိုကြည့်လိုက်တယ်။

```text
System load:  0.4               Processes:             108
Usage of /:   40.1% of 8.65GB   Users logged in:       0
Memory usage: 75%               IPv4 address for ens6: 198.71.50.129
Swap usage:   0%
```

**Memory က 75% သုံးနေတယ်၊ Swap ကလည်း 0% ပဲ။** ဒီအခြေအနေမှာ စိုးရိမ်စရာကောင်းတဲ့ အချက်က Memory က 75% သုံးနေပေမယ့် Swap ကို လုံးဝအသုံးမပြုဘူး။ ဆိုလိုတာက Memory က ပြည့်နေပြီဆိုရင် System က Swap ကိုသုံးမှာမဟုတ်ဘဲ OOM Killer နဲ့ Process တွေကို သတ်ပစ်မယ်။

ဒါကြောင့် ပထမဆုံး ဘယ် Process တွေက Memory ကို ဒီလောက်သုံးနေလဲဆိုတာ စစ်ကြည့်တယ်။

```bash
ps aux --sort=-%mem | head -10
```

```text
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
mysql      31509  0.9 46.1 1329364 390420 ?      Ssl  09:10   1:25 /usr/sbin/mysqld
www-data   31470  0.0  4.7 232292 39972 ?        S    09:09   0:02 php-fpm: pool www
www-data   31395  0.0  4.0 232416 34640 ?        S    09:06   0:06 php-fpm: pool www
```

**MySQL က Memory ရဲ့ ၄၆% (၃၉၀ MB) ကို သုံးနေတယ်။** ဒါကြောင့် MySQL ရဲ့ Configuration ကို စစ်ကြည့်ဖို့ ဆုံးဖြတ်လိုက်တယ်။

---

## Debugging Phase 1 - MySQL Performance Schema ကို စစ်ဆေးခြင်း

MySQL မှာ Performance Schema ဆိုတဲ့ Feature ရှိတယ်။ ဒါက Database Performance ကို စောင့်ကြည့်ဖို့အတွက် သုံးတာပါ။ ဒါပေမယ့် ဒီ Feature က Memory ကို အတော်လေး စားတတ်တယ်။

```bash
mysql -e "SHOW VARIABLES LIKE 'performance_schema';"
```

```text
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| performance_schema | ON    |
+--------------------+-------+
```

ဟုတ်ပြီ... Performance Schema က ON ဖြစ်နေတယ်။ InnoDB Buffer Pool Size ကိုလည်း စစ်ကြည့်တယ်။

```bash
mysql -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size';"
```

```text
+-------------------------+-----------+
| Variable_name           | Value     |
+-------------------------+-----------+
| innodb_buffer_pool_size | 134217728 |
+-------------------------+-----------+
```

Buffer Pool က 128 MB ပဲသုံးထားတယ်။ ဒါကြောင့် Performance Schema က Memory ကို ပိုသုံးနေတာဖြစ်နိုင်တယ်။

ဒါကြောင့် Performance Schema ကို ပိတ်လိုက်တယ်။

```bash
echo "performance_schema = OFF" >> /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql
```

Restart ပြီးသွားတဲ့အခါ MySQL Memory ကို ပြန်စစ်ကြည့်တယ်။

```bash
ps aux | grep mysqld | grep -v grep
```

```text
mysql      34340  1.0 17.0 1102764 144316 ?      Ssl  11:54   0:05 /usr/sbin/mysqld
```

**၃၉၀ MB ကနေ ၁၄၄ MB ကို ကျသွားတယ်။ သက်သာသွားတာ ၂၅၀ MB ကျော်ပဲ။**

Memory ကိုလည်း ပြန်စစ်ကြည့်တယ်။

```bash
free -h
```

```text
               total        used        free      shared  buff/cache   available
Mem:           826Mi       526Mi       249Mi        24Mi       205Mi       299Mi
Swap:             0B          0B          0B
```

**Available Memory က ၉၇ MB ကနေ ၂၉၉ MB ကို ရောက်သွားတယ်။**

---

## Debugging Phase 2 - OOM Killer ရဲ့ သက်သေ

System Log တွေကို ပြန်ကြည့်တဲ့အခါ စိုးရိမ်စရာကောင်းတဲ့ အချက်တွေ တွေ့ရတယ်။

```bash
journalctl -p 3 -xb | grep -i "out of memory"
```

```text
Jun 17 08:17:58 ubuntu kernel: Out of memory: Killed process 14202 (mysqld) total-vm:1375692kB, anon-rss:423588kB
Jun 17 09:10:57 ubuntu kernel: Out of memory: Killed process 14667 (mysqld) total-vm:1339644kB, anon-rss:444792kB
```

**MySQL က OOM Killer ကြောင့် နှစ်ခါသေသွားဖူးတယ်။** ဒါက Memory ကျပ်လွန်းလို့ System က MySQL ကို သတ်ပစ်လိုက်တာ။

ဒီပြဿနာကို ကာကွယ်ဖို့ Swap File တစ်ခု ထည့်ပေးဖို့ ဆုံးဖြတ်လိုက်တယ်။

---

## Debugging Phase 3 - Swap File ထည့်ပေးခြင်း

System မှာ Swap လုံးဝမရှိတဲ့ အခြေအနေပါ။

```bash
cat /proc/meminfo | grep -E "^(SwapTotal|SwapFree)"
```

```text
SwapTotal:             0 kB
SwapFree:              0 kB
```

ဒါကြောင့် 1GB Swap File တစ်ခု ဖန်တီးလိုက်တယ်။

```bash
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

ပြီးရင် Swap ကို စစ်ကြည့်တယ်။

```bash
swapon --show
```

```text
NAME      TYPE  SIZE USED PRIO
/swapfile file 1024M   0B   -2
```

Swap ကို ထည့်ပေးလိုက်တာနဲ့ Memory ပိုပြီး လုံခြုံသွားတယ်။ OOM Killer ပြန်ဖြစ်တဲ့အခါ Swap က ကြားခံအနေနဲ့ လုပ်ဆောင်ပေးမယ်။

---

## Debugging Phase 4 - Security Audit စတင်ခြင်း

Memory ပြဿနာ ပြေလည်သွားပြီဆိုတော့ Security ဘက်ကို လှည့်ကြည့်လိုက်တယ်။

ပထမဆုံး SSH Configuration ကို စစ်ကြည့်တယ်။

```bash
grep "^PermitRootLogin" /etc/ssh/sshd_config
```

```text
PermitRootLogin yes
```

**Root SSH Login က `yes` ဖြစ်နေတယ်။** ဒါက Public Server တစ်လုံးအတွက် အန္တရာယ်ကြီးတယ်။

ဒါကြောင့် Root Login ကို ပိတ်လိုက်တယ်။

```bash
sed -i 's/^PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl reload ssh
```

ပြီးတော့ Admin User အသစ်တစ်ယောက် ဖန်တီးလိုက်တယ်။

```bash
adduser admin --ingroup admin
usermod -aG sudo admin
passwd admin
```

---

## Debugging Phase 5 - fail2ban နဲ့ UFW Firewall တပ်ဆင်ခြင်း

SSH Log တွေကို ပြန်ကြည့်တဲ့အခါ Brute Force Attack တွေ ဝင်နေတာကို တွေ့ရတယ်။

```bash
tail -20 /var/log/auth.log
```

```text
Jun 17 11:52:42 ubuntu sshd[34221]: Invalid user cloud from 45.156.87.166 port 38286
Jun 17 11:52:48 ubuntu sshd[34223]: Invalid user user from 45.156.87.166 port 52798
Jun 17 12:01:49 ubuntu sshd[34615]: Failed password for root from 91.92.40.45 port 64982
Jun 17 12:01:52 ubuntu sshd[34627]: Invalid user media from 45.156.87.166 port 57882
```

**Attacker တွေက နေရာစုံကနေ လာပြီး Brute Force လုပ်နေတယ်။** (IP: 45.156.87.166, 91.92.40.45, 103.250.11.116)

ဒါကြောင့် fail2ban ကို Install လုပ်လိုက်တယ်။

```bash
apt install fail2ban -y
systemctl enable fail2ban --now
```

fail2ban ကို Configure လုပ်ပြီး SSH အတွက် သတ်မှတ်လိုက်တယ်။

```bash
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200
EOF

systemctl restart fail2ban
```

fail2ban ကို စစ်ကြည့်တယ်။

```bash
fail2ban-client status sshd
```

```text
Status for the jail: sshd
|- Filter
|  |- Currently failed:	4
|  |- Total failed:	254
`- Actions
   |- Currently banned:	4
   |- Total banned:	4
   `- Banned IP list:	45.156.87.166 189.162.62.158 91.92.40.45 103.250.11.116
```

**Attacker ၄ ယောက်ကို စတင်ပိတ်ဆို့နေပြီ။**

ပြီးရင် UFW Firewall ကို တပ်ဆင်လိုက်တယ်။

```bash
apt install ufw -y
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

UFW ကို စစ်ကြည့်တယ်။

```bash
ufw status verbose
```

```text
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

---

## Debugging Phase 6 - SSH Port ပြောင်းလဲခြင်း

Default Port 22 က အန္တရာယ်များတာမို့ Port 2222 ကို ပြောင်းလိုက်တယ်။

```bash
sed -i 's/^#Port 22/Port 2222/' /etc/ssh/sshd_config
systemctl reload ssh
```

ပြီးရင် Firewall မှာ Port 2222 ကို ဖွင့်ပေးပြီး Port 22 ကို ပိတ်လိုက်တယ်။

```bash
ufw allow 2222/tcp
ufw delete allow 22/tcp
ufw status
```

```text
Status: active
To                         Action      From
--                         ------      ----
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
2222/tcp                   ALLOW       Anywhere
```

**အရေးကြီး** - Port မပြောင်းခင်မှာ နောက် Terminal တစ်ခုကနေ SSH ဝင်လို့ရမရ စမ်းသပ်ပြီးမှ Port 22 ကို ဖြုတ်လိုက်တယ်။

---

## Debugging Phase 7 - မလိုအပ်တဲ့ Service တွေကို ရပ်ခြင်း

System ထဲမှာ မလိုအပ်တဲ့ Service တွေကိုလည်း ရှင်းထုတ်လိုက်တယ်။

```bash
systemctl stop multipathd
systemctl disable multipathd
```

multipathd က SAN Storage မသုံးတဲ့ ဒီ Server အတွက် မလိုအပ်တဲ့ Service ပါ။

---

## Debugging Phase 8 - Kernel Update နဲ့ Reboot

System ကို ပြန်စစ်ကြည့်တဲ့အခါ Kernel Update ရှိနေတာကို တွေ့ရတယ်။

```bash
cat /proc/version
```

```text
Linux version 6.8.0-117-generic
```

ဒါပေမယ့် Available Kernel က 6.8.0-124 ဖြစ်နေတယ်။ ဒါကြောင့် Reboot ချပြီး Kernel အသစ်ကို သွင်းလိုက်တယ်။

```bash
reboot
```

Reboot ပြီးသွားတဲ့အခါ System Information ကို ပြန်စစ်ကြည့်တယ်။

```text
System information as of Wed Jun 17 12:33:34 UTC 2026

  System load:  0.36              Processes:             106
  Usage of /:   51.4% of 8.65GB   Users logged in:       0
  Memory usage: 45%               IPv4 address for ens6: 198.71.50.129
  Swap usage:   3%
```

**Memory Usage ၇၅% ကနေ ၄၅% ကို ကျသွားတယ်။**
**Swap က ၀% ကနေ ၃% ကို ရောက်သွားတယ် (အဆင်ပြေတဲ့ အခြေအနေ)။**

---

## Final Verification - အားလုံး အဆင်ပြေကြောင်း စစ်ဆေးခြင်း

### ၁။ Service အားလုံး Running ဖြစ်နေလား စစ်ဆေးခြင်း

```bash
systemctl status ssh ufw fail2ban mysql nginx php8.3-fpm
```

```text
● ssh.service - OpenBSD Secure Shell server
     Active: active (running) since Wed 2026-06-17 12:17:21 UTC
     Server listening on 0.0.0.0 port 2222.

● ufw.service - Uncomplicated firewall
     Active: active (exited) since Wed 2026-06-17 12:08:55 UTC

● fail2ban.service - Fail2Ban Service
     Active: active (running) since Wed 2026-06-17 12:09:01 UTC

● mysql.service - MySQL Community Server
     Active: active (running) since Wed 2026-06-17 12:09:07 UTC
     Memory: 203.0M (peak: 215.0M)

● nginx.service - A high performance web server
     Active: active (running) since Wed 2026-06-17 12:09:04 UTC

● php8.3-fpm.service - The PHP 8.3 FastCGI Process Manager
     Active: active (running) since Wed 2026-06-17 12:09:03 UTC
```

### ၂။ fail2ban ကို စစ်ဆေးခြင်း

```bash
fail2ban-client status sshd
```

```text
Status for the jail: sshd
|- Filter
|  |- Currently failed:	0
|  |- Total failed:	0
`- Actions
   |- Currently banned:	1
   |- Total banned:	2
   `- Banned IP list:	45.156.87.166
```

### ၃။ UFW ကို စစ်ဆေးခြင်း

```bash
ufw status
```

```text
Status: active
To                         Action      From
--                         ------      ----
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
2222/tcp                   ALLOW       Anywhere
```

### ၄။ Memory ကို စစ်ဆေးခြင်း

```bash
free -h
```

```text
               total        used        free      shared  buff/cache   available
Mem:           826Mi       505Mi        75Mi        22Mi       395Mi       321Mi
Swap:          1.0Gi          0B       1.0Gi
```

---

## သင်ခန်းစာများနဲ့ အနှစ်ချုပ်

ဒီနေ့ လုပ်ခဲ့တဲ့ အဆင့်တွေကနေ သင်ခန်းစာ သုံးချက် ရခဲ့တယ်။

၁။ **Performance Schema က Memory Hog ပါ။** MySQL သုံးတဲ့ Server တိုင်းမှာ မလိုအပ်ရင် ပိတ်ထားသင့်တယ်။ ဒီတစ်ခါ ပိတ်လိုက်တာနဲ့ Memory ၂၅၀ MB ကျော် သက်သာသွားတယ်။

၂။ **Swap က အသက်ကယ်ပါ။** OOM Killer ကနေ System ကို ကာကွယ်ဖို့ Swap ထည့်ပေးတာ မဖြစ်မနေလုပ်သင့်တယ်။ MySQL က OOM Killer ကြောင့် နှစ်ခါသေသွားဖူးတယ်။

၃။ **Security က Layer-by-Layer လုပ်ရမယ်။** Firewall တစ်ခုတည်းနဲ့ မလုံလောက်ဘူး။
   - Root SSH Login ကို ပိတ်မယ်
   - SSH Port ကို ပြောင်းမယ် (22 → 2222)
   - fail2ban နဲ့ Brute Force ကို ပိတ်ဆို့မယ်
   - UFW နဲ့ Firewall ထောင်မယ်

ဒီအဆင့်တွေ အကုန်လုံးကို ပေါင်းစပ်သုံးမှ စိတ်ချရတဲ့ Server တစ်လုံး ဖြစ်လာမယ်။

### Final System Status

| Metric | Before | After |
|--------|--------|-------|
| **Memory Usage** | 75% | 45% |
| **Available Memory** | 97 MB | 321 MB |
| **MySQL Memory** | 390 MB (46%) | 164 MB (19%) |
| **Swap** | None | 1 GB |
| **Root SSH** | Enabled | Disabled |
| **SSH Port** | 22 | 2222 |
| **Firewall** | None | UFW Active |
| **fail2ban** | None | Active (2 banned) |
| **Kernel** | 6.8.0-117 | 6.8.0-124 |

---

## Notes

- Performance Schema ကို ပိတ်လိုက်တာက MySQL Monitoring ကို ထိခိုက်စေနိုင်တယ်။ ဒါပေမယ့် ဒီ Server အတွက်တော့ ဒီထက် ပိုကောင်းတဲ့ Monitoring Tool တွေ ရှိပြီးသားမို့ ပြဿနာမရှိဘူး။
- fail2ban ကို Configure လုပ်တဲ့အခါ `bantime` ကို ၂ နာရီထားတယ်။ ဒါက Attacker တွေကို အချိန်အတော်ကြာ ပိတ်ဆို့ထားဖို့ပါ။
- UFW ကို Default Deny အနေနဲ့ သတ်မှတ်ထားတယ်။ ဒါက မလိုအပ်တဲ့ Port တွေကို အလိုအလျောက် ပိတ်ထားပေးတယ်။

ဒီလောက်ဆိုရင်တော့ ဒီ Server ဟာ Production အတွက် အဆင်သင့်ဖြစ်သွားပြီပဲ ဖြစ်တယ်။

- Website Application တင်ထားတဲ့ Server ဖြစ်တဲ့အလျောက် ပြင်သင့်တာတွေ လိုက်ပြင်ရတော့တာပါပဲ။
- ဘာကြောင့်လဲဆိုတော့ ကိုယ်တိုင် ဝင်ဖို့ကိုတောင် သူက Memory Usage အရမ်းများပြီးတော့ tunnel ကိုပါ ပိတ်ချပြီး ဟမ်းနေတဲ့အတွက်ကြောင့် အရေးပေါ် configuration လုပ်ရင်းနဲ့ မှတ်တမ်းလေးအဖြစ်ရေးရင်း။ ။
