// news-modal.js
// Delegated click handler: open modal when user clicks a news title (<strong> inside .news-meta)
(function () {
  function createModalNode() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-header">
        <div class="modal-title"></div>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-left">
          <div class="modal-main-image-wrap"></div>
          <div class="modal-thumbs"></div>
        </div>
        <div class="modal-right">
          <div class="modal-date"></div>
          <div class="modal-desc"></div>
        </div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    return { overlay, modal };
  }

  function showOverlay(overlay) {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function hideOverlay(overlay) {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function buildImageElements(images, mainWrap, thumbsWrap) {
    mainWrap.innerHTML = '';
    thumbsWrap.innerHTML = '';
    if (!images || !images.length) return;

    let current = 0;
    const mainImg = document.createElement('img');
    mainImg.className = 'modal-image';
    mainImg.src = images[0];
    mainWrap.appendChild(mainImg);

    images.forEach((src, idx) => {
      const t = document.createElement('img');
      t.className = 'modal-thumb';
      t.src = src;
      t.title = `Image ${idx + 1}`;
      t.addEventListener('click', () => {
        current = idx;
        mainImg.src = images[current];
      });
      thumbsWrap.appendChild(t);
    });
  }

  function attach() {
    const { overlay, modal } = createModalNode();
    const closeBtn = modal.querySelector('.modal-close');
    const titleEl = modal.querySelector('.modal-title');
    const dateEl = modal.querySelector('.modal-date');
    const descEl = modal.querySelector('.modal-desc');
    const mainWrap = modal.querySelector('.modal-main-image-wrap');
    const thumbsWrap = modal.querySelector('.modal-thumbs');

    function open(data) {
      titleEl.textContent = data.title || '';
      dateEl.textContent = data.date || '';
      descEl.innerHTML = data.htmlDescription || data.description || '';
      buildImageElements(data.images || [], mainWrap, thumbsWrap);
      showOverlay(overlay);
    }

    function close() {
      hideOverlay(overlay);
    }

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') close();
    });

    // Delegated click: title elements are <strong> inside .news-meta
    document.addEventListener('click', async (ev) => {
      const strong = ev.target.closest('.news-meta strong');
      if (!strong) return;
      const item = strong.closest('.news-item');
      if (!item) return;

      const dateElSrc = item.querySelector('.news-date');
      const date = dateElSrc ? dateElSrc.textContent.trim() : '';
      const title = strong.textContent.trim();
      const p = item.querySelector('p');
      const description = p ? p.textContent.trim() : '';
      const htmlDescription = p ? p.innerHTML : '';

      // Gather images:
      // 1) inline <img> tags inside the article
      // 2) data-images attribute (comma/semicolon separated)
      // 3) data-images-dir attribute pointing to a folder with a list.json index
      let images = Array.from(item.querySelectorAll('img')).map(i => i.getAttribute('src'));
      if (!images.length) {
        const data = item.getAttribute('data-images');
        if (data) {
          images = data.split(/[,;]\s*/).map(s => s.trim()).filter(Boolean);
        }
      }

      const dir = item.getAttribute('data-images-dir');
      if (!images.length && dir) {
        // try fetching a list.json from the directory: expected format is ["img1.jpg","img2.png"]
        try {
          const listUrl = new URL(dir.replace(/\/$/, '') + '/list.json', location.href).href;
          const resp = await fetch(listUrl, { cache: 'no-store' });
          if (resp && resp.ok) {
            const arr = await resp.json();
            if (Array.isArray(arr)) {
              images = arr.map(name => {
                try { return new URL(name, dir.replace(/\/$/, '') + '/').href; }
                catch (e) { return dir.replace(/\/$/, '') + '/' + name; }
              }).filter(Boolean);
            }
          }
        } catch (e) {
          // ignore fetch errors; images will remain empty
          // console.warn('news-modal: failed to fetch list.json for', dir, e);
        }
      }

      // Normalize relative paths: resolve relative to current page
      images = images.map(src => {
        try {
          return new URL(src, location.href).href;
        } catch (e) {
          return src;
        }
      });

      open({ title, date, description, htmlDescription, images });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
