// Tab Navigation System
export function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const tabTriggers = document.querySelectorAll('[data-tab-trigger]');
  const footer = document.querySelector('.unified-footer');
  const navbar = document.querySelector('.tab-navigation');

  // Always reset navbar on init (in case page reloaded mid-game)
  if (navbar) {
    navbar.classList.remove('hidden');
  }

  // Function to switch tabs
  function switchTab(targetTab) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab);

    if (targetButton && targetContent) {
      targetButton.classList.add('active');
      targetContent.classList.add('active');

      // Always restore navbar when switching tabs
      if (navbar) navbar.classList.remove('hidden');

      // Hide footer on game tab, show on others
      if (footer) {
        if (targetTab === 'game') {
          footer.style.display = 'none';
          document.body.style.overflow = 'hidden';
        } else {
          footer.style.display = 'flex';
          document.body.style.overflow = '';
        }
      }

      window.history.pushState({ tab: targetTab }, '', `#${targetTab}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Add click event to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Add click event to tab triggers (like the "Initiate Descent" button)
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = trigger.getAttribute('data-tab-trigger');
      switchTab(targetTab);
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.tab) {
      switchTab(e.state.tab);
    }
  });

  // Handle hash changes (when user manually changes URL)
  window.addEventListener('hashchange', () => {
    const targetTab = window.location.hash.replace('#', '') || 'landing';
    // Remove active class from all
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active to target
    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab);
    
    if (targetButton && targetContent) {
      targetButton.classList.add('active');
      targetContent.classList.add('active');
      
      // Hide footer on game tab
      if (footer) {
        if (targetTab === 'game') {
          footer.style.display = 'none';
          document.body.style.overflow = 'hidden';
        } else {
          footer.style.display = 'flex';
          document.body.style.overflow = '';
        }
      }
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });

  // Initialize first tab
  const initialTab = window.location.hash.replace('#', '') || 'landing';
  switchTab(initialTab);
}
