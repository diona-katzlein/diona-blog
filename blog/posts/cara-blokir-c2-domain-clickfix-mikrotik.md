---
title: "Panduan Memblokir C2 dan Domain Malware ClickFix di MikroTik"
description: "Pelajari cara mengonfigurasi firewall filter, Layer 7 protocols, dan DNS sinkhole pada MikroTik RouterOS untuk memblokir aktivitas malware ClickFix."
image: "/assets/images/mikrotik-clickfix-block.png"
author: "Diona Katzlein"
date: "2026-07-04"
category: "Tutorial"
tags: ["mikrotik", "firewall", "routeros", "security", "clickfix"]
slug: "cara-blokir-c2-domain-clickfix-mikrotik"
---

# Panduan Memblokir C2 dan Domain Malware ClickFix di MikroTik

Kampanye malware **ClickFix** yang menyamar sebagai verifikasi CAPTCHA Cloudflare palsu menuntut pertahanan yang kokoh di tingkat jaringan. Selain mengandalkan perlindungan pada komputer klien (*endpoint protection*), Administrator Jaringan juga dapat melakukan blokir keras (*hard-block*) pada router gateway untuk mencegah malware mengunduh muatannya atau berkomunikasi dengan server kontrolnya (C2 - Command & Control).

Dalam artikel ini, kita akan membahas cara mengonfigurasi **MikroTik RouterOS** menggunakan aturan firewall filter, Layer 7 protocol, DNS poisoning, hingga pertahanan tingkat lanjut (*advanced protection*) untuk meredam ancaman ClickFix.

---

## 1. Sasaran Pemblokiran (Objective Blocking)

Tujuan utama konfigurasi ini adalah memutus komunikasi pada jalur-jalur berikut:
1.  **Domain Phishing & C2**: Memblokir akses ke domain `openaaii.com` (typosquatting) dan `integercdn.com` (host payload tahap kedua).
2.  **IP Server C2**: Memblokir alamat IP C2 aktif (`178.16.53.50`).
3.  **Pola Serangan (L7)**: Memblokir pertukaran data yang mengandung pola perintah eksekusi berbahaya seperti `base64 -d` atau `curl -fsSL`.

---

## 2. Script MikroTik (Firewall Layer Blocking)

Silakan salin dan sesuaikan perintah RouterOS di bawah ini ke dalam Terminal MikroTik Anda. Konfigurasi ini dirancang agar siap digunakan pada lingkungan enterprise (*enterprise-ready*).

### LANGKAH 1 — Daftarkan Alamat IP & Domain (Address List)
Kita kumpulkan semua target blokir ke dalam satu daftar alamat (*address list*) agar proses pemfilteran lebih efisien.
```routeros
/ip firewall address-list
add list=malware-c2 address=openaaii.com comment="Fake Cloudflare phishing"
add list=malware-c2 address=integercdn.com comment="Stage2 payload host"
add list=malware-c2 address=178.16.53.50 comment="Observed C2 IP"
```

### LANGKAH 2 — Definisikan Pola Payload (Layer 7 Protocol)
Layer 7 protocol membantu mendeteksi teks perintah berbahaya di dalam paket HTTP.
```routeros
/ip firewall layer7-protocol
add name=clickfix-l7 regexp="(openaaii|integercdn|base64 -d|curl -fsSL)"
```

### LANGKAH 3 — Buat Aturan Filter Drop (Firewall Filter)
Terapkan aturan pemblokiran lalu lintas data (*drop*) pada rantai *forward* untuk paket yang cocok dengan daftar IP atau pola Layer 7 di atas.
```routeros
/ip firewall filter
add chain=forward action=drop src-address-list=malware-c2 comment="Block known malware C2"
add chain=forward action=drop dst-address-list=malware-c2 comment="Block traffic to malware C2"
add chain=forward action=drop layer7-protocol=clickfix-l7 comment="Block ClickFix payload patterns"
```

### LANGKAH 4 — DNS Poisoning / Sinkhole (Opsional)
Jika router MikroTik Anda berfungsi sebagai DNS resolver lokal bagi klien, Anda dapat mengarahkan domain berbahaya ke alamat localhost (`127.0.0.1`) agar domain tersebut tidak dapat di-resolve.
```routeros
/ip dns static
add name=openaaii.com address=127.0.0.1 comment="Sinkhole ClickFix"
add name=integercdn.com address=127.0.0.1 comment="Sinkhole ClickFix"
```

### LANGKAH 5 — DNS Filtering via Firewall
Jika klien menggunakan DNS eksternal, kita bisa langsung membuang (*drop*) paket query DNS (Port 53 UDP) yang memuat string domain berbahaya.
```routeros
/ip firewall filter
add chain=forward protocol=udp dst-port=53 content="openaaii" action=drop comment="Block DNS query for openaaii"
add chain=forward protocol=udp dst-port=53 content="integercdn" action=drop comment="Block DNS query for integercdn"
```

---

## 3. Aturan Proteksi Lanjutan (Advanced Protection)

### Memblokir Perilaku PowerShell/CMD Downloader
Karena serangan ClickFix digerakkan oleh pengguna (*user-triggered*) dengan memicu perintah terminal, Anda dapat memblokir paket data di jaringan yang memuat perintah download PowerShell/CMD (Sangat disarankan pada jaringan dengan tingkat keamanan ketat).

```routeros
/ip firewall filter
add chain=forward content="powershell" action=drop comment="Block PowerShell download chain"
add chain=forward content="cmd.exe" action=drop comment="Block CMD download chain"
add chain=forward content="base64" action=drop comment="Block encoded payload stage"
```
> [!WARNING]
> **Peringatan**:
> Aturan ini bersifat agresif. Pada lingkungan pengembangan perangkat lunak (*developer environment*), aturan ini dapat menyebabkan kesalahan deteksi (*false positive*) pada aktivitas transfer data yang sah.

### Pemblokiran Berbasis TLS Host (Connection Tracking)
Untuk koneksi HTTPS baru (Port 443), kita dapat menyaring SNI (*Server Name Indication*) TLS sebelum koneksi terenkripsi terbentuk sepenuhnya.
```routeros
/ip firewall filter
add chain=forward connection-state=new protocol=tcp dst-port=80,443 tls-host=*integercdn* action=drop comment="Block TLS connection to integercdn"
add chain=forward connection-state=new protocol=tcp dst-port=80,443 tls-host=*openaaii* action=drop comment="Block TLS connection to openaaii"
```

---

## 4. Mode Darurat: "One-Liner Emergency Lockdown"

Jika Anda mendeteksi adanya infeksi aktif di jaringan lokal Anda dan membutuhkan penanganan darurat instan, jalankan perintah satu baris berikut untuk memutus akses payload ClickFix secara menyeluruh:

```routeros
/ip firewall filter add chain=forward action=drop content="integercdn" comment="EMERGENCY LOCKDOWN CLICKFIX"
/ip firewall filter add chain=forward action=drop content="openaaii" comment="EMERGENCY LOCKDOWN CLICKFIX"
```

---

## 5. Peningkatan Skala Enterprise (SOC-Level)

Untuk perlindungan skala besar yang lebih komprehensif (Security Operations Center / SOC):
*   **DNS Sinkhole Terdedikasi**: Gunakan **Pi-hole** atau **AdGuard Home** yang dikonfigurasi dengan bloklist siber yang diperbarui secara otomatis.
*   **Suricata/Snort IDS/IPS**: Jalankan deteksi intrusi inline untuk menganalisis lalu lintas data dari ancaman malware loader secara real-time.
*   **Syslog ke ELK Stack**: Arahkan log firewall MikroTik ke server pengumpul log (seperti ELK atau Graylog) untuk mendeteksi anomali akses C2 secara terpusat.
*   **Script Cron Auto-Update**: Buat script scheduler di MikroTik untuk mengunduh daftar hitam IP malware secara otomatis dari penyedia feed siber tepercaya.

---

## Catatan Penting untuk Administrator

*   **Batasan Layer 7**: Penerapan regex Layer 7 pada MikroTik RouterOS v7 memiliki keterbatasan performa CPU pada lalu lintas data yang padat. Pemblokiran menggunakan **DNS static/DNS filter** dan **Address List** jauh lebih ringan dan direkomendasikan untuk jangka panjang.
*   **Rotasi Domain C2**: Pelaku dapat dengan cepat merotasi nama domain mereka. Selalu lakukan pembaruan berkala pada daftar *address list* Anda.
*   **Pertahanan Berlapis**: Pemblokiran di tingkat jaringan tidak 100% menjamin keamanan jika malware diunduh dari jaringan luar (misal paket data seluler). Proteksi pada tingkat pengguna (*endpoint protection*) dan edukasi siber tetap menjadi garis pertahanan utama.
