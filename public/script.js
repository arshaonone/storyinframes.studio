/* ============================================================
   StoryInFrames Studio — script.js
   Features:
   · 3D tilt on all cards (mouse-tracked perspective transform)
   · 3D button press depth
   · Scroll parallax on hero headline
   · Navbar sticky
   · Burger menu
   · Services accordion
   · Drag-to-scroll testimonials
   · Scroll-reveal IntersectionObserver
   · Smooth anchor scroll
   · Contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     3D TILT ENGINE
     Applies perspective rotateX / rotateY based on mouse
     position relative to the card's bounding box.
     Each element is independently tilted.
  ────────────────────────────────────────────────────────── */
  const TILT_MAX   = 14;  // max degrees of tilt
  const TILT_SCALE = 1.04; // slight scale-up on hover

  function applyTilt(el, e) {
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);  // −1 … +1
    const dy   = (e.clientY - cy) / (rect.height / 2);  // −1 … +1

    const rotX = (-dy * TILT_MAX).toFixed(2);
    const rotY = ( dx * TILT_MAX).toFixed(2);

    // Pull the perspective value from CSS if set, else default
    const persp = el.style.perspective || '1000px';

    el.classList.remove('tilt-reset');
    el.style.transform =
      `perspective(${persp}) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${TILT_SCALE}) translateZ(6px)`;

    // Dynamic shadow that moves with the tilt
    const shadowX = (dx * 14).toFixed(1);
    const shadowY = (dy * 14).toFixed(1);
    el.style.boxShadow =
      `${shadowX}px ${shadowY}px 40px rgba(17,16,16,0.14), 0 2px 0 rgba(17,16,16,0.06)`;
  }

  function resetTilt(el) {
    el.classList.add('tilt-reset');
    el.style.transform  = '';
    el.style.boxShadow  = '';
    // Clean the class after transition
    setTimeout(() => el.classList.remove('tilt-reset'), 700);
  }

  function bindTilt(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', e => applyTilt(el, e));
      el.addEventListener('mouseleave', () => resetTilt(el));
    });
  }

  // Apply tilt to: portfolio cards, stat cards, testimonials, about stats
  bindTilt('.wg-card');
  bindTilt('.hero-stat-card');
  bindTilt('.ts-card');
  bindTilt('.as-item');
  bindTilt('.hero-avail-badge');
  bindTilt('.about-img-caption');

  // Filmstrip frames — lighter tilt
  document.querySelectorAll('.fs-frame').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const dy   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      el.classList.remove('tilt-reset');
      el.style.transform =
        `perspective(800px) rotateX(${(-dy * 8).toFixed(2)}deg) rotateY(${(dx * 8).toFixed(2)}deg) scale(1.06) translateZ(8px)`;
    });
    el.addEventListener('mouseleave', () => resetTilt(el));
  });

  /* ──────────────────────────────────────────────────────────
     NAVBAR STICKY
  ────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('stuck', window.scrollY > 60);
    updateActiveLink();
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  function updateActiveLink() {
    const sy = window.scrollY + 140;
    document.querySelectorAll('section[id]').forEach(sec => {
      const link = document.querySelector(`.nl[href="#${sec.id}"]`);
      if (!link) return;
      if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
        document.querySelectorAll('.nl').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     BURGER MENU
  ────────────────────────────────────────────────────────── */
  const burger    = document.getElementById('burger');
  const navCenter = document.getElementById('navCenter');

  if (burger && navCenter) {
    burger.addEventListener('click', () => {
      const open = navCenter.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
      const [s1, s2] = burger.querySelectorAll('span');
      if (open) {
        s1.style.transform = 'rotate(42deg) translate(4px, 5px)';
        s2.style.transform = 'rotate(-42deg) translate(4px, -5px)';
      } else {
        s1.style.transform = '';
        s2.style.transform = '';
      }
    });
    navCenter.querySelectorAll('.nl').forEach(l => {
      l.addEventListener('click', () => {
        navCenter.classList.remove('open');
        document.body.style.overflow = '';
        burger.querySelectorAll('span').forEach(s => s.style.transform = '');
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     SERVICES ACCORDION
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.srv').forEach(srv => {
    const top = srv.querySelector('.srv-top');
    if (!top) return;
    top.addEventListener('click', () => {
      const isOpen = srv.classList.contains('open');
      document.querySelectorAll('.srv.open').forEach(s => s.classList.remove('open'));
      if (!isOpen) srv.classList.add('open');
    });
  });
  // Open first by default
  const firstSrv = document.querySelector('.srv');
  if (firstSrv) firstSrv.classList.add('open');

  /* ──────────────────────────────────────────────────────────
     DRAG-TO-SCROLL — TESTIMONIALS
  ────────────────────────────────────────────────────────── */
  const scroller = document.querySelector('.testimonials-scroller');
  if (scroller) {
    let isDown = false, startX, startScroll;

    scroller.addEventListener('mousedown', e => {
      isDown = true;
      scroller.classList.add('grabbing');
      startX      = e.pageX - scroller.offsetLeft;
      startScroll = scroller.scrollLeft;
    });
    scroller.addEventListener('mouseleave', () => { isDown = false; scroller.classList.remove('grabbing'); });
    scroller.addEventListener('mouseup',    () => { isDown = false; scroller.classList.remove('grabbing'); });
    scroller.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroller.offsetLeft;
      scroller.scrollLeft = startScroll - (x - startX);
    });
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL — IntersectionObserver
  ────────────────────────────────────────────────────────── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseFloat(entry.target.dataset.delay || 0) * 130;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealIO.unobserve(entry.target);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  // Stagger fade-in for individual items inside sections
  const staggerEls = document.querySelectorAll('.as-item, .ts-card, .wg-card, .hero-stat-card, .cd-item');
  staggerEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform += ' translateY(22px)';
    el.style.transition = `opacity 0.65s ease ${i * 0.08}s, transform 0.65s ease ${i * 0.08}s`;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      el.style.opacity   = '1';
      el.style.transform = el.style.transform.replace('translateY(22px)', '');
      // After reveal, restore 3D-tilt transitions so tilt JS can work
      setTimeout(() => {
        el.style.transition = '';
      }, 800 + i * 80);
      obs.unobserve(el);
    }, { threshold: 0.10 });
    obs.observe(el);
  });

  /* ──────────────────────────────────────────────────────────
     HERO PARALLAX — headline drifts up slowly on scroll
  ────────────────────────────────────────────────────────── */
  const heroHeadline = document.querySelector('.hero-headline');
  const heroOrbs     = document.querySelectorAll('.hero-orb-1, .hero-orb-2, .hero-orb-3');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroHeadline && sy < window.innerHeight) {
      heroHeadline.style.transform = `translateY(${(sy * 0.06).toFixed(1)}px)`;
    }
    // Orbs move at different rates — parallax depth layers
    if (sy < window.innerHeight) {
      heroOrbs.forEach((orb, i) => {
        const rate = 0.05 + i * 0.03;
        orb.style.transform = `translateY(${(sy * rate).toFixed(1)}px)`;
      });
    }
  }, { passive: true });

  /* ──────────────────────────────────────────────────────────
     CONTACT FORM
  ────────────────────────────────────────────────────────── */
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn     = document.getElementById('cf-submit-btn');
    const success = document.getElementById('cfSuccess');
    if (btn) {
      btn.disabled = true;
      const txt = btn.querySelector('.cf-submit-text');
      if (txt) txt.textContent = 'Sending…';
      // 3D press feedback
      btn.style.transform = 'perspective(600px) translateY(3px) translateZ(0)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    }
    setTimeout(() => {
      if (btn)     btn.style.display = 'none';
      if (success) success.classList.add('show');
    }, 900);
  };

  /* ──────────────────────────────────────────────────────────
     SMOOTH ANCHOR SCROLL
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     NAV CTA — 3D press on click
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.nav-cta, .btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease';
    });
    btn.addEventListener('mouseup', () => {
      setTimeout(() => { btn.style.transition = ''; }, 120);
    });
  });

});
