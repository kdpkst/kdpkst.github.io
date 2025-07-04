document.addEventListener('DOMContentLoaded', function() {
  const emailContainers = document.querySelectorAll('.email-container');

  emailContainers.forEach(container => {
    const copyButton = container.querySelector('.copy-button');
    const copyFeedback = container.querySelector('.copy-feedback');
    const email = copyButton.dataset.email;

    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        copyButton.style.display = 'none';
        copyFeedback.classList.add('show');
        setTimeout(() => {
          copyFeedback.classList.remove('show');
          copyButton.style.display = 'inline-block';
        }, 1500);
      });
    });
  });
});
