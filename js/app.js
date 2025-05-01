// js/app.js

// Funciones existentes:
function togglePasarela(e) { /* … */ }
function scrollToSection(e) { /* … */ }
function flipCard(card) { /* … */ }
function togglePanel(id) { /* … */ }

// Delegación de eventos
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    // Ejemplo: pasarela
    const header = e.target.closest('.pasarela-header');
    if (header) return togglePasarela({ currentTarget: header });

    // Hero buttons
    const btn = e.target.closest('.btn[data-target]');
    if (btn) return scrollToSection({ currentTarget: btn });

    // Flip cards
    const card = e.target.closest('.recording-card');
    if (card) return flipCard(card);

    // Panels
    const panelBtn = e.target.closest('[data-panel]');
    if (panelBtn) return togglePanel(panelBtn.dataset.panel);

    // Cerrar paneles
    if (e.target.classList.contains('close-btn') || e.target.classList.contains('panel')) {
      togglePanel(); // (o la lógica de cierre que uses)
    }
  });

  // Touch breve para flip
  let t0;
  document.body.addEventListener('touchstart', e => {
    if (e.target.closest('.recording-card')) t0 = Date.now();
  }, { passive: true });
  document.body.addEventListener('touchend', e => {
    const card = e.target.closest('.recording-card');
    if (card && Date.now() - t0 < 300) flipCard(card);
  }, { passive: true });
});

// Polyfill para scroll suave en Safari
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    script.onload = () => console.log('Smoothscroll polyfill cargado');
    script.onerror = err => console.error('Error al cargar smoothscroll polyfill:', err);
    document.head.appendChild(script);
  }
  
  // Variables y caché de selectores
  let pasarelaItems = [];
  let panels = [];
  let pauseIframes = [];
  
  function initCache() {
    pasarelaItems = Array.from(document.querySelectorAll('.pasarela-item'));
    panels = Array.from(document.querySelectorAll('.panel'));
    pauseIframes = Array.from(document.querySelectorAll('iframe'));
  }
  
  // Alternar acordeones (pasarela)
  function togglePasarela(header) {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');
    const content = document.getElementById(item.id + '-content');
  
    header.setAttribute('aria-expanded', !isActive);
  
    pasarelaItems.forEach(i => {
      const hdr = i.querySelector('.pasarela-header');
      const cnt = document.getElementById(i.id + '-content');
      if (i !== item) {
        i.classList.remove('active');
        hdr && hdr.setAttribute('aria-expanded', 'false');
        cnt && cnt.setAttribute('aria-hidden', 'true');
      }
    });
  
    if (!isActive) {
      item.classList.add('active');
      content && content.setAttribute('aria-hidden', 'false');
      window.requestAnimationFrame(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      item.classList.remove('active');
      content && content.setAttribute('aria-hidden', 'true');
    }
  }
  
  // Scroll a sección desde botones del hero
  function scrollToSection(btn) {
    const targetId = btn.getAttribute('data-target');
    const targetItem = document.getElementById(targetId);
    if (!targetItem) return;
    const header = targetItem.querySelector('.pasarela-header');
    if (header) togglePasarela(header);
  }
  
  // Voltear tarjetas de grabación y pausar iframes
  function flipCard(card) {
    pauseIframes.forEach(video => {
      video.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
    card.classList.toggle('flipped');
  }
  
  // Abrir o cerrar paneles (media, info, links, residencias)
  function togglePanel(panelId) {
    panels.forEach(p => {
      p.classList.remove('active');
      p.hidden = true;
    });
    document.body.style.overflow = '';
  
    if (!panelId) return;
    const panel = document.getElementById(panelId);
    if (!panel) return;
  
    panel.classList.add('active');
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
  
    const closeBtn = panel.querySelector('.close-btn');
    closeBtn && setTimeout(() => closeBtn.focus(), 100);
  }
  
  // Delegación de eventos y gestión de interacciones
  document.addEventListener('DOMContentLoaded', () => {
    initCache();
    const body = document.body;
  
    // Manejo de clicks para acordeones, hero, tarjetas y paneles
    body.addEventListener('click', e => {
      const header = e.target.closest('.pasarela-header');
      if (header) return togglePasarela(header);
  
      const heroBtn = e.target.closest('.btn[data-target]');
      if (heroBtn) return scrollToSection(heroBtn);
  
      const card = e.target.closest('.recording-card');
      if (card) return flipCard(card);
  
      const panelBtn = e.target.closest('[data-panel]');
      if (panelBtn) return togglePanel(panelBtn.dataset.panel);
  
      if (e.target.classList.contains('close-btn') || e.target.classList.contains('panel')) {
        return togglePanel();
      }
    });
  
    // Teclas Enter o Espacio para activar acordeones
    body.addEventListener('keydown', e => {
      const header = e.target.closest('.pasarela-header');
      if (header && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        togglePasarela(header);
      }
    });
  
    // Soporte táctil para flip de tarjetas
    let touchStartTime = 0;
    body.addEventListener('touchstart', e => {
      if (e.target.closest('.recording-card')) {
        touchStartTime = Date.now();
      }
    }, { passive: true });
  
    body.addEventListener('touchend', e => {
      const card = e.target.closest('.recording-card');
      if (card && Date.now() - touchStartTime < 300) {
        flipCard(card);
      }
    }, { passive: true });
  });
  