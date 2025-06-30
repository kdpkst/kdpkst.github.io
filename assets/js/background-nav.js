document.addEventListener('DOMContentLoaded', function() {
  var base = window.siteBaseUrl || '';
  var images = [
    base + '/assets/images/background/bg1.webp',
    base + '/assets/images/background/bg2.webp',
    base + '/assets/images/background/bg3.webp',
    base + '/assets/images/background/bg4.webp'
  ];
  
  // Get saved background index or default to 0
  var currentIndex = parseInt(localStorage.getItem('currentBackgroundIndex')) || 0;
  var isTransitioning = false;
  
  // Set initial background
  document.body.style.backgroundImage = 'url(' + images[currentIndex] + ')';
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.transition = 'background-image 0.8s ease-in-out';
  
  // Create overlay for smooth transition
  var overlay = document.createElement('div');
  overlay.className = 'bg-overlay';
  document.body.appendChild(overlay);
  
  function changeBackground(direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    var nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % images.length;
    } else {
      nextIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    // Show overlay
    overlay.style.opacity = '1';
    
    setTimeout(function() {
      // Change background
      document.body.style.backgroundImage = 'url(' + images[nextIndex] + ')';
      currentIndex = nextIndex;
      
      // Save to localStorage
      localStorage.setItem('currentBackgroundIndex', currentIndex.toString());
      
      // Hide overlay
      setTimeout(function() {
        overlay.style.opacity = '0';
        isTransitioning = false;
      }, 100);
    }, 400);
  }
  
  // Background navigation (navbar buttons)
  document.getElementById('bg-prev-nav').addEventListener('click', function() {
    changeBackground('prev');
  });
  
  document.getElementById('bg-next-nav').addEventListener('click', function() {
    changeBackground('next');
  });
  
  // Keyboard navigation for background
  document.addEventListener('keydown', function(e) {
    if (e.key === 'b' || e.key === 'B') {
      changeBackground('prev');
    } else if (e.key === 'n' || e.key === 'N') {
      changeBackground('next');
    }
  });
}); 