(function(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  
  // Apply theme to HTML tag
  document.documentElement.setAttribute('data-theme', theme);
  
  // Set highlight.js style theme based on active theme
  updateHighlightTheme(theme);

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
