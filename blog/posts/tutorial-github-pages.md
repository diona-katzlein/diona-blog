---
title: "Tutorial Deploy ke GitHub Pages"
slug: "tutorial-github-pages"
date: "2026-06-15"
category: "Tutorial"
tags: ["github", "deployment", "static-site"]
excerpt: "Panduan singkat deploy blog statis ini ke GitHub Pages."
---

# Tutorial Deploy ke GitHub Pages

Ikuti langkah berikut:

1. Upload semua file ke repository GitHub.
2. Masuk ke **Settings > Pages**.
3. Pilih branch `main` dan folder `/root`.
4. Simpan konfigurasi.
5. Akses URL GitHub Pages kamu.

```bash
npm run build:index
git add .
git commit -m "update blog"
git push
```
