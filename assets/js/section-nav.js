document.addEventListener('DOMContentLoaded', function() {
  var base = window.siteBaseUrl || '';
  var pages = window.pages || [
    '/',
    '/projects/',
    '/blogs/'
  ];

  function navigatePage(direction) {
    var currentPath = window.location.pathname;
    var currentPageIndex = pages.indexOf(currentPath);

    if (currentPageIndex === -1) {
      currentPageIndex = 0; // Default to About page
    }

    var nextPageIndex;
    if (direction === 'next') {
      nextPageIndex = (currentPageIndex + 1) % pages.length;
    } else {
      nextPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
    }

    document.body.classList.remove('page-loaded');

    setTimeout(function() {
      window.location.href = base + pages[nextPageIndex];
    }, 600); // Corresponds to the transition duration
  }

  // Page navigation (side arrows)
  document.getElementById('section-prev').addEventListener('click', function() {
    navigatePage('prev');
  });

  document.getElementById('section-next').addEventListener('click', function() {
    navigatePage('next');
  });

  // Keyboard navigation for pages
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      navigatePage('prev');
    } else if (e.key === 'ArrowRight') {
      navigatePage('next');
    }
  });
}); 