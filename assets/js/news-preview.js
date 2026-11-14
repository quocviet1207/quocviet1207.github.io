// Fetch the news page and display the 3 most recent .news-item entries (sorted by date, any order in the file)
(function () {
  // Turn a news date into a number for sorting.
  // Accepts "23 Oct 2026" (current format) and "2026-10-23" (older format).
  const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function toTime(text) {
    let m = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
    m = text.match(/^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})$/);
    if (m && m[2].toLowerCase() in MONTHS) return Date.UTC(+m[3], MONTHS[m[2].toLowerCase()], +m[1]);
    return 0; // unknown format sorts last
  }

  async function loadLatestNews() {
    try {
      const newsUrl = new URL('pages/news.html', location.href);
      const resp = await fetch(newsUrl, { cache: 'no-store' });
      if (!resp.ok) throw new Error('Network response was not ok');
      const text = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Paths in news.html are relative to pages/; make them absolute so they work on the homepage
      doc.querySelectorAll('.news-item img').forEach(img => {
        img.setAttribute('src', new URL(img.getAttribute('src'), newsUrl).href);
      });
      doc.querySelectorAll('.news-item[data-images-dir]').forEach(el => {
        el.setAttribute('data-images-dir', new URL(el.getAttribute('data-images-dir').replace(/\/?$/, '/'), newsUrl).href);
      });

      const items = Array.from(doc.querySelectorAll('.news-item'))
        .map(el => {
          const dateEl = el.querySelector('.news-date');
          const date = dateEl ? dateEl.textContent.trim() : '';
          const imagesDir = el.getAttribute('data-images-dir') || '';
          return { date, html: el.innerHTML, imagesDir };
        })
        .filter(i => i.date)
        .sort((a, b) => toTime(b.date) - toTime(a.date)); // newest first

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
