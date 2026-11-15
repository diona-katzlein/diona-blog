---
title: "Cara Cek Apakah Email Kamu Bocor di Data Breach (Have I Been Pwned)"
description: "Panduan cek email bocor di Have I Been Pwned: apa arti hasilnya, data apa saja yang bocor, dan 4 langkah yang harus dilakukan setelah email ketahuan bocor."
author: "Isekai ID"
date: "2026-11-15"
category: "Tutorial"
tags: ["data-breach", "have-i-been-pwned", "hibp", "password", "keamanan"]
slug: "cara-cek-email-bocor-data-breach-have-i-been-pwned"
---

# Cara Cek Apakah Email Kamu Bocor di Data Breach (Have I Been Pwned)

Setiap tahun, miliaran alamat email bocor dari layanan yang diretas — media sosial, toko online, forum, sampai layanan pemerintah. Yang bocor bukan cuma alamat email: sering kali ikut serta password (biasanya dalam bentuk hash), nomor HP, tanggal lahir, bahkan alamat rumah. Data itu kemudian diperjualbelikan dan dipakai untuk penipuan, termasuk percobaan login ke akun Anda yang lain.

Kabar baiknya, mengecek apakah email Anda termasuk yang bocor itu gratis dan hanya butuh satu menit, lewat layanan **Have I Been Pwned (HIBP)** di [haveibeenpwned.com](https://haveibeenpwned.com).

## Langkah 1: Cek Email Anda

1. Buka [haveibeenpwned.com](https://haveibeenpwned.com).
2. Masukkan alamat email Anda di kolom yang tersedia, klik **pwned?**.
3. Hasilnya ada dua kemungkinan: **"Good news — no pwnage found!"** (email Anda tidak ditemukan di breach yang tercatat) atau **"Oh no — pwned!"** beserta daftar breach-nya.

**Penting:** HIBP hanya meminta alamat email — **jangan pernah memasukkan password Anda** di situs pengecekan apa pun. Situs yang meminta password untuk "mengecek kebocoran" justru patut dicurigai.

## Langkah 2: Baca Hasilnya dengan Benar

Kalau email Anda ketahuan bocor, tiap breach menampilkan:

- **Nama layanan dan tanggal breach** — misal, breach sebuah forum pada 2023.
- **Data classes** — jenis data yang bocor: alamat email, password hash, nomor HP, tanggal lahir, dan lain-lain.
- **Deskripsi singkat** — bagaimana breach itu terjadi.

Yang paling penting diperhatikan adalah apakah **password** termasuk data yang bocor. Kalau ya, anggap password itu sudah diketahui publik — meskipun dalam bentuk hash, hash yang lemah bisa dipecahkan dengan cepat.

Satu hal yang sering disalahpahami: hasil "tidak ditemukan" bukan jaminan email Anda 100% aman — hanya berarti tidak ada di katalog HIBP saat ini. Breach baru terus bermunculan; di kolom [Data Breach](/data-breach/) blog ini kami merangkum breach terbaru dua kali sehari.

## Langkah 3: Kalau Bocor, Lakukan 4 Hal Ini

**1. Ganti password di layanan yang bocor — segera.** Jangan menunda. Kalau password yang sama Anda pakai di tempat lain, ganti semuanya. Inilah alasan kenapa satu password untuk semua akun sangat berbahaya: satu breach membobol banyak akun sekaligus.

**2. Aktifkan autentikasi dua faktor (2FA/MFA)** di layanan yang bocor dan di email utama Anda. Dengan 2FA, password yang bocor saja tidak cukup untuk masuk — penyerang masih butuh kode dari HP Anda. Pakai aplikasi authenticator, bukan SMS, bila tersedia.

**3. Pakai password manager.** Password yang kuat adalah yang panjang, acak, dan berbeda untuk tiap layanan — sesuatu yang mustahil dihafal manusia. Password manager mengingatnya untuk Anda; Anda cukup mengingat satu master password yang kuat.

**4. Waspada penipuan yang memanfaatkan data bocor.** Penyerang memakai data breach untuk membuat email phishing yang meyakinkan — mereka tahu nama Anda, layanan yang Anda pakai, bahkan sebagian password lama Anda. Kalau ada email yang meminta Anda klik tautan atau kirim uang dengan dalih "akun Anda bocor", jangan klik — buka layanan itu langsung dari aplikasi atau alamat resminya.

## Langkah 4: Pantau Terus

HIBP menyediakan **Notify Me** — masukkan email Anda sekali, dan Anda akan diberi tahu bila email itu muncul di breach baru di masa depan. Ini gratis dan jauh lebih baik daripada mengecek manual setiap bulan.

Untuk gambaran yang lebih luas tentang kebocoran data yang sedang terjadi, pantau juga kolom [Data Breach Terbaru](/data-breach/) di blog ini — kami merangkum breach dari katalog HIBP dan berita keamanan, diterjemahkan ke Bahasa Indonesia dengan credit ke sumbernya.

## Kenapa Ini Penting

Data breach bukan masalah "nanti saja". Password yang bocor hari ini bisa dipakai untuk membobol akun Anda minggu depan, dan data pribadi yang bocor bisa dipakai untuk penipuan bertahun-tahun kemudian. Satu menit untuk mengecek, dan beberapa menit untuk mengganti password, jauh lebih murah daripada memulihkan akun yang sudah diambil alih.

Baca juga: [Kenalan dengan Info Stealer, Virus Pencuri Data](/blog/kenalan-info-stealer-virus-pencuri-data.html) — malware yang mencuri password langsung dari perangkat Anda adalah sumber kebocoran lain yang tidak terdeteksi HIBP.
