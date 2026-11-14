// site-header.js
// 1) Header is transparent at the top of the page and turns solid black once you scroll.
// 2) Hamburger button opens/closes the menu on small screens.
(function () {
  function init() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    // ── Solid background after scrolling ──────────────────────────────
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Mobile menu ───────────────────────────────────────────────────
    var toggle = header.querySelector('.menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    }

    // Close the mobile menu when clicking elsewhere or pressing Escape
    function closeAll() {
      if (header.classList.contains('menu-open') && toggle) {
        header.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    }
    document.addEventListener('click', function (ev) {
      if (!header.contains(ev.target)) closeAll();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeAll();
    });
    // Following an in-page link should close the mobile menu
    header.querySelectorAll('.menu-bar a').forEach(function (a) {
      a.addEventListener('click', closeAll);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
