document.addEventListener('DOMContentLoaded', function() {
    const siteTitle = document.querySelector('.navbar__brand');
    if (siteTitle) {
      siteTitle.href = 'http://localhost:3000';
    }
  });