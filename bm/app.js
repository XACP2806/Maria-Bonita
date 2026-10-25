(() => {
  'use strict';
  const catalog = window.BM_CATALOG;
  const dialog = document.querySelector('.product-dialog');
  const menu = document.querySelector('#mobile-menu');
  const toggle = document.querySelector('.menu-toggle');
  const hero = document.querySelector('.hero');
  const visual = document.querySelector('.hero-visual');
  const backdrop = document.querySelector('.menu-backdrop');
  const navigation = document.querySelector('.mobile-nav');
  const detailImage = document.querySelector('#detail-image');
  const thumbnails = document.querySelector('.thumbnails');
  const galleryControls = document.querySelector('.gallery-controls');
  let currentProduct;
  let currentPhoto = 0;
  let opener;
  let returnHash = '#drop-001';
  let openedFromCard = false;
  let menuScrollOrigin = 0;

  function closeMenu() {
    menu.hidden = true;
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }
  toggle.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    backdrop.hidden = !open;
    if (open) menuScrollOrigin = window.scrollY;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.mobile-nav')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); closeMenu(); toggle.focus({ preventScroll: true }); }
  });
  navigation.addEventListener('focusout', event => {
    if (event.relatedTarget && !navigation.contains(event.relatedTarget)) closeMenu();
  });
  document.querySelectorAll('a[href="#drop-001"], a[href="#redes"], a[href="#inicio"]').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      const target = document.querySelector(link.getAttribute('href'));
      if (target?.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    });
  });
  const portrait = window.matchMedia('(max-width: 767px) and (orientation: portrait)');
  portrait.addEventListener('change', closeMenu);
  // The sticky cover stays still while the white catalogue slides over it.
  // Disable its controls once covered; close an open menu when scrolling away.
  let scrollFrame = 0;
  function updateHero() {
    scrollFrame = 0;
    visual.inert = window.scrollY >= hero.offsetHeight;
    if (!menu.hidden && (visual.inert || Math.abs(window.scrollY - menuScrollOrigin) > 12)) closeMenu();
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHero);
  }, { passive: true });
  window.addEventListener('resize', updateHero);
  updateHero();

  function showPhoto(index) {
    currentPhoto = (index + currentProduct.images.length) % currentProduct.images.length;
    detailImage.src = currentProduct.images[currentPhoto];
    detailImage.alt = `${currentProduct.name}, ${['vista frontal', 'vista posterior', 'con modelo'][currentPhoto] || `foto ${currentPhoto + 1}`}`;
    document.querySelector('#photo-count').textContent = `${currentPhoto + 1} / ${currentProduct.images.length}`;
    thumbnails.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-current', String(i === currentPhoto)));
  }
  function openProduct(product) {
    currentProduct = product;
    document.querySelector('#product-title').textContent = product.name;
    document.querySelector('#product-price').textContent = `$${product.price}`;
    const options = document.querySelector('.size-options');
    options.replaceChildren();
    product.sizes.forEach(size => {
      const label = document.createElement('label');
      label.className = 'size-option';
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'talla'; input.value = size;
      const text = document.createElement('span'); text.textContent = size;
      label.append(input, text); options.append(label);
    });
    thumbnails.replaceChildren();
    product.images.forEach((src, i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'thumbnail';
      button.setAttribute('aria-label', `Ver foto ${i + 1} de ${product.name}`);
      const img = document.createElement('img'); img.src = src; img.alt = '';
      button.append(img); button.addEventListener('click', () => showPhoto(i));
      thumbnails.append(button);
    });
    thumbnails.hidden = product.images.length < 2;
    galleryControls.hidden = product.images.length < 2;
    showPhoto(0);
    const contact = document.querySelector('#availability-link');
    if (catalog.instagramChat) {
      contact.href = catalog.instagramChat;
      contact.target = '_blank'; contact.rel = 'noopener noreferrer';
      contact.removeAttribute('aria-disabled');
    }
    closeMenu();
    if (!dialog.open) { document.body.classList.add('dialog-open'); dialog.showModal(); }
    dialog.scrollTop = 0;
  }
  function hideProduct() {
    if (!dialog.open) return;
    dialog.close();
    document.body.classList.remove('dialog-open');
    opener?.focus({ preventScroll: true });
  }
  function syncProduct() {
    const id = location.hash.replace('#camisa-', '');
    const product = location.hash.startsWith('#camisa-') && catalog.products.find(item => item.id === id);
    if (product) openProduct(product); else hideProduct();
  }
  document.querySelectorAll('[data-product]').forEach(card => {
    card.addEventListener('click', event => {
      event.preventDefault();
      opener = card; returnHash = location.hash || '#drop-001'; openedFromCard = true;
      history.pushState({ bmProduct: card.dataset.product }, '', card.getAttribute('href'));
      syncProduct();
    });
  });
  function requestClose() {
    if (openedFromCard) { openedFromCard = false; history.back(); }
    else { history.replaceState(null, '', returnHash); hideProduct(); }
  }
  dialog.querySelector('.close-button').addEventListener('click', requestClose);
  dialog.querySelector('.back-button').addEventListener('click', requestClose);
  dialog.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
  galleryControls.querySelectorAll('button').forEach(button => button.addEventListener('click', () => showPhoto(currentPhoto + Number(button.dataset.direction))));
  window.addEventListener('popstate', syncProduct);
  window.addEventListener('hashchange', () => { if (!dialog.open || !location.hash.startsWith('#camisa-')) syncProduct(); });
  document.querySelectorAll('[data-social]').forEach(element => {
    const url = catalog[element.dataset.social];
    if (!url) { element.hidden = true; return; }
    const link = document.createElement('a'); link.href = url; link.textContent = element.textContent;
    link.target = '_blank'; link.rel = 'noopener noreferrer'; element.replaceWith(link);
  });
  syncProduct();
})();
