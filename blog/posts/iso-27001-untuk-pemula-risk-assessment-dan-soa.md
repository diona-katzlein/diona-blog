---
title: "ISO/IEC 27001 untuk Pemula: Cara Menyusun Risk Assessment dan Statement of Applicability"
description: "Panduan ISO/IEC 27001:2022 untuk pemula: langkah risk assessment, matriks likelihood x impact, empat opsi treatment, dan cara menyusun Statement of Applicability."
author: "Alya Nadzira Arta Anas"
date: "2026-11-15"
category: "Tata Kelola"
tags: ["iso-27001", "risk-assessment", "soa", "isms", "tata-kelola", "kepatuhan"]
slug: "iso-27001-untuk-pemula-risk-assessment-dan-soa"
---

# ISO/IEC 27001 untuk Pemula: Cara Menyusun Risk Assessment dan Statement of Applicability

ISO/IEC 27001 adalah standar internasional untuk Sistem Manajemen Keamanan Informasi (ISMS). Bagi organisasi — termasuk rumah sakit yang mengelola data pasien — standar ini menjawab satu pertanyaan mendasar: **bagaimana kita memastikan risiko terhadap informasi sudah dikenali, dinilai, dan ditangani secara sistematis, bukan sekadar tambal sulam?**

Artikel ini menjelaskan dua dokumen yang paling sering membingungkan pemula: **Risk Assessment** (penilaian risiko) dan **Statement of Applicability** (SoA). Keduanya wajib ada kalau organisasi Anda serius menuju sertifikasi — dan keduanya jauh lebih sederhana dari kesan pertamanya.

## Struktur Singkat ISO/IEC 27001:2022

Standar ini punya dua bagian utama:

- **Klausul 4–10** — persyaratan manajemen: konteks organisasi, kepemimpinan, perencanaan, dukungan, operasi, evaluasi kinerja, dan perbaikan berkelanjutan (siklus PDCA).
- **Annex A** — 93 kontrol keamanan dalam 4 tema: Organisasi (37 kontrol), Orang (8), Fisik (14), dan Teknologi (34).

Klausul 6.1 adalah jantungnya: organisasi **wajib** melakukan risk assessment dan risk treatment. Tanpa keduanya, tidak ada ISMS — hanya tumpukan kebijakan.

## Langkah 1: Inventarisasi Aset Informasi

Risiko tidak bisa dinilai kalau asetnya tidak diketahui. Buat daftar aset informasi Anda: server, database, laptop, aplikasi (misal SIMRS), dokumen, sampai orang yang memegang akses penting. Untuk tiap aset, catat pemiliknya dan nilai **kerahasiaan, integritas, dan ketersediaannya** (CIA triad).

Contoh kecil di rumah sakit: database pasien (kerahasiaan tinggi, ketersediaan tinggi), laptop admin (kerahasiaan sedang), dan printer jaringan (ketersediaan sedang).

## Langkah 2: Identifikasi Ancaman dan Kerentanan

Untuk tiap aset, tanyakan: apa yang bisa terjadi, dan celah apa yang memungkinkannya? Ancaman bisa berupa ransomware, phishing, laptop hilang, banjir di ruang server, sampai vendor yang lalai. Kerentanan adalah kelemahan yang membuat ancaman itu berhasil — misal password lemah, port manajemen terbuka ke internet, atau backup yang tidak pernah diuji.

Di kolom KEV blog ini kami memantau kerentanan yang **terbukti sudah dieksploitasi** di dunia nyata — itu contoh ancaman yang tidak lagi teoritis. Lihat [KEV — Known Exploited Vulnerabilities](/kev/) untuk daftarnya.

## Langkah 3: Nilai Risiko dengan Matriks 5×5

Nilai tiap risiko dari dua sisi, masing-masing skala 1–5:

- **Likelihood** (kemungkinan terjadi): 1 = sangat jarang, 5 = hampir pasti.
- **Impact** (dampak bila terjadi): 1 = bisa diabaikan, 5 = bencana (misal data pasien bocor massal).

Skor risiko = Likelihood × Impact. Contoh:

| Risiko | Likelihood | Impact | Skor | Level |
|---|---|---|---|---|
| Ransomware via phishing ke staf | 4 | 5 | 20 | Kritis |
| Laptop admin hilang tanpa enkripsi | 3 | 4 | 12 | Tinggi |
| Gangguan listrik ruang server | 2 | 3 | 6 | Sedang |
| Karyawan salah kirim email | 3 | 2 | 6 | Sedang |

Tetapkan **risk appetite** — ambang yang masih bisa diterima organisasi. Misal: skor 1–6 diterima, 8–12 butuh rencana penanganan, 15–25 wajib ditangani segera. Ambang ini keputusan manajemen, bukan keputusan tim IT semata.

## Langkah 4: Pilih Risk Treatment

Untuk tiap risiko di atas ambang, pilih satu dari empat opsi:

1. **Mitigasi** — kurangi likelihood atau impact. Contoh: pelatihan anti-phishing + MFA untuk risiko ransomware.
2. **Transfer** — pindahkan sebagian risiko, misal asuransi siber atau klausul keamanan di kontrak vendor.
3. **Hindari** — hentikan aktivitas berisikonya. Contoh: tutup akses manajemen dari internet sepenuhnya.
4. **Terima** — terima risiko secara sadar dan terdokumentasi, dengan persetujuan pemilik risiko. Ini sah — asal bukan karena malas menilai.

Hasilnya dituangkan dalam **Risk Treatment Plan (RTP)**: kontrol apa yang diterapkan, siapa penanggung jawabnya, dan kapan tenggatnya.

## Langkah 5: Susun Statement of Applicability (SoA)

SoA adalah tabel yang memetakan **93 kontrol Annex A** satu per satu: kontrol mana yang diterapkan, mana yang tidak, dan alasannya. Inilah dokumen yang paling sering diminta auditor.

Contoh baris SoA:

| Kontrol | Diterapkan? | Alasan / Bukti |
|---|---|---|
| A.5.23 — Keamanan informasi dalam penggunaan layanan cloud | Ya | Kebijakan cloud + review vendor tahunan |
| A.8.9 — Manajemen konfigurasi | Ya | Baseline konfigurasi server terdokumentasi |
| A.7.4 — Keamanan fisik (perimeter) | Ya | Akses ruang server dengan kartu + CCTV |
| A.5.19 — Keamanan informasi dalam hubungan pemasok | Ya | Klausul keamanan di semua kontrak vendor |

Kontrol yang **tidak** diterapkan harus punya alasan tertulis yang masuk akal — misal kontrol tentang pengembangan aman tidak relevan bila organisasi tidak mengembangkan software sendiri. "Tidak tahu" bukan alasan.

## Setelah Dokumen Jadi

Risk assessment bukan dokumen sekali tulis. Standar menuntut peninjauan berkala dan setiap kali ada perubahan besar: sistem baru, vendor baru, insiden keamanan, atau perubahan regulasi — seperti kewajiban pelindungan data pribadi di Indonesia yang kini diperkuat PP 33/2026. Siklusnya: rencanakan (Plan), jalankan (Do), periksa (Check), perbaiki (Act).

Mulailah dari yang kecil: satu unit kerja, satu daftar aset, sepuluh risiko teratas. ISMS yang hidup dari daftar risiko yang jujur jauh lebih berharga daripada binder tebal yang tidak pernah dibaca.

Baca juga: [Mengenal Spear Phishing dan Cara Menghindarinya](/blog/mengenal-spear-phishing-cara-menghindari.html) — phishing adalah ancaman yang hampir selalu muncul di baris teratas risk assessment mana pun.
