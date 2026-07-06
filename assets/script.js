// Mobile sidebar toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
    // Close the sidebar after tapping a link (mobile)
    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    });
  }

  // Syntax highlighting, if highlight.js loaded
  if (window.hljs) {
    document.querySelectorAll('pre code').forEach(function (block) {
      window.hljs.highlightElement(block);
    });
  }
});
