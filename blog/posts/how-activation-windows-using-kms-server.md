---
title: "Cara Aktivasi Windows 10 & 11 Menggunakan KMS Server"
description: "Panduan lengkap aktivasi Windows 10 dan Windows 11 secara resmi menggunakan KMS client key (GVLK) dan server KMS lokal via Command Prompt (CMD)."
image: "/assets/images/kms-activation.png"
author: "Diona Katzlein"
date: "2026-06-15"
category: "Tutorial"
tags: ["windows", "kms", "cmd", "sysadmin"]
slug: "how-activation-windows-using-kms-server"
---

# Cara Aktivasi Windows 10 & 11 Menggunakan KMS Server

Mendeploy sistem operasi Windows di lingkungan institusi, kantor, atau lab komputer membutuhkan manajemen lisensi yang efisien. Microsoft menyediakan solusi resmi bernama **KMS (Key Management Service)** untuk mengaktivasi komputer dalam jaringan lokal secara otomatis tanpa perlu menghubungi server aktivasi Microsoft secara langsung.

Dalam panduan ini, kita akan membahas langkah demi langkah cara mengaktivasi **Windows 10** dan **Windows 11** menggunakan KMS Client Key resmi dari Microsoft (dikenal sebagai GVLK) dan menghubungkannya ke server KMS lokal melalui **Command Prompt (CMD)**.

---

## Apa itu KMS (Key Management Service)?

**KMS** adalah teknologi aktivasi volume (volume activation) yang dirancang untuk mengizinkan organisasi mengaktivasi sistem operasi Windows dan produk Office di dalam jaringan lokal mereka sendiri. 
- **Masa Aktif**: Lisensi yang diaktivasi lewat KMS berlaku selama **180 hari** (6 bulan).
- **Auto-Renewal**: Komputer klien akan otomatis mencoba menghubungi server KMS setiap 7 hari sekali untuk memperbarui masa aktif lisensi kembali ke 180 hari. Selama komputer terhubung ke jaringan lokal yang memiliki server KMS aktif, Windows Anda akan tetap aktif selamanya.

---

## Prasyarat: Daftar KMS Client Product Keys (GVLK)

Untuk mengaktivasi Windows melalui KMS, komputer Anda harus menggunakan kunci produk volume generik (GVLK - Generic Volume License Key). Berikut adalah daftar KMS Client Product Keys resmi dari Microsoft untuk Windows 10 dan Windows 11:

### Windows 10 & 11 Pro
- **Kunci Pro**: `W269N-WFGWX-YVC9B-4J6C9-T83GX`
- **Kunci Pro N**: `MH7W7-BMC3R-4W9XT-94B6D-TCQG3`

### Windows 10 & 11 Home
- **Kunci Home**: `TX9XD-98N7V-6WMQ6-BX7FG-H8Q99`
- **Kunci Home Single Language**: `7HNRX-D7KGG-3K4RQ-4WPJ4-YTDFH`

### Kunci RTM / Retail (Referensi Cadangan)
- **Windows 10/11 Pro (RTM)**: `VK7JG-NPHTM-C97JM-9MPGT-3V66T`
- **Windows 10/11 Home (RTM)**: `YTMG3-N6KP1-8B4HP-K635Q-GBXHY`

---

## Langkah demi Langkah Aktivasi Windows via CMD

Ikuti langkah-langkah di bawah ini secara berurutan. Pastikan Anda memiliki koneksi internet atau terhubung ke jaringan lokal KMS.

### Langkah 1: Buka Command Prompt sebagai Administrator
1. Klik tombol **Start** atau tekan tombol **Windows** di keyboard.
2. Ketik `cmd` atau `Command Prompt`.
3. Klik kanan pada aplikasi Command Prompt lalu pilih **Run as administrator**.

### Langkah 2: Memasang Kunci Produk KMS (GVLK)
Jalankan perintah berikut untuk memasang kunci produk generik sesuai edisi Windows Anda (ganti `<LISENSI_KEY>` dengan kunci produk di atas):

```cmd
slmgr /ipk <LISENSI_KEY>
```

**Contoh (Untuk Windows 10/11 Pro):**
```cmd
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
```
*Perintah ini akan mengganti lisensi lama di komputer Anda dengan KMS Client Key.*

### Langkah 3: Menentukan Server KMS Tujuan
Selanjutnya, arahkan komputer klien agar menghubungi server KMS Anda. Jalankan salah satu perintah berikut:

```cmd
slmgr /skms kms1.readme.id
```
atau
```cmd
slmgr /skms kms2.readme.id
```
*Perintah ini bertugas mengonfigurasi alamat server KMS yang digunakan untuk melakukan validasi aktivasi.*

### Langkah 4: Melakukan Aktivasi Windows
Jalankan perintah terakhir ini untuk memicu proses aktivasi langsung ke server KMS yang sudah ditentukan:

```cmd
slmgr /ato
```
*Tunggu beberapa detik hingga kotak dialog Windows Script Host muncul yang menunjukkan pesan sukses seperti "Product activated successfully".*

---

## Perintah Tambahan (Manajemen Lisensi)

Berikut adalah beberapa perintah bermanfaat lainnya yang sering digunakan oleh System Administrator:

### 1. Memeriksa Masa Aktif Lisensi
Untuk mengetahui status aktivasi dan sisa masa aktif lisensi Windows Anda, jalankan perintah:
```cmd
slmgr /xpr
```
*Kotak dialog akan menampilkan informasi tanggal kedaluwarsa lisensi KMS.*

### 2. Menghapus Kunci Produk (Uninstall)
Jika Anda ingin menghapus kunci produk yang terpasang saat ini dari sistem operasi Windows:
```cmd
slmgr /upk
```

### 3. Menjalankan Perintah Tanpa Dialog Box (Quiet Mode)
Gunakan parameter `//b` agar eksekusi script berjalan di latar belakang tanpa memunculkan kotak notifikasi grafis (pop-up). Sangat berguna untuk script otomasi batch:
```cmd
slmgr //b /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
```

---

## Informasi Tambahan & Kebijakan Lisensi

Aktivasi menggunakan server KMS ditujukan khusus untuk keperluan volume licensing dalam skala bisnis, edukasi, atau organisasi berlisensi resmi. Jika Anda menggunakannya secara personal atau untuk tujuan komersial di luar lingkup lisensi volume resmi Microsoft, kami sangat menyarankan untuk membeli **Kunci Produk Retail Original** secara resmi di toko retail berlisensi guna mendukung kelanjutan pengembangan software dan kepatuhan hukum yang berlaku.
