---
title: "Power Query Excel: Membersihkan Data Berantakan Tanpa Rumus Rumit"
description: "Panduan Power Query di Excel: ubah data berantakan (duplikat, spasi, format tanggal campur) jadi tabel rapi yang bisa di-refresh sekali klik — tanpa rumus bersarang."
author: "Alya Nadzira Arta Anas"
date: "2026-11-15"
category: "Tutorial"
tags: ["excel", "power-query", "data", "tutorial", "office"]
slug: "power-query-excel-membersihkan-data-berantakan"
---

# Power Query Excel: Membersihkan Data Berantakan Tanpa Rumus Rumit

Siapa pun yang pernah menerima file Excel dari banyak orang pasti kenal masalahnya: nama yang sama ditulis tiga cara berbeda, tanggal campur antara `12/11/2026` dan `12 Nov 2026`, spasi di sana-sini, dan baris duplikat yang entah dari mana. Membersihkannya manual dengan rumus bisa menghabiskan sore — dan minggu depan, saat file baru datang, Anda mengulang semuanya dari nol.

Power Query adalah alat bawaan Excel (sejak Excel 2016) yang menyelesaikan ini secara permanen: Anda merekam langkah pembersihan sekali, lalu setiap ada data baru, tinggal klik **Refresh**. Tidak perlu rumus bersarang, tidak perlu VBA.

## Skenario: Data yang Berantakan

Bayangkan Anda menerima rekap data seperti ini dari beberapa unit kerja:

| Nama | Tanggal Lahir | No. HP |
|---|---|---|
|  BUDI SANTOSO | 12/11/1990 | 0812 3456 7890 |
| Budi Santoso | 12 Nov 1990 | 081234567890 |
| Siti Aminah | 1990-05-03 | +62 812-3456-7890 |
| siti aminah | 03/05/1990 | 0812-3456-7890 |

Nama tidak konsisten, tanggal tiga format, nomor HP empat gaya penulisan. Target kita: satu baris per orang, nama dengan huruf kapital yang benar, tanggal dalam satu format, dan nomor HP seragam.

## Langkah 1: Masukkan Data ke Power Query

1. Blok data Anda, lalu klik **Data → From Table/Range**.
2. Centang **My table has headers** bila baris pertama adalah judul kolom, klik OK.
3. Power Query Editor terbuka — di sinilah semua pembersihan dilakukan.

## Langkah 2: Bersihkan Nama

- Pilih kolom **Nama**, klik **Transform → Format → Trim** untuk membuang spasi di awal dan akhir.
- Masih di kolom yang sama, klik **Transform → Format → Capitalize Each Word** agar `BUDI SANTOSO` dan `siti aminah` menjadi `Budi Santoso` dan `Siti Aminah`.

## Langkah 3: Seragamkan Tanggal

Klik ikon di kiri judul kolom **Tanggal Lahir**, pilih **Date**. Power Query akan membaca ketiga format tanggal di atas dan mengubahnya menjadi satu tipe tanggal yang sama. Kalau ada nilai yang gagal dibaca, ia akan ditandai `Error` — perbaiki sumbernya, jangan diakali.

## Langkah 4: Seragamkan Nomor HP

- Pilih kolom **No. HP**, klik **Transform → Replace Values**: ganti `+62` menjadi `0`, lalu ganti `-` dan spasi menjadi kosong.
- Hasilnya semua nomor berbentuk `081234567890` — siap dicocokkan atau dihubungi.

## Langkah 5: Hapus Duplikat

Setelah nama dan nomor diseragamkan, baris ganda akan terlihat jelas. Pilih kolom **Nama** dan **No. HP** (tahan Ctrl untuk memilih dua kolom), lalu klik **Home → Remove Rows → Remove Duplicates**. Dari empat baris contoh di atas, tersisa dua: Budi Santoso dan Siti Aminah.

## Langkah 6: Muat Hasilnya

Klik **Home → Close & Load**. Tabel bersih muncul di sheet baru. Dan ini bagian terbaiknya: **semua langkah di atas terekam** di panel kanan (Applied Steps). Minggu depan, saat file baru yang sama berantakannya datang, Anda tinggal menaruh data baru di sumber yang sama lalu klik **Data → Refresh All** — pembersihan yang sama berjalan otomatis.

## Tiga Kebiasaan yang Membuat Power Query Semakin Berguna

1. **Jangan mengedit hasil akhir di sheet.** Edit sumbernya, lalu Refresh. Mengedit tabel hasil akan tertimpa saat refresh berikutnya.
2. **Beri nama langkah yang jelas.** Klik kanan sebuah langkah di Applied Steps → Rename, misal `Hapus spasi nama`. Tiga bulan lagi Anda akan berterima kasih pada diri sendiri.
3. **Gabungkan data dari banyak file.** Lewat **Data → Get Data → From Folder**, Power Query bisa menggabungkan puluhan file dengan format sama menjadi satu tabel — tanpa copy-paste. Ini penyelamat saat merekap laporan dari banyak unit.

## Kapan Power Query, Kapan Rumus Biasa?

Gunakan Power Query untuk **membersihkan dan menggabungkan data** — pekerjaan yang berulang dan sumbernya berubah-ubah. Gunakan rumus (XLOOKUP, SUMIFS, dan kawan-kawan) untuk **perhitungan dan analisis** di atas data yang sudah bersih. Keduanya saling melengkapi: Power Query menyiapkan meja, rumus memasak di atasnya.

Kalau pekerjaan Anda melibatkan laporan berkala — rekap bulanan, data pasien, atau laporan keuangan — luangkan satu jam mempelajari Power Query. Jam itu akan kembali berkali-kali lipat dalam bentuk sore yang tidak lagi habis untuk bersih-bersih data.
