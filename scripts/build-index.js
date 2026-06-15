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
    const image = data.image || '/assets/css/og-image.png';
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

const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/blog/`,
  ...posts.map(post => `${SITE_URL}/blog/article.html?slug=${encodeURIComponent(post.slug)}`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(sitemapFile, sitemap);

const rssItems = posts.map(post => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(`${SITE_URL}/blog/article.html?slug=${encodeURIComponent(post.slug)}`)}</link>
    <guid>${escapeXml(`${SITE_URL}/blog/article.html?slug=${encodeURIComponent(post.slug)}`)}</guid>
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
${rssItems}
</channel>
</rss>
`;
fs.writeFileSync(rssFile, rss);

console.log(`Generated ${posts.length} posts, sitemap.xml, and rss.xml`);
