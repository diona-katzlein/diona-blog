# Static Markdown Blog for GitHub Pages

Project ini adalah landing page + blog statis untuk GitHub Pages dengan konten artikel dalam format `.md`.

## Fitur

- Dark Mode
- Artikel Markdown
- Auto generate `blog/posts.json` dari folder `blog/posts`
- SEO Meta Tag
- `sitemap.xml`
- `rss.xml`
- Syntax Highlight
- Tag & Category
- Search Artikel
- Pagination
- GitHub Action auto-build saat push artikel Markdown

## Struktur

```text
/
├── index.html
├── assets/
│   ├── css/style.css
│   └── js/
├── blog/
│   ├── index.html
│   ├── article.html
│   ├── posts.json
│   └── posts/*.md
├── scripts/build-index.js
├── sitemap.xml
├── rss.xml
└── .github/workflows/build-blog.yml
```

## Cara Menambah Artikel

Buat file baru di:

```text
blog/posts/nama-artikel.md
```

Format frontmatter:

```md
---
title: "Judul Artikel"
slug: "judul-artikel"
date: "2026-06-15"
category: "Tutorial"
tags: ["github", "markdown"]
excerpt: "Ringkasan singkat artikel."
---

# Judul Artikel

Isi artikel di sini.
```

## Generate Lokal

```bash
npm run build:index
```

## Deploy GitHub Pages

1. Push project ke repository GitHub.
2. Buka **Settings > Pages**.
3. Source: branch `main` atau `master`.
4. Folder: `/root`.
5. Simpan.

## Catatan URL

Jika repository bernama `my-blog`, GitHub Pages biasanya menjadi:

```text
https://username.github.io/my-blog/
https://username.github.io/my-blog/blog/
```

Untuk custom domain, update `SITE_URL` di GitHub Action atau saat menjalankan script lokal.
