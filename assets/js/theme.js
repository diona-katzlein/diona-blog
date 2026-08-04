(function(){
  const saved = localStorage.getItem('theme');
  // Default to 'minimalism' if no theme is saved in localStorage
  const theme = saved || 'minimalism';
  
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
    const dropdownMenu = document.getElementById('themeDropdownMenu');
    if (dropdownMenu) {
      const buttons = dropdownMenu.querySelectorAll('button[data-theme-val]');
      
      // Setup initial styles
      buttons.forEach(btn => {
        const btnTheme = btn.getAttribute('data-theme-val');
        if (btnTheme === theme) {
          btn.style.fontWeight = '700';
          btn.style.color = 'var(--primary)';
        }
        
        btn.addEventListener('click', () => {
          const next = btn.getAttribute('data-theme-val');
          
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('theme', next);
          
          // Clear active styles and set the new one
          buttons.forEach(b => {
            b.style.fontWeight = '500';
            b.style.color = '';
          });
          btn.style.fontWeight = '700';
          btn.style.color = 'var(--primary)';
          
          updateHighlightTheme(next);
        });
      });
    }
  }

  function updateHighlightTheme(themeMode) {
    const highlightLink = document.getElementById('highlightTheme');
    if (highlightLink) {
      // Light-oriented themes get the light highlight theme
      if (themeMode === 'light' || themeMode === 'neomorphism' || themeMode === 'claymorphism' || themeMode === 'minimalism') {
        highlightLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
      } else {
        // Dark, Glassmorphism, Skeuomorphism, Maximalism, Liquid Glass get the dark highlight theme
        highlightLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
      }
    }
  }
})();
