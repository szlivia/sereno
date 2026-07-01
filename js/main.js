/* ===========================================================
   Sereno Psicologia — interactions
   Reescrito em JS puro (sem dependência do runtime do Claude
   Design / support.js). Usa os mesmos atributos data-* que já
   existiam na marcação para conectar os comportamentos.
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers: underline / fill / arrow hover effects ---------- */

  document.querySelectorAll('[data-navlink]').forEach((link) => {
    const underline = link.querySelector('[data-und]');
    if (!underline) return;
    link.addEventListener('mouseenter', () => { underline.style.width = '100%'; });
    link.addEventListener('mouseleave', () => { underline.style.width = '0'; });
  });

  const ctaLink = document.querySelector('[data-cta]');
  if (ctaLink) {
    ctaLink.addEventListener('mouseenter', () => {
      ctaLink.style.background = '#2B2A26';
      ctaLink.style.color = '#F1EFE8';
      ctaLink.style.borderColor = '#2B2A26';
    });
    ctaLink.addEventListener('mouseleave', () => {
      ctaLink.style.background = 'transparent';
      ctaLink.style.color = '#2B2A26';
      ctaLink.style.borderColor = 'rgba(43,42,38,.28)';
    });
  }

  document.querySelectorAll('[data-fillbtn]').forEach((btn) => {
    const fill = btn.querySelector('[data-fill]');
    if (!fill) return;
    btn.addEventListener('mouseenter', () => { fill.style.transform = 'translateY(0)'; });
    btn.addEventListener('mouseleave', () => { fill.style.transform = 'translateY(101%)'; });
  });

  document.querySelectorAll('[data-arrowlink]').forEach((link) => {
    const arrow = link.querySelector('[data-arrow]');
    if (!arrow) return;
    link.addEventListener('mouseenter', () => { arrow.style.transform = 'translateX(6px)'; });
    link.addEventListener('mouseleave', () => { arrow.style.transform = 'translateX(0)'; });
  });

  /* ---------- services index rows (expand on hover/focus) ---------- */

  document.querySelectorAll('[data-row]').forEach((row) => {
    const desc = row.querySelector('[data-desc]');
    const thumb = row.querySelector('[data-thumb]');
    const num = row.querySelector('[data-num]');

    const enter = () => {
      row.style.paddingLeft = '18px';
      if (desc) { desc.style.maxHeight = desc.scrollHeight + 'px'; desc.style.opacity = '1'; }
      if (thumb) { thumb.style.transform = 'scale(1) rotate(-5deg)'; thumb.style.opacity = '1'; }
      if (num) num.style.color = '#5E7682';
    };
    const leave = () => {
      row.style.paddingLeft = '0';
      if (desc) { desc.style.maxHeight = '0px'; desc.style.opacity = '0'; }
      if (thumb) { thumb.style.transform = 'scale(.82) rotate(0deg)'; thumb.style.opacity = '.35'; }
      if (num) num.style.color = '#a3a199';
    };

    row.addEventListener('mouseenter', enter);
    row.addEventListener('mouseleave', leave);
    row.addEventListener('focus', enter);
    row.addEventListener('blur', leave);
  });

  /* ---------- FAQ accordion ---------- */

  document.querySelectorAll('[data-faq-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const answer = btn.parentElement.querySelector('[data-answer]');
      const icon = btn.querySelector('[data-ic]');
      if (!answer) return;
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      if (isOpen) {
        answer.style.maxHeight = '0px';
        answer.style.opacity = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        if (icon) icon.style.transform = 'rotate(135deg)';
      }
    });
  });

  /* ---------- scroll reveals (IntersectionObserver) ---------- */

  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));

  if (!reduce && revealEls.length) {
    revealEls.forEach((el) => {
      const dir = el.getAttribute('data-reveal');
      el.style.opacity = '0';
      el.style.transform = dir === 'left' ? 'translateX(-46px)' : dir === 'right' ? 'translateX(46px)' : 'translateY(36px)';
      el.style.transition = 'opacity 1.05s cubic-bezier(.22,.61,.36,1), transform 1.05s cubic-bezier(.22,.61,.36,1)';
      el.style.willChange = 'opacity, transform';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.getAttribute('data-delay') || '0');
        el.style.transitionDelay = delay + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'none';
        io.unobserve(el);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- nav background + parallax on scroll ---------- */

  const nav = document.querySelector('[data-nav]');
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.pageYOffset;

    if (nav) {
      if (y > 40) {
        nav.style.background = 'rgba(241,239,232,.82)';
        nav.style.backdropFilter = 'blur(14px)';
        nav.style.webkitBackdropFilter = 'blur(14px)';
        nav.style.boxShadow = '0 1px 0 rgba(43,42,38,.07)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.webkitBackdropFilter = 'none';
        nav.style.boxShadow = 'none';
      }
    }

    if (!reduce) {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const off = center - vh / 2;
        el.style.transform = `translate3d(0, ${(-off * speed).toFixed(1)}px, 0)`;
      });
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
});
