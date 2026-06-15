const params = new URLSearchParams(window.location.search);
let slug = params.get('slug');
if (!slug) {
  const pathParts = window.location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart.endsWith('.html') && lastPart !== 'article.html' && lastPart !== 'index.html') {
    slug = lastPart.replace('.html', '');
  }
}
const contentContainer = document.getElementById('content');
const progressBar = document.getElementById('progressBar');

// Fetch blog index to find the post matching the slug
fetch('./posts.json')
  .then(res => res.json())
  .then(posts => {
    const post = posts.find(item => item.slug === slug) || posts[0];
    if(!post) throw new Error('Post tidak ditemukan.');
    
    // Set all SEO and GEO meta tags
    setMeta(post);
    
    // Fetch and render the actual Markdown file
    return fetch(`./posts/${post.file}`)
      .then(res => {
        if (!res.ok) throw new Error(`Gagal memuat berkas artikel (HTTP ${res.status})`);
        return res.text();
      })
      .then(md => ({post, md}));
  })
  .then(({post, md}) => {
    document.getElementById('articleTitle').textContent = post.title;
    document.getElementById('articleMeta').innerHTML = `
      <i class="fa-regular fa-calendar-days"></i> ${formatDate(post.date)} &nbsp;·&nbsp;
      <i class="fa-solid fa-folder-open"></i> ${post.category || 'General'} &nbsp;·&nbsp;
      <i class="fa-regular fa-clock"></i> ${post.readingTime || '1 min read'}
    `;
    
    document.getElementById('articleTags').innerHTML = (post.tags || [])
      .map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`)
      .join('');
      
    // Set article cover image
    const coverImg = document.getElementById('articleCover');
    if (coverImg) {
      if (post.image) {
        coverImg.src = post.image.startsWith('/') ? `..${post.image}` : post.image;
        coverImg.alt = post.title;
        coverImg.style.display = 'block';
      } else {
        coverImg.style.display = 'none';
      }
    }
      
    // Render Markdown to HTML using marked.js
    contentContainer.innerHTML = marked.parse(stripFrontmatter(md));
    
    // Trigger syntax highlighting
    document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    
    // Setup interactive features
    setupCodeCopyButtons();
    generateTocAndAddHeaderIds();
    setupReadingProgressBar();
    setupShareButtons(post);
  })
  .catch(err => { 
    contentContainer.innerHTML = `<p class="empty"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat artikel: ${escapeHtml(err.message)}</p>`; 
  });

// Setup dynamic SEO & GEO Meta tags
function setMeta(post){
  const pageTitle = `${post.title} - Isekai Blog`;
  const postUrl = `https://baca.readme.id/blog/article.html?slug=${encodeURIComponent(post.slug)}`;
  const description = post.description || post.excerpt || post.title;
  
  // Format absolute image URL for Facebook, WhatsApp, Telegram shares
  const imageUrl = post.image.startsWith('http') 
    ? post.image 
    : `https://baca.readme.id${post.image.startsWith('/') ? '' : '/'}${post.image}`;

  document.title = pageTitle;
  
  // Basic metadata
  document.getElementById('metaDescription')?.setAttribute('content', description);
  
  // Canonical Link
  document.getElementById('canonicalLink')?.setAttribute('href', postUrl);
  
  // Open Graph (Facebook, WhatsApp, Telegram)
  document.getElementById('ogTitle')?.setAttribute('content', pageTitle);
  document.getElementById('ogDescription')?.setAttribute('content', description);
  document.getElementById('ogUrl')?.setAttribute('content', postUrl);
  document.getElementById('ogImage')?.setAttribute('content', imageUrl);
  
  // Twitter Cards
  document.getElementById('twitterTitle')?.setAttribute('content', pageTitle);
  document.getElementById('twitterDescription')?.setAttribute('content', description);
  document.getElementById('twitterImage')?.setAttribute('content', imageUrl);
  
  // Inject JSON-LD Schema.org Structured Data for Google/Bing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
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
        "url": "https://baca.readme.id/assets/css/logo-sq.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
  };
  
  const structuredDataEl = document.getElementById('structuredData');
  if (structuredDataEl) {
    structuredDataEl.textContent = JSON.stringify(jsonLd, null, 2);
  }
}

// Table of Contents generator
function generateTocAndAddHeaderIds() {
  const headers = contentContainer.querySelectorAll('h2, h3');
  const tocCard = document.getElementById('tocCard');
  const tocList = document.getElementById('tocList');
  
  if (!tocList || headers.length === 0) {
    if (tocCard) tocCard.style.display = 'none';
    return;
  }
  
  tocList.innerHTML = '';
  if (tocCard) tocCard.style.display = 'block';
  
  headers.forEach((header, index) => {
    const id = 'heading-' + index;
    header.id = id;
    
    const li = document.createElement('li');
    li.className = header.tagName.toLowerCase() === 'h3' ? 'depth-3' : 'depth-2';
    
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = header.textContent;
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      // Account for sticky header offset of 80px + extra 20px padding
      const offsetTop = header.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      history.pushState(null, null, '#' + id);
    });
    
    li.appendChild(a);
    tocList.appendChild(li);
  });
  
  // Highlight TOC item on scroll
  window.addEventListener('scroll', () => {
    let activeId = '';
    headers.forEach(header => {
      const top = header.getBoundingClientRect().top;
      if (top < 150) {
        activeId = header.id;
      }
    });
    
    const tocLinks = tocList.querySelectorAll('a');
    tocLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

// Code Copy button setup
function setupCodeCopyButtons() {
  const preBlocks = contentContainer.querySelectorAll('pre');
  preBlocks.forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) return;
    
    const button = document.createElement('button');
    button.className = 'code-copy-btn';
    button.innerHTML = '<i class="fa-regular fa-copy"></i> Salin';
    
    button.addEventListener('click', () => {
      const textToCopy = code.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        button.classList.add('copied');
        button.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        
        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = '<i class="fa-regular fa-copy"></i> Salin';
        }, 2000);
      }).catch(err => {
        console.error('Gagal menyalin kode: ', err);
      });
    });
    
    pre.appendChild(button);
  });
}

// Reading Progress Bar listener
function setupReadingProgressBar() {
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const totalScroll = scrollHeight - clientHeight;
    const scrollPercentage = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
    
    progressBar.style.width = scrollPercentage + '%';
  });
}

// Social Sharing Setup
function setupShareButtons(post) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Baca artikel menarik: "${post.title}"`);
  
  const fbBtn = document.getElementById('shareFB');
  const waBtn = document.getElementById('shareWA');
  const tgBtn = document.getElementById('shareTG');
  const copyBtn = document.getElementById('shareCopy');
  
  if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  if (waBtn) waBtn.href = `https://api.whatsapp.com/send?text=${text}%20${url}`;
  if (tgBtn) tgBtn.href = `https://t.me/share/url?url=${url}&text=${text}`;
  
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Salin Link';
        }, 2000);
      }).catch(err => {
        console.error('Gagal menyalin link: ', err);
      });
    });
  }
}

function stripFrontmatter(md){ return md.replace(/^---[\s\S]*?---\s*/, ''); }
function formatDate(date){ return new Intl.DateTimeFormat('id-ID', { dateStyle:'medium' }).format(new Date(date)); }
function escapeHtml(value){ return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
