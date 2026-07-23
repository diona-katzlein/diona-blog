---
title: "Kerentanan Baru 7-Zip: Arsip XZ Jahat Dapat Memicu Eksekusi Kode saat Ekstraksi"
description: "Pelajari celah keamanan heap-based buffer overflow (CVE-2026-14266) pada 7-Zip saat memproses arsip XZ dan cara memitigasinya dengan memperbarui ke versi 26.02."
image: "/assets/images/seven-zip-exploit.jpg"
author: "Diona Katzlein"
date: "2026-07-23"
category: "Cybersecurity"
tags: ["7zip", "vulnerability", "cve-2026-14266", "security", "exploit"]
slug: "kerentanan-baru-7-zip-arsip-xz-eksekusi-kode"
---

# Kerentanan Baru 7-Zip: Arsip XZ Jahat Dapat Memicu Eksekusi Kode saat Ekstraksi

Membuka berkas arsip berformat XZ yang telah dimanipulasi secara khusus di dalam aplikasi pengarsip populer **7-Zip** dapat memungkinkan penyerang mengeksekusi kode berbahaya pada komputer korban. Celah keamanan ini diidentifikasi sebagai **CVE-2026-14266** dan merupakan jenis kerentanan *heap-based buffer overflow* yang terletak pada cara program memproses data XZ terfragmentasi (*chunked data*).

Temuan ini dilaporkan oleh analis keamanan **Landon Peng** dari *Lunbun LLC* kepada pihak 7-Zip pada 5 Juni 2026. Selanjutnya, divisi *Zero Day Initiative (ZDI)* dari Trend Micro mempublikasikan rincian kerentanan ini melalui kode penasihat **ZDI-26-444** pada 15 Juli 2026. Untungnya, perbaikan resmi telah disediakan oleh pengembang dalam pembaruan **7-Zip versi 26.02** yang dirilis lebih awal pada 25 Juni 2026.

---

## 1. Analisis Dampak Kerentanan (CVE-2026-14266)

Menurut penasihat keamanan ZDI, kelebihan beban memori (*overflow*) ini memungkinkan penyerang untuk *"mengeksekusi kode berbahaya dalam konteks proses yang sedang berjalan saat ini"*. 

Berikut beberapa poin penting terkait batas dampak serangan ini:
*   **Hak Akses Terbatas**: Kode berbahaya yang disuntikkan akan berjalan menggunakan token hak akses yang sama dengan aplikasi 7-Zip yang sedang aktif. Kerentanan ini tidak memberikan eskalasi hak akses sistem (*privilege escalation*) secara otomatis.
*   **Keamanan di Windows**: Pada sistem operasi Windows, aplikasi 7-Zip yang dibuka secara normal akan berjalan di bawah token pengguna standar yang difilter (*filtered standard-user token*) oleh User Account Control (UAC)—sekalipun Anda login menggunakan akun administrator. Dengan demikian, penyerang hanya mewarisi hak akses pengguna biasa yang terbatas, kecuali jika pengguna sengaja menjalankan 7-Zip dengan hak akses administrator (*elevated/Run as administrator*).

---

## 2. Tingkat Keparahan dan Vektor Serangan

ZDI memberikan skor keparahan **7.0 (High)** untuk celah keamanan ini, bukan kategori *Critical* seperti yang sempat diberitakan oleh beberapa media. 

Vektor lengkap CVSS 3.0 dari kerentanan ini adalah:  
👉 **`AV:L/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H`**

*   **Local Attack Vector (AV:L)**: Celah ini merupakan vektor serangan lokal, artinya penyerang tidak dapat mengeksploitasi sistem secara langsung dari jarak jauh tanpa bantuan tindakan korban.
*   **User Interaction Required (UI:R)**: Eksploitasi hanya dapat berhasil jika korban dipancing untuk membuka berkas arsip XZ jahat secara manual—baik yang diterima melalui lampiran email, diunduh dari web, atau diberikan ke program 7-Zip lewat peramban.
*   **Attack Complexity High (AC:H)**: Kompleksitas serangan dinilai tinggi, membuat pembuatan kode eksploitasi (*exploit proof-of-concept*) yang andal dan konsisten di berbagai sistem menjadi lebih sulit dilakukan.

Hingga saat ini, belum ditemukan bukti konsep (*Proof-of-Concept* / PoC) publik yang beredar bebas, serta belum ada laporan tepercaya mengenai eksploitasi aktif di dunia nyata (*in the wild*).

---

## 3. Bedah Teknis Kode Sumber (Source Code Analysis)

Analisis perbandingan kode sumber antar-rilis menunjukkan bahwa perbaikan difokuskan pada satu fungsi tunggal, yaitu **`MixCoder_Code`** di dalam berkas **`C/XzDec.c`** (dekoder format XZ).

*   **Masalah Kode Lama**: Ketika aliran data (*stream*) XZ menyalurkan hasil outputnya melalui sebuah filter, dekoder secara keliru diberikan parameter panjang buffer output penuh pada setiap siklus pemrosesan (*pass*), alih-alih hanya memberikan sisa ruang buffer kosong setelah proses penulisan sebelumnya selesai. Hal ini memberikan ruang manipulasi memori yang lebih besar dari kapasitas fisik buffer yang tersedia, memicu kondisi penulisan di luar batas memori (*out-of-bounds write*).
*   **Perbaikan di Versi 26.02**: Kode baru secara aktif mengurangi jumlah byte yang telah berhasil ditulis dari total kapasitas buffer, dan secara otomatis mematikan proses (*bails out*) jika akumulasi total penulisan melebihi ukuran buffer yang aman.

Penanganan panjang buffer yang cacat ini dilaporkan telah ada di dalam kode sumber 7-Zip setidaknya sejak versi **21.07 (tahun 2021)**, meskipun belum ada konfirmasi resmi versi mana saja yang rentan dieksploitasi secara aktif sebelum versi 26.02.

---

## 4. Sejarah Bug Memori 7-Zip dan Langkah Mitigasi

CVE-2026-14266 adalah yang terbaru dari serangkaian kerentanan keamanan memori (*memory safety*) yang ditemukan pada pustaka penanganan format arsip milik 7-Zip. 

Sebelumnya, pada 27 April, 7-Zip versi 26.01 merilis perbaikan untuk beberapa celah keamanan, termasuk **CVE-2026-48095**—sebuah celah *heap-write overflow* pada penanganan sistem berkas NTFS yang dilaporkan oleh GitHub Security Lab bersama dengan kode *Proof-of-Concept* yang berfungsi. Karena versi 26.02 merangkum seluruh akumulasi perbaikan dari versi-versi sebelumnya, melakukan pembaruan ke versi 26.02 akan langsung menutup semua celah keamanan tersebut secara bersamaan.

### Langkah Mitigasi:
1.  **Lakukan Pembaruan Manual**: Segera unduh dan instal **7-Zip versi 26.02** atau yang lebih baru langsung dari situs web resmi mereka di **[7-zip.org](https://www.7-zip.org/download.html)**. Karena 7-Zip tidak memiliki sistem pembaruan otomatis di latar belakang, langkah pembaruan ini harus dilakukan secara manual pada setiap komputer.
2.  **Mitigasi Pihak Ketiga**: Jika Anda menggunakan aplikasi pihak ketiga yang menyertakan pustaka dekoder XZ milik 7-Zip di dalamnya, pastikan untuk memantau rilis pembaruan dari vendor aplikasi tersebut untuk menerapkan patch perbaikan yang sesuai.

*Pelajaran menarik dari kasus ini adalah patch perbaikan telah dirilis secara senyap oleh pengembang 20 hari sebelum rincian kerentanan dipublikasikan ke publik. Membiasakan diri melakukan pembaruan berkala akan melindungi sistem Anda lebih awal sebelum detail teknis kerentanan jatuh ke tangan peretas.*
