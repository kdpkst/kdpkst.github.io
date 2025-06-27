document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
      // the button will only show up until scrolling down at least 300 pixels
      btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    btn.onclick = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });