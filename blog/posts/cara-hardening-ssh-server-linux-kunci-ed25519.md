---
title: "Cara Hardening SSH di Server Linux: Nonaktifkan Login Password, Pakai Kunci Ed25519"
description: "Panduan hardening SSH di Debian/Ubuntu: login pakai kunci Ed25519, matikan password authentication, batasi user, dan pasang Fail2ban agar brute force langsung diblokir."
author: "Duscha Olya Arta Anas"
date: "2026-11-15"
category: "Tutorial"
tags: ["ssh", "hardening", "linux", "ed25519", "fail2ban", "server"]
slug: "cara-hardening-ssh-server-linux-kunci-ed25519"
---

# Cara Hardening SSH di Server Linux: Nonaktifkan Login Password, Pakai Kunci Ed25519

SSH adalah pintu utama ke server Linux — dan pintu yang paling sering diketuk penyerang. Bot brute force memindai internet 24 jam, mencoba ribuan kombinasi username dan password ke port 22. Kalau server Anda masih mengizinkan login password, itu hanya soal waktu sampai ada yang berhasil menebak, apalagi kalau passwordnya lemah atau dipakai ulang.

Panduan ini merangkum langkah hardening SSH yang kami terapkan di server sendiri: kunci Ed25519, matikan password authentication, batasi user, dan Fail2ban sebagai jaring pengaman terakhir. Semua perintah diuji di Debian dan Ubuntu.

## 1. Buat Kunci Ed25519 di Komputer Anda

Jangan buat kunci di server — buat di laptop/komputer yang Anda pakai sehari-hari:

```bash
ssh-keygen -t ed25519 -C "nama-anda@laptop"
```

Saat ditanya passphrase, isi dengan frasa yang kuat. Passphrase ini lapisan kedua: kalaupun file kunci dicuri, penyerang tetap butuh passphrase Anda. Simpan private key (`~/.ssh/id_ed25519`) baik-baik dan **jangan pernah dibagikan ke siapa pun**.

## 2. Salin Kunci Publik ke Server

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@alamat-server
```

Perintah ini menambahkan kunci publik Anda ke `~/.ssh/authorized_keys` di server. Uji dulu login dengan kunci — masih dengan password authentication aktif — sebelum melangkah lebih jauh:

```bash
ssh -i ~/.ssh/id_ed25519 user@alamat-server
```

Kalau berhasil masuk tanpa diminta password server, kunci sudah bekerja.

## 3. Matikan Login Password di `sshd_config`

Buka `/etc/ssh/sshd_config` dengan sudo, lalu pastikan baris-baris ini:

```
PubkeyAuthentication yes
PasswordAuthentication no
ChallengeResponseAuthentication no
PermitRootLogin prohibit-password
MaxAuthTries 3
AllowUsers user
```

Penjelasan singkat:

- `PasswordAuthentication no` — ini inti hardeningnya. Tanpa password, brute force password jadi mustahil.
- `PermitRootLogin prohibit-password` — root hanya boleh login dengan kunci, bukan password.
- `MaxAuthTries 3` — setelah 3 kali gagal, koneksi diputus.
- `AllowUsers user` — hanya user yang disebut yang boleh login via SSH. Ganti `user` dengan username Anda.

**Peringatan penting:** sebelum me-reload, buka satu sesi SSH kedua dan biarkan tetap tersambung. Kalau ada salah ketik di konfigurasi, Anda masih punya jalan masuk untuk memperbaiki. Baru kemudian:

```bash
sudo sshd -t && sudo systemctl reload sshd
```

`sshd -t` menguji sintaks konfigurasi. Kalau tidak ada error, reload aman.

## 4. (Opsional) Pindah Port SSH

Mengganti port bawaan 22 ke port lain (misal 2222) tidak membuat server "aman" dengan sendirinya — port scanning tetap menemukannya — tapi sangat mengurangi kebisingan log dari bot yang hanya memindai port 22:

```
Port 2222
```

Jangan lupa buka port baru di firewall sebelum reload:

```bash
sudo ufw allow 2222/tcp
sudo ufw allow OpenSSH
```

## 5. Pasang Fail2ban

Fail2ban memantau log dan memblokir IP yang terlalu banyak gagal login:

```bash
sudo apt install fail2ban -y
sudo systemctl enable --now fail2ban
```

Buat `/etc/fail2ban/jail.local`:

```ini
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 3600
```

Artinya: 3 kali gagal dalam 10 menit → diblokir 1 jam. Cek statusnya dengan `sudo fail2ban-client status sshd`. Di server kami, aturan seperti ini memblokir ratusan percobaan brute force per hari — tanpa kami harus mengawasi log manual.

## 6. Tambahan: Batasi Akses Lewat Firewall

Kalau Anda hanya mengakses server dari jaringan tertentu (misal IP kantor atau VPN), batasi SSH di firewall ke sumber itu saja. Ini jauh lebih kuat daripada sekadar ganti port:

```bash
sudo ufw allow from 203.0.113.0/24 to any port 22 proto tcp
```

Ganti `203.0.113.0/24` dengan jaringan Anda sendiri. Untuk akses dari mana saja dengan aman, kombinasikan dengan VPN — kami memakai WireGuard di MikroTik untuk mengakses server lokal dari luar, panduannya ada di artikel [Cara Setting WireGuard di MikroTik](/blog/cara-setting-wireguard-mikrotik-akses-server-lokal.html).

## Checklist Setelah Hardening

1. Login dengan kunci berhasil, login dengan password ditolak.
2. `sudo sshd -t` bersih, tidak ada error.
3. Fail2ban aktif dan sudah memblokir percobaan gagal.
4. Backup `sshd_config` tersimpan sebelum perubahan.
5. Anda masih punya akses konsol (VNC/panel cloud) sebagai jalan darurat.

SSH yang sudah di-hardening bukan berarti boleh dilupakan — periksa log sesekali, perbarui paket OpenSSH saat ada patch keamanan, dan putar kunci bila laptop Anda hilang. Tapi dengan password authentication dimatikan, serangan paling umum di internet — brute force password — sudah tertutup rapat.

Baca juga: [Kenalan dengan Info Stealer, Virus Pencuri Data](/blog/kenalan-info-stealer-virus-pencuri-data.html) — pencurian kredensial adalah alasan lain kenapa password saja tidak pernah cukup.
