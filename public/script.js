/* ============================================================
   StoryInFrames — script.js  (Premium White Theme)
   Custom cursor · Navbar · Accordion · Drag scroll · Reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Custom Cursor ─────────────────────────────────────── */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  });

  function animateRing() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand cursor on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .wg-card, .srv-top, .fs-frame, .ts-card, .as-item');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) { ring.style.width = '54px'; ring.style.height = '54px'; ring.style.borderColor = 'rgba(184,104,42,0.7)'; }
    });
    el.addEventListener('mouseleave', () => {
      if (ring) { ring.style.width = '30px'; ring.style.height = '30px'; ring.style.borderColor = 'rgba(184,104,42,0.45)'; }
    });
  });

  /* ─── Navbar sticky ─────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('stuck', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const sy = window.scrollY + 140;
    sections.forEach(sec => {
      const link = document.querySelector(`.nl[href="#${sec.id}"]`);
      if (!link) return;
      if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
        document.querySelectorAll('.nl').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  /* ─── Burger menu ───────────────────────────────────────── */
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
        s1.style.transform = ''; s2.style.transform = '';
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

  /* ─── Services accordion ──────────────────────────────── */
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

  /* ─── Drag-to-scroll testimonials ───────────────────────── */
  const scroller = document.querySelector('.testimonials-scroller');
  if (scroller) {
    let isDown = false, startX, startScroll;
    scroller.addEventListener('mousedown', e => {
      isDown = true; scroller.classList.add('grabbing');
      startX = e.pageX - scroller.offsetLeft;
      startScroll = scroller.scrollLeft;
    });
    scroller.addEventListener('mouseleave', () => { isDown = false; scroller.classList.remove('grabbing'); });
    scroller.addEventListener('mouseup',    () => { isDown = false; scroller.classList.remove('grabbing'); });
    scroller.addEventListener('mousemove',  e => {
      if (!isDown) return; e.preventDefault();
      const x = e.pageX - scroller.offsetLeft;
      scroller.scrollLeft = startScroll - (x - startX);
    });
  }

  /* ─── Scroll-reveal IntersectionObserver ─────────────────── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0) * 130;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  // Staggered reveal for cards / stat items
  const stagger = document.querySelectorAll('.as-item, .ts-card, .wg-card, .cd-item, .hsc-icon');
  stagger.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.65s ease ${i * 0.09}s, transform 0.65s ease ${i * 0.09}s`;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1'; el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
  });

  /* ─── Contact form ──────────────────────────────────────── */
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn     = document.getElementById('cf-submit-btn');
    const success = document.getElementById('cfSuccess');
    if (btn) {
      btn.disabled = true;
      const txt = btn.querySelector('.cf-submit-text');
      if (txt) txt.textContent = 'Sending…';
    }
    setTimeout(() => {
      if (btn) btn.style.display = 'none';
      if (success) success.classList.add('show');
    }, 900);
  };

  /* ─── Smooth anchor scrolling ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ─── Subtle headline parallax on scroll ──────────────── */
  const headline = document.querySelector('.hero-headline');
  window.addEventListener('scroll', () => {
    if (headline) headline.style.transform = `translateY(${window.scrollY * 0.055}px)`;
  }, { passive: true });

});
