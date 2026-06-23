/* ==========================================================================
   Guilherme Coelho Gama — Portfolio QA Engineer
   Vanilla JS — minimal, dependency-free, performance-first
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     Mobile navigation toggle
     --------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  function openMenu() {
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('is-open')) return;
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------------------------------------------------------------------
     Navbar elevated state on scroll
     --------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  let lastScrollState = false;

  function updateNavbarState() {
    const shouldElevate = window.scrollY > 12;
    if (shouldElevate !== lastScrollState) {
      navbar.classList.toggle('is-scrolled', shouldElevate);
      lastScrollState = shouldElevate;
    }
  }

  if (navbar) {
    window.addEventListener('scroll', updateNavbarState, { passive: true });
    updateNavbarState();
  }

  /* ---------------------------------------------------------------------
     Scroll-triggered reveal animations
     --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------------
     Active nav link highlighting based on section in view
     --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id], header#topo');
  const navLinks = document.querySelectorAll('.navlink');

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.nav === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------------------------------------------------------------------
     Copy email to clipboard
     --------------------------------------------------------------------- */
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyStatus = document.getElementById('copyStatus');

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      /* silently ignore — clipboard not available */
    }
    document.body.removeChild(textarea);
  }

  function showCopiedState() {
    const label = copyBtn.querySelector('.copy-btn__label');
    const copyIcon = copyBtn.querySelector('.icon--copy');
    const checkIcon = copyBtn.querySelector('.icon--check');

    copyBtn.classList.add('is-copied');
    if (label) label.textContent = 'Copiado!';
    if (copyIcon) copyIcon.hidden = true;
    if (checkIcon) checkIcon.hidden = false;
    if (copyStatus) copyStatus.textContent = 'E-mail copiado para a área de transferência.';

    window.setTimeout(() => {
      copyBtn.classList.remove('is-copied');
      if (label) label.textContent = 'Copiar';
      if (copyIcon) copyIcon.hidden = false;
      if (checkIcon) checkIcon.hidden = true;
      if (copyStatus) copyStatus.textContent = '';
    }, 2200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.dataset.email;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopiedState).catch(() => {
          fallbackCopy(email);
          showCopiedState();
        });
      } else {
        fallbackCopy(email);
        showCopiedState();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Back to top
     --------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  const yearEl = document.getElementById('anoAtual');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
