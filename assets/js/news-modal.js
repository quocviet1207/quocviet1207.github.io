// news-modal.js
// Delegated click: open modal when user clicks a news title (<strong> inside .news-meta)
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
          <div class="modal-main-image-wrap">
            <button class="modal-nav modal-prev" aria-label="Previous photo">&#8249;</button>
            <img class="modal-image" src="" alt="">
            <button class="modal-nav modal-next" aria-label="Next photo">&#8250;</button>
          </div>
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

  // Build image gallery with prev/next navigation inside the modal
  function buildImageElements(images, modal) {
    const mainImg = modal.querySelector('.modal-image');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    const thumbsWrap = modal.querySelector('.modal-thumbs');

    thumbsWrap.innerHTML = '';
    let current = 0;

    if (!images || !images.length) {
      mainImg.src = '';
      mainImg.style.display = 'none';
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      return;
    }

    mainImg.style.display = '';
    const multipleImages = images.length > 1;
    prevBtn.style.display = multipleImages ? '' : 'none';
    nextBtn.style.display = multipleImages ? '' : 'none';

    function goTo(idx) {
      current = (idx + images.length) % images.length;
      mainImg.src = images[current];
      // Highlight active thumbnail
      thumbsWrap.querySelectorAll('.modal-thumb').forEach((t, i) => {
        t.style.borderColor = i === current ? '#003373' : 'transparent';
      });
    }

    prevBtn.onclick = () => goTo(current - 1);
    nextBtn.onclick = () => goTo(current + 1);

    images.forEach((src, idx) => {
      const t = document.createElement('img');
      t.className = 'modal-thumb';
      t.src = src;
      t.title = `Photo ${idx + 1} of ${images.length}`;
      t.addEventListener('click', () => goTo(idx));
      thumbsWrap.appendChild(t);
    });

    goTo(0);
  }

  function attach() {
    const { overlay, modal } = createModalNode();
    const closeBtn = modal.querySelector('.modal-close');
    const titleEl  = modal.querySelector('.modal-title');
    const dateEl   = modal.querySelector('.modal-date');
    const descEl   = modal.querySelector('.modal-desc');

    function open(data) {
      titleEl.textContent = data.title || '';
      dateEl.textContent  = data.date  || '';
      descEl.innerHTML    = data.htmlDescription || data.description || '';
      buildImageElements(data.images || [], modal);
      showOverlay(overlay);
    }

    function close() { hideOverlay(overlay); }

    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
    closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', (ev) => {
      if (overlay.classList.contains('hidden')) return;
      if (ev.key === 'Escape')      close();
      if (ev.key === 'ArrowLeft')  modal.querySelector('.modal-prev').click();
      if (ev.key === 'ArrowRight') modal.querySelector('.modal-next').click();
    });

    // Delegated click: title is <strong> inside .news-meta
    document.addEventListener('click', async (ev) => {
      const strong = ev.target.closest('.news-meta strong');
      if (!strong) return;
      const item = strong.closest('.news-item');
      if (!item) return;

      const dateElSrc = item.querySelector('.news-date');
      const date = dateElSrc ? dateElSrc.textContent.trim() : '';
      const title = strong.textContent.trim();
      const p = item.querySelector('p');
      const description     = p ? p.textContent.trim() : '';
      const htmlDescription = p ? p.innerHTML : '';

      // Gather images — three possible sources:
      // 1) inline <img> tags inside the article
      let images = Array.from(item.querySelectorAll('img')).map(i => i.getAttribute('src'));

      // 2) data-images attribute (comma/semicolon-separated list)
      if (!images.length) {
        const data = item.getAttribute('data-images');
        if (data) images = data.split(/[,;]\s*/).map(s => s.trim()).filter(Boolean);
      }

      // 3) data-images-dir: fetch list.json from that folder
      const dir = item.getAttribute('data-images-dir');
      if (!images.length && dir) {
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
        } catch (e) { /* ignore fetch errors */ }
      }

      // Normalize all paths relative to current page
      images = images.map(src => {
        try { return new URL(src, location.href).href; }
        catch (e) { return src; }
      });

      open({ title, date, description, htmlDescription, images });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
