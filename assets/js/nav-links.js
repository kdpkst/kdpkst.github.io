// switching animation for navbar and "explore my work" cards
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.navbar .nav-center a');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Get the absolute path of the link's href
      const linkUrl = new URL(link.href, window.location.origin);
      // Get the absolute path of the current page
      const currentUrl = new URL(window.location.href, window.location.origin);

      // Compare pathnames, ignoring trailing slashes
      if (linkUrl.pathname.replace(/\/$/, '') === currentUrl.pathname.replace(/\/$/, '')) {
        return; // Do nothing if it's the current page
      }

      e.preventDefault();
      const destination = this.href;

      document.body.classList.remove('page-loaded');

      setTimeout(() => {
        window.location.href = destination;
      }, 500); // Match the CSS transition duration
    });
  });

  // Also apply navigation animation to explore cards
  const exploreCards = document.querySelectorAll('.explore-links > a.container');
  exploreCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Get the absolute path of the link's href
      const linkUrl = new URL(card.href, window.location.origin);
      const currentUrl = new URL(window.location.href, window.location.origin);
      if (linkUrl.pathname.replace(/\/$/, '') === currentUrl.pathname.replace(/\/$/, '')) {
        return; // Do nothing if it's the current page
      }
      e.preventDefault();
      const destination = card.href;
      document.body.classList.remove('page-loaded');
      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    });
  });
});
