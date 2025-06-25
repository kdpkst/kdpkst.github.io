document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('blog-search');
  const blogCards = document.querySelectorAll('.blog-card');
  const categoryLinks = document.querySelectorAll('.category');

  function filterBlogs() {
    const query = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.category.active');
    blogCards.forEach(card => {
      const title = card.querySelector('h2').textContent.toLowerCase();
      const excerpt = card.querySelector('p').textContent.toLowerCase();
      const categories = card.getAttribute('data-category') || '';
      const matchesQuery = title.includes(query) || excerpt.includes(query);
      const matchesCategory = !activeCategory || categories.includes(activeCategory.dataset.category);
      card.style.display = (matchesQuery && matchesCategory) ? '' : 'none';
    });
  }

  searchInput && searchInput.addEventListener('input', filterBlogs);

  categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      categoryLinks.forEach(l => l.classList.remove('active'));
      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      filterBlogs();
    });
  });
}); 