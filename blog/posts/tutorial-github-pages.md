---
title: "Tutorial Deploy ke GitHub Pages"
slug: "tutorial-github-pages"
date: "2026-06-15"
category: "Tutorial"
tags: ["github", "deployment", "static-site"]
excerpt: "Panduan lengkap mendeploy blog statis berbasis Markdown ke layanan hosting gratis GitHub Pages."
---

# Tutorial Deploy ke GitHub Pages

Mendeploy situs statis ke **GitHub Pages** adalah salah satu cara terbaik untuk mempublikasikan proyek web atau blog pribadi secara gratis, aman, dan tanpa batasan bandwidth yang ketat. 

Dalam tutorial ini, kita akan membahas cara mendeploy proyek blog Markdown ini, lengkap dengan integrasi otomatisasi menggunakan **GitHub Actions**.

## Prasyarat Sebelum Deploy

Sebelum memulai, pastikan Anda telah menyiapkan:
- Akun GitHub aktif.
- Git terinstall di komputer lokal Anda.
- Node.js (direkomendasikan versi 18 ke atas) untuk menjalankan script build.

---

## Langkah 1: Push Kode ke Repositori GitHub

Buat repositori baru di GitHub dengan nama bebas (misalnya `diona-blog`), lalu jalankan perintah berikut di terminal komputer lokal Anda untuk menghubungkan dan mengirim kode:

```bash
# Inisialisasi git jika belum dilakukan
git init

# Hubungkan ke repositori GitHub Anda
git remote add origin https://github.com/username/diona-blog.git

# Tambahkan semua file dan buat commit awal
git add .
git commit -m "Initial commit - Redesign blog"

# Kirim kode ke GitHub
git branch -M main
git push -u origin main
```

---

## Langkah 2: Mengaktifkan Layanan GitHub Pages

Setelah file terunggah ke repositori GitHub Anda:

1. Buka repositori Anda di browser, klik menu **Settings** di bilah atas.
2. Pada bilah menu kiri, cari bagian **Code and automation** dan klik **Pages**.
3. Pada bagian **Build and deployment**:
   - Source: Pilih **Deploy from a branch**.
   - Branch: Pilih branch `main` (atau `master`) dan foldernya adalah `/ (root)`.
4. Klik tombol **Save**.

---

## Langkah 3: Menggunakan GitHub Actions untuk Build Otomatis

Proyek ini sudah dilengkapi dengan alur otomatisasi (workflow) di folder `.github/workflows/npm-publish-github-packages.yml`. Workflow ini akan otomatis berjalan setiap kali Anda menambahkan atau mengedit file Markdown di folder `blog/posts/`.

Secara otomatis, GitHub Actions akan:
- Menginstall Node.js.
- Menjalankan perintah build indeks (`node scripts/build-index.js`).
- Menghasilkan file indeks `posts.json`, `sitemap.xml`, dan `rss.xml` yang baru.
- Melakukan commit balik file yang diperbarui tersebut ke repositori.

> [!IMPORTANT]
> Agar GitHub Actions dapat melakukan commit balik ke repositori Anda, berikan izin menulis (write permissions) dengan cara:
> 1. Masuk ke **Settings > Actions > General**.
> 2. Scroll ke bawah hingga menemukan bagian **Workflow permissions**.
> 3. Pilih opsi **Read and write permissions**, lalu klik **Save**.

---

## Langkah 4: Selesai & Verifikasi

Setelah workflow GitHub Actions selesai dijalankan (bisa dipantau di tab **Actions** pada repositori Anda), situs Anda akan dipublikasikan secara online. Format URL default-nya adalah:

`https://<username-anda>.github.io/<nama-repo>/`

Sekarang, setiap kali Anda ingin memposting tulisan baru, Anda cukup membuat file Markdown baru di folder `blog/posts/` lalu melakukan push ke GitHub. Situs Anda akan memperbarui dirinya sendiri secara otomatis!
