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
  .catch((err) => {
    console.error(err);
    postGrid.innerHTML = '<p class="empty"><i class="fa-solid fa-triangle-exclamation"></i> Gagal membaca posts.json. Jalankan build:index terlebih dahulu.</p>';
  });

[searchInput, categoryFilter, tagFilter].forEach(el => {
  if (el) {
    el.addEventListener('input', () => {
      currentPage = 1;
      render();
    });
  }
});

function populateFilters(posts){
  if (!categoryFilter || !tagFilter) return;
  
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))].sort();
  const tags = [...new Set(posts.flatMap(p => p.tags || []))].sort();
  
  categories.forEach(category => categoryFilter.append(new Option(category, category)));
  tags.forEach(tag => tagFilter.append(new Option(`#${tag}`, tag)));
}

function getFilteredPosts(){
  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const category = categoryFilter ? categoryFilter.value : '';
  const tag = tagFilter ? tagFilter.value : '';
  
  return allPosts.filter(post => {
    const haystack = `${post.title} ${post.excerpt} ${post.category} ${(post.tags || []).join(' ')}`.toLowerCase();
    return (!keyword || haystack.includes(keyword)) && 
           (!category || post.category === category) && 
           (!tag || (post.tags || []).includes(tag));
  });
}

function render(){
  const filtered = getFilteredPosts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  
  if(currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);
  
  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
  }
  
  if (filtered.length === 0) {
    postGrid.innerHTML = '';
    if (pagination) pagination.innerHTML = '';
    return;
  }
  
  postGrid.innerHTML = pagePosts.map(post => {
    const tagsHtml = (post.tags || []).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('');
    return `
      <article class="post-card">
        <div class="tags">
          <span class="tag" style="border-color: var(--primary-glow); color: var(--primary);">
            <i class="fa-solid fa-folder-open"></i> ${escapeHtml(post.category || 'General')}
          </span>
          ${tagsHtml}
        </div>
        <h2><a href="${post.slug}.html">${escapeHtml(post.title)}</a></h2>
        <p>${escapeHtml(post.excerpt || '')}</p>
        <div class="meta">
          <span><i class="fa-regular fa-calendar"></i> ${formatDate(post.date)}</span>
          <span><i class="fa-regular fa-clock"></i> ${post.readingTime || '1 min read'}</span>
        </div>
      </article>
    `;
  }).join('');
  
  renderPagination(totalPages);
}

function renderPagination(totalPages){
  if (!pagination) return;
  pagination.innerHTML = '';
  
  if (totalPages <= 1) return;

  // Previous Button
  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.ariaLabel = "Halaman sebelumnya";
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      render();
      scrollToGridTop();
    }
  });
  pagination.appendChild(prevBtn);

  // Numbered Page Buttons
  for(let i = 1; i <= totalPages; i++){
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.addEventListener('click', () => {
      currentPage = i;
      render();
      scrollToGridTop();
    });
    pagination.appendChild(button);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.ariaLabel = "Halaman berikutnya";
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      render();
      scrollToGridTop();
    }
  });
  pagination.appendChild(nextBtn);
}

function scrollToGridTop() {
  const scrollTarget = document.querySelector('.blog-shell');
  if (scrollTarget) {
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function formatDate(date){ 
  return new Intl.DateTimeFormat('id-ID', { dateStyle:'medium' }).format(new Date(date)); 
}

function escapeHtml(value){ 
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); 
}
