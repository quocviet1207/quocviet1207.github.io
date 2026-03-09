// Fetch the news page and display the 3 most recent .news-item entries
(function () {
  async function loadLatestNews() {
    try {
      const resp = await fetch('pages/news.html', { cache: 'no-store' });
      if (!resp.ok) throw new Error('Network response was not ok');
      const text = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const items = Array.from(doc.querySelectorAll('.news-item'))
        .map(el => {
          const dateEl = el.querySelector('.news-date');
          const date = dateEl ? dateEl.textContent.trim() : '';
          const imagesDir = el.getAttribute('data-images-dir') || '';
          return { date, html: el.innerHTML, imagesDir };
        })
        .filter(i => i.date)
        .sort((a, b) => b.date.localeCompare(a.date)); // ISO date strings sort lexicographically

      const latest = items.slice(0, 3);
      if (!latest.length) return;

      const container = document.querySelector('#news .news-list');
      if (!container) return;

      container.innerHTML = latest.map(i => {
        const dirAttr = i.imagesDir ? ` data-images-dir="${i.imagesDir}"` : '';
        return `<article class="news-item"${dirAttr}>${i.html}</article>`;
      }).join('');
    } catch (err) {
      // If fetch fails (e.g., file:// access blocked), leave fallback content in place
      console.error('news-preview: failed to load latest news', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLatestNews);
  } else {
    loadLatestNews();
  }
})();
