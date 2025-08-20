/**
 * Project Search Functionality
 * Handles real-time search and filtering of projects
 */

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsSections = document.querySelectorAll('.projects-section');
  const noResults = document.getElementById('no-results');
  
  if (!searchInput) return;
  
  // Debounce function to limit search frequency
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Search function
  function performSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    let hasResults = false;
    let visibleSections = new Set();
    
    // Reset all cards
    projectCards.forEach(card => {
      card.classList.remove('hidden');
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    });
    
    // If search term is empty, show all projects
    if (term === '') {
      projectsSections.forEach(section => {
        section.classList.remove('hidden');
        section.style.opacity = '1';
      });
      noResults.style.display = 'none';
      return;
    }
    
    // Filter projects
    projectCards.forEach(card => {
      const title = card.querySelector('.project-title').textContent.toLowerCase();
      const description = card.querySelector('.project-description').textContent.toLowerCase();
      const tags = card.getAttribute('data-tags') || '';
      const category = card.getAttribute('data-category') || '';
      
      const matches = title.includes(term) || 
                     description.includes(term) || 
                     tags.includes(term) || 
                     category.includes(term);
      
      if (matches) {
        hasResults = true;
        visibleSections.add(card.closest('.projects-section'));
        
        // Add subtle animation for matching cards
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.transition = 'all 0.3s ease';
      } else {
        // Hide non-matching cards with animation
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          card.classList.add('hidden');
        }, 300);
      }
    });
    
    // Show/hide sections based on visibility
    projectsSections.forEach(section => {
      if (visibleSections.has(section)) {
        section.classList.remove('hidden');
        section.style.opacity = '1';
        section.style.transition = 'opacity 0.3s ease';
      } else {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          section.classList.add('hidden');
        }, 300);
      }
    });
    
    // Show/hide no results message
    if (hasResults) {
      noResults.style.display = 'none';
    } else {
      noResults.style.display = 'block';
      noResults.style.opacity = '0';
      noResults.style.transform = 'scale(0.8)';
      noResults.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        noResults.style.opacity = '1';
        noResults.style.transform = 'scale(1)';
      }, 100);
    }
  }
  
  // Debounced search function
  const debouncedSearch = debounce(performSearch, 300);
  
  // Event listeners
  searchInput.addEventListener('input', function(e) {
    debouncedSearch(e.target.value);
  });
  
  // Clear search on escape key
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      performSearch('');
      searchInput.blur();
    }
  });
  
  // Add focus effects
  searchInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
    this.parentElement.style.transition = 'transform 0.3s ease';
  });
  
  searchInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
  });
  
  // Add click-to-clear functionality for search icon
  const searchIcon = document.querySelector('.search-icon');
  if (searchIcon) {
    searchIcon.addEventListener('click', function() {
      if (searchInput.value) {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
      }
    });
  }
  
  // Initialize search state
  performSearch('');
});

/**
 * Project Card Interactions
 * Enhanced hover effects and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Add staggered animation on page load
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // Stagger the animations
    const index = Array.from(projectCards).indexOf(card);
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
    
    // Enhanced hover effects
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
    
    // Add click effect for project links
    const projectLinks = card.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
