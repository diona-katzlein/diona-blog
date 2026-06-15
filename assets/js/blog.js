const POSTS_PER_PAGE = 6;
let allPosts = [];
let currentPage = 1;

const postGrid = document.getElementById('postGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const tagFilter = document.getElementById('tagFilter');
const emptyState = document.getElementById('emptyState');

fetch('./posts.json')
  .then(res => res.json())
  .then(posts => {
    allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    populateFilters(allPosts);
    render();
  })
  .catch(() => {
    postGrid.innerHTML = '<p class="empty">Gagal membaca posts.json. Jalankan npm run build:index atau GitHub Action.</p>';
  });

[searchInput, categoryFilter, tagFilter].forEach(el => el.addEventListener('input', () => { currentPage = 1; render(); }));

function populateFilters(posts){
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))].sort();
  const tags = [...new Set(posts.flatMap(p => p.tags || []))].sort();
  categories.forEach(category => categoryFilter.append(new Option(category, category)));
  tags.forEach(tag => tagFilter.append(new Option(tag, tag)));
}

function getFilteredPosts(){
  const keyword = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;
  const tag = tagFilter.value;
  return allPosts.filter(post => {
    const haystack = `${post.title} ${post.excerpt} ${post.category} ${(post.tags || []).join(' ')}`.toLowerCase();
    return (!keyword || haystack.includes(keyword)) && (!category || post.category === category) && (!tag || (post.tags || []).includes(tag));
  });
}

function render(){
  const filtered = getFilteredPosts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  if(currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);
  emptyState.hidden = filtered.length !== 0;
  postGrid.innerHTML = pagePosts.map(post => `
    <article class="post-card">
      <div class="tags"><span class="tag">${escapeHtml(post.category || 'General')}</span>${(post.tags || []).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>
      <h2><a href="article.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2>
      <p>${escapeHtml(post.excerpt || '')}</p>
      <p class="meta">${formatDate(post.date)} · ${post.readingTime || '1 min read'}</p>
    </article>
  `).join('');
  renderPagination(totalPages);
}

function renderPagination(totalPages){
  pagination.innerHTML = '';
  for(let i = 1; i <= totalPages; i++){
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.addEventListener('click', () => { currentPage = i; render(); window.scrollTo({top:0, behavior:'smooth'}); });
    pagination.appendChild(button);
  }
}
function formatDate(date){ return new Intl.DateTimeFormat('id-ID', { dateStyle:'medium' }).format(new Date(date)); }
function escapeHtml(value){ return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
