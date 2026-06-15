(function(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  
  // Apply theme to HTML tag immediately to avoid Flash of Unstyled Content (FOUC)
  document.documentElement.setAttribute('data-theme', theme);
  
  // Try to set highlight.js style theme immediately if it's already in the DOM
  updateHighlightTheme(theme);

  // Wait for the DOM to be ready to bind the toggle button listener
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }

  function initToggle() {
    const button = document.getElementById('themeToggle');
    if(button){
      button.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      button.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        
        button.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        updateHighlightTheme(next);
      });
    }
    
    // Set theme again just in case DOM loaded after link was parsed
    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateHighlightTheme(currentTheme);
  }

  function updateHighlightTheme(themeMode) {
    const highlightLink = document.getElementById('highlightTheme');
    if (highlightLink) {
      if (themeMode === 'dark') {
        highlightLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
      } else {
        highlightLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
      }
    }
  }
})();
