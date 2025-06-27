document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
      btn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    btn.onclick = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });