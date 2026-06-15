const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');
const content = document.getElementById('content');

fetch('./posts.json')
  .then(res => res.json())
  .then(posts => {
    const post = posts.find(item => item.slug === slug) || posts[0];
    if(!post) throw new Error('Post tidak ditemukan.');
    setMeta(post);
    return fetch(`./posts/${post.file}`).then(res => res.text()).then(md => ({post, md}));
  })
  .then(({post, md}) => {
    document.getElementById('articleTitle').textContent = post.title;
    document.getElementById('articleMeta').textContent = `${formatDate(post.date)} · ${post.category || 'General'} · ${post.readingTime || '1 min read'}`;
    document.getElementById('articleTags').innerHTML = (post.tags || []).map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('');
    content.innerHTML = marked.parse(stripFrontmatter(md));
    document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
  })
  .catch(err => { content.innerHTML = `<p class="empty">${escapeHtml(err.message)}</p>`; });

function setMeta(post){
  document.title = `${post.title} - Isekai Blog`;
  document.getElementById('metaDescription').setAttribute('content', post.excerpt || post.title);
  document.getElementById('ogTitle').setAttribute('content', post.title);
  document.getElementById('ogDescription').setAttribute('content', post.excerpt || post.title);
}
function stripFrontmatter(md){ return md.replace(/^---[\s\S]*?---\s*/, ''); }
function formatDate(date){ return new Intl.DateTimeFormat('id-ID', { dateStyle:'medium' }).format(new Date(date)); }
function escapeHtml(value){ return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
