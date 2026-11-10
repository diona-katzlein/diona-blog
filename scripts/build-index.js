const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://baca.readme.id';
const SITE_TITLE = 'Isekai Blog';
const SITE_DESCRIPTION = 'Static Markdown Blog untuk GitHub Pages.';
const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'blog', 'posts');
const outputJson = path.join(rootDir, 'blog', 'posts.json');
const sitemapFile = path.join(rootDir, 'sitemap.xml');
const rssFile = path.join(rootDir, 'rss.xml');

function parseFrontmatter(content){
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data = {};
  if(!match) return { data, body: content };
  const raw = match[1];
  raw.split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if(idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))){
      value = value.slice(1, -1);
    }
    if(value.startsWith('[') && value.endsWith(']')){
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    data[key] = value;
  });
  return { data, body: content.slice(match[0].length) };
}

function slugify(text){
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}
function plainText(md){
  return md.replace(/```[\s\S]*?```/g, '').replace(/`([^`]+)`/g, '$1').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[[^\]]*\]\([^)]*\)/g, '').replace(/[#>*_~\-]/g, '').replace(/\s+/g, ' ').trim();
}
function escapeXml(value){
  return String(value || '').replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));
}
function readingTime(text){
  const words = plainText(text).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}


// Profil penulis (author bio box per artikel, berdasarkan frontmatter author)
const AUTHORS = {
  'Duscha Olya Arta Anas': { initial: 'O', bio: 'Peneliti keamanan siber & spesialis infrastruktur (DevOps). Menulis kolom CVE: riset kerentanan, analisis skor CVSS, dan langkah mitigasi yang praktis.' },
  'Alya Nadzira Arta Anas': { initial: 'A', bio: 'Spesialis tata kelola keamanan informasi & manajemen risiko (ISO/IEC 27001). Menulis kolom KEV: prioritas patch berdasarkan eksploitasi nyata dan tenggat kepatuhan.' },
  'Isekai ID': { initial: 'I', bio: 'Editor Isekai Blog. Memantau kebocoran data & threat intelligence, lalu merangkumnya dalam Bahasa Indonesia — selalu dengan credit ke sumber aslinya.' },
};

const posts = fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const fullPath = path.join(postsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data, body } = parseFrontmatter(content);
    const fallbackTitle = body.match(/^#\s+(.+)$/m)?.[1] || file.replace(/\.md$/, '');
    const title = data.title || fallbackTitle;
    const slug = data.slug || slugify(title);
    const description = data.description || data.excerpt || plainText(body).slice(0, 160);
    const image = data.image || '/assets/images/cpanel-vulnerability.jpg';
    const author = data.author || 'Isekai ID';
    return {
      title,
      slug,
      file,
      date: data.date || new Date().toISOString().slice(0, 10),
      category: data.category || 'General',
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: description,
      description,
      image,
      author,
      readingTime: readingTime(body)
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputJson, JSON.stringify(posts, null, 2));

// Generate static HTML pages for each article to enable static SEO and share image previews
const templatePath = path.join(rootDir, 'blog', 'article.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

posts.forEach(post => {
  const postUrl = `${SITE_URL}/blog/${post.slug}.html`;
  const imageUrl = post.image.startsWith('http') 
    ? post.image 
    : `${SITE_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": imageUrl,
    "datePublished": post.date,
    "articleSection": post.category,
    "keywords": (post.tags || []).join(', '),
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Isekai ID",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/assets/images/cpanel-vulnerability.jpg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
  };

  const coverSrc = post.image.startsWith('/') ? `..${post.image}` : post.image;
  const tagsHtml = (post.tags || []).map(tag => `<span class="tag">#${escapeXml(tag)}</span>`).join('');
  const metaHtml = `<i class="fa-regular fa-calendar-days"></i> ${formatDate(post.date)} &nbsp;·&nbsp; <i class="fa-solid fa-folder-open"></i> ${post.category || 'General'} &nbsp;·&nbsp; <i class="fa-regular fa-clock"></i> ${post.readingTime || '1 min read'}`;

  let postHtml = templateHtml
    .replace(/<title>Article - Isekai Blog<\/title>/g, `<title>${escapeXml(post.title)} - Isekai Blog</title>`)
    .replace(/<meta id="metaDescription" name="description" content="[^"]*" \/>/g, `<meta id="metaDescription" name="description" content="${escapeXml(post.description)}" />`)
    .replace(/content="https:\/\/baca\.readme\.id\/blog\/article\.html"/g, `content="${escapeXml(postUrl)}"`)
    .replace(/content="https:\/\/baca\.readme\.id\/assets\/images\/cpanel-vulnerability\.jpg"/g, `content="${escapeXml(imageUrl)}"`)
    .replace(/content="Article - Isekai Blog"/g, `content="${escapeXml(post.title)} - Isekai Blog"`)
    .replace(/content="Artikel teknis menarik mengenai static site generator, Markdown, dan web statis\."/g, `content="${escapeXml(post.description)}"`)
    .replace(/href="https:\/\/baca\.readme\.id\/blog\/article\.html"/g, `href="${escapeXml(postUrl)}"`)
    .replace(/<script id="structuredData" type="application\/ld\+json"><\/script>/g, `<script id="structuredData" type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`)
    .replace(/<img id="articleCover" class="article-cover" src="" alt="" \/>/g, `<img id="articleCover" class="article-cover" src="${escapeXml(coverSrc)}" alt="${escapeXml(post.title)}" style="display: block;" />`)
    .replace(/<h1 id="articleTitle">Memuat artikel...<\/h1>/g, `<h1 id="articleTitle">${escapeXml(post.title)}</h1>`)
    .replace(/<p id="articleMeta" class="meta"><\/p>/g, `<p id="articleMeta" class="meta">${metaHtml}</p>`)
    .replace(/<div id="articleTags" class="tags"><\/div>/g, `<div id="articleTags" class="tags">${tagsHtml}</div>`);


  const authorProfile = AUTHORS[post.author] || { initial: (post.author || 'I').charAt(0).toUpperCase(), bio: 'Penulis konten teknologi di Isekai Blog.' };
  postHtml = postHtml
    .replace(/<div class="author-avatar">[^<]*<\/div>/g, `<div class="author-avatar">${authorProfile.initial}</div>`)
    .replace(/<h4>Ditulis oleh [^<]*<\/h4>/g, `<h4>Ditulis oleh ${escapeXml(post.author)}</h4>`)
    .replace(/<p>Pengembang web dan penulis konten teknologi[^<]*<\/p>/g, `<p>${authorProfile.bio}</p>`);
  const outputPath = path.join(rootDir, 'blog', `${post.slug}.html`);
  fs.writeFileSync(outputPath, postHtml);
});

const todayIso = new Date().toISOString().slice(0, 10);
const latestPostDate = posts.length ? posts[0].date : todayIso;
const staticEntries = [
  { loc: `${SITE_URL}/`, lastmod: latestPostDate, changefreq: 'daily', priority: '1.0' },
  { loc: `${SITE_URL}/blog/`, lastmod: latestPostDate, changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_URL}/cve/`, lastmod: todayIso, changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_URL}/kev/`, lastmod: todayIso, changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_URL}/data-breach/`, lastmod: todayIso, changefreq: 'daily', priority: '0.9' },
];
const postEntries = posts.map(post => ({ loc: `${SITE_URL}/blog/${post.slug}.html`, lastmod: post.date, changefreq: 'monthly', priority: '0.8' }));
const allEntries = [...staticEntries, ...postEntries];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allEntries.map(e => `  <url><loc>${escapeXml(e.loc)}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(sitemapFile, sitemap);

const rssItems = posts.map(post => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(`${SITE_URL}/blog/${post.slug}.html`)}</link>
    <guid>${escapeXml(`${SITE_URL}/blog/${post.slug}.html`)}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <category>${escapeXml(post.category)}</category>
    <description>${escapeXml(post.excerpt)}</description>
  </item>`).join('\n');
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_TITLE)}</title>
  <link>${escapeXml(SITE_URL)}</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
  <language>id-ID</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <ttl>720</ttl>
${rssItems}
</channel>
</rss>
`;
fs.writeFileSync(rssFile, rss);

console.log(`Generated ${posts.length} posts, static HTML pages, sitemap.xml, and rss.xml`);
