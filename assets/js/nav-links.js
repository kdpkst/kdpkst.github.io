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
});
