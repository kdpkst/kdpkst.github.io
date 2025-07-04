document.addEventListener('DOMContentLoaded', function() {
  var base = window.siteBaseUrl || '';
  var images = window.backgroundImages || [
    base + '/assets/images/background/bg1.webp',
    base + '/assets/images/background/bg2.webp',
    base + '/assets/images/background/bg3.webp',
    base + '/assets/images/background/bg4.webp',
    base + '/assets/images/background/bg5.webp',
    base + '/assets/images/background/bg6.webp'
  ];
  
  // Preload all background images
  images.forEach(function(src) {
    var img = new Image();
    img.src = src;
  });
  
  // Get saved background index or default to 0
  var currentIndex = parseInt(localStorage.getItem('currentBackgroundIndex')) || 0;
  var isTransitioning = false;
  
  // Set initial background
  document.body.style.backgroundImage = 'url(' + images[currentIndex] + ')';
  // Scale image to cover the entire area without distortion, 
  // may crop image edges if aspect ratios differ.
  document.body.style.backgroundSize = 'cover';
  // Stretche image to exactly fill the entire area,
  // may distort image if aspect ratios differ.
  // document.body.style.backgroundSize = '100% 100%';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.transition = 'background-image 0.5s ease-in-out';
  
  function changeBackground(direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    var nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % images.length;
    } else {
      nextIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    // Remove overlay fade effect
    // overlay.style.opacity = '1';
    
    setTimeout(function() {
      // Change background
      document.body.style.backgroundImage = 'url(' + images[nextIndex] + ')';
      currentIndex = nextIndex;
      // Save to localStorage
      localStorage.setItem('currentBackgroundIndex', currentIndex.toString());
      isTransitioning = false;
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