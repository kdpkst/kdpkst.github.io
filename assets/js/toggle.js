document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('mode-toggle');
  const body = document.body;
  const darkIcon = '🌓';
  const lightIcon = '🌞';

  function setMode(mode) {
    if (mode === 'light') {
      body.classList.add('light-mode');
      toggleBtn.textContent = lightIcon;
    } else {
      body.classList.remove('light-mode');
      toggleBtn.textContent = darkIcon;
    }
    localStorage.setItem('color-mode', mode);
  }

  // Initial mode
  const savedMode = localStorage.getItem('color-mode') || 'dark';
  setMode(savedMode);

  toggleBtn.addEventListener('click', function() {
    const newMode = body.classList.contains('light-mode') ? 'dark' : 'light';
    setMode(newMode);
  });
}); 