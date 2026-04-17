/* =============================================
   STORYINFRAMES STUDIO — SCRIPT v4.0
   Colorful Glassmorphism · Photography Studio
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════
     LOADER
  ═══════════════════════════════════════════ */
  const loader = document.getElementById('loader');
  const hideLoader = () => {
    loader.classList.add('hidden');
    initReveal();
    startCounters();
  };
  window.addEventListener('load', () => setTimeout(hideLoader, 2800));
  setTimeout(hideLoader, 3400); // Fallback


  /* ═══════════════════════════════════════════
     CUSTOM CURSOR
  ═══════════════════════════════════════════ */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (window.innerWidth > 520) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Smooth ring follow
    const loopCursor = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loopCursor);
    };
    loopCursor();

    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('click'));

    const hovers = 'a,button,.p-item,.svc-card,.f-btn,.c-card,.rv-card,.val-card,.ct-item';
    document.querySelectorAll(hovers).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('on'));
      el.addEventListener('mouseleave', () => ring.classList.remove('on'));
    });
  }


  /* ═══════════════════════════════════════════
     COLORFUL PARTICLE CANVAS (Hero)
  ═══════════════════════════════════════════ */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;

    // Vibrant color palette matching the CSS design
    const COLORS = [
      { r: 124, g: 58,  b: 237 }, // violet
      { r: 6,   g: 182, b: 212 }, // cyan
      { r: 244, g: 63,  b: 94  }, // rose
      { r: 245, g: 158, b: 11  }, // amber
      { r: 16,  g: 185, b: 129 }, // emerald
      { r: 167, g: 139, b: 250 }, // violet-light
      { r: 103, g: 232, b: 249 }, // cyan-light
    ];

    const resize = () => {
      W = canvas.width  = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = (a, b) => Math.random() * (b - a) + a;
    const N = 80;
    const pts = [];

    for (let i = 0; i < N; i++) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      pts.push({
        x:  rand(0, 1),
        y:  rand(0, 1),
        vx: rand(-0.00025, 0.00025),
        vy: rand(-0.0004, -0.0001),
        a:  rand(0.12, 0.60),
        s:  rand(0.4, 1.8),
        c,
        // Twinkle
        at:    rand(0, Math.PI * 2),
        aspd:  rand(0.4, 1.2),
      });
    }

    const LINK_DIST = 160;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      pts.forEach(p => {
        // Move
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

        // Twinkle alpha
        p.at += 0.016 * p.aspd;
        const alpha = p.a * (0.65 + 0.35 * Math.sin(p.at));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c.r},${p.c.g},${p.c.b},${alpha})`;
        ctx.fill();

        // Soft glow for larger particles
        if (p.s > 1.2) {
          const grd = ctx.createRadialGradient(
            p.x * W, p.y * H, 0,
            p.x * W, p.y * H, p.s * 4
          );
          grd.addColorStop(0, `rgba(${p.c.r},${p.c.g},${p.c.b},${alpha * 0.4})`);
          grd.addColorStop(1, `rgba(${p.c.r},${p.c.g},${p.c.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x * W, p.y * H, p.s * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      });

      // Colorful connecting lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx  = (pts[i].x - pts[j].x) * W;
          const dy  = (pts[i].y - pts[j].y) * H;
          const d   = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const t   = 1 - d / LINK_DIST;
            const ci  = pts[i].c;
            const cj  = pts[j].c;
            // Interpolate colours
            const r   = Math.round((ci.r + cj.r) / 2);
            const g   = Math.round((ci.g + cj.g) / 2);
            const b   = Math.round((ci.b + cj.b) / 2);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.055 * t})`;
            ctx.lineWidth   = 0.5;
            ctx.moveTo(pts[i].x * W, pts[i].y * H);
            ctx.lineTo(pts[j].x * W, pts[j].y * H);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };
    draw();

    // Interactive: particles flee from mouse
    let hx = -9999, hy = -9999;
    canvas.parentElement.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      hx = (e.clientX - r.left) / W;
      hy = (e.clientY - r.top)  / H;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { hx = -9999; hy = -9999; });

    // Override draw to add repulsion
    // We patch vx/vy every frame via a secondary loop check
    setInterval(() => {
      pts.forEach(p => {
        const dx = p.x - hx;
        const dy = p.y - hy;
        const d  = Math.sqrt(dx * dx + (dy * dy));
        if (d < 0.12) {
          const force = (0.12 - d) / 0.12 * 0.0004;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
          // Clamp velocity
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > 0.001) { p.vx *= 0.001 / spd; p.vy *= 0.001 / spd; }
        }
      });
    }, 40);
  }


  /* ═══════════════════════════════════════════
     NAVBAR
  ═══════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const menu   = document.getElementById('navMenu');
  const burger = document.getElementById('burger');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('on', window.scrollY > 55);
    syncActiveLink();
    toggleBtt();
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('on');
    menu.classList.toggle('on', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      burger.classList.remove('on');
      menu.classList.remove('on');
      document.body.style.overflow = '';
    });
  });

  function syncActiveLink() {
    const ids = ['home','portfolio','about','services','reviews','contact'];
    let cur = 'home';
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 240) cur = id;
    });
    document.querySelectorAll('.nav-link').forEach(l =>
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }


  /* ═══════════════════════════════════════════
     SMOOTH SCROLL
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 72, behavior: 'smooth' }); }
    });
  });


  /* ═══════════════════════════════════════════
     HERO PARALLAX
  ═══════════════════════════════════════════ */
  const heroImg = document.getElementById('heroImg');
  window.addEventListener('scroll', () => {
    if (!heroImg) return;
    const s = window.scrollY;
    if (s < window.innerHeight * 1.5) {
      heroImg.style.transform = `scale(1.08) translateY(${s * 0.10}px)`;
    }
  }, { passive: true });


  /* ═══════════════════════════════════════════
     SPOTLIGHT EFFECT (portfolio + service cards)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.p-item, .svc-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  });


  /* ═══════════════════════════════════════════
     3D TILT (service cards)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
      card.style.transform = `translateY(-10px) perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform   = '';
      card.style.transition  = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    });
  });


  /* ═══════════════════════════════════════════
     3D TILT (portfolio items)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.p-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const r = item.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
      item.style.transform  = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
      item.style.transition = 'transform 0.08s ease';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform  = '';
      item.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    });
  });


  /* ═══════════════════════════════════════════
     PORTFOLIO FILTER
  ═══════════════════════════════════════════ */
  const fBtns  = document.querySelectorAll('.f-btn');
  const pItems = document.querySelectorAll('.p-item');

  fBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.f;
      pItems.forEach((item, i) => {
        const show = f === 'all' || item.dataset.cat === f;
        item.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.45s ease ${i * 0.04}s`;
        item.style.opacity       = show ? '1' : '0.10';
        item.style.transform     = show ? '' : 'scale(0.95)';
        item.style.pointerEvents = show ? '' : 'none';
      });
    });
  });


  /* ═══════════════════════════════════════════
     ANIMATED COUNTERS
  ═══════════════════════════════════════════ */
  function startCounters() {
    document.querySelectorAll('.stat-n').forEach(el => {
      const target = +el.dataset.t;
      let cur = 0;
      const step = target / (2400 / 16);
      const tick = () => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }


  /* ═══════════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════════ */
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }


  /* ═══════════════════════════════════════════
     REVIEWS SLIDER
  ═══════════════════════════════════════════ */
  const rvTrack  = document.getElementById('rvTrack');
  const rvPrev   = document.getElementById('rvPrev');
  const rvNext   = document.getElementById('rvNext');
  const rvDots   = document.getElementById('rvDots');
  const rvCards  = Array.from(document.querySelectorAll('.rv-card'));
  let cur = 0, rvTimer;

  const vis      = () => window.innerWidth < 600 ? 1 : window.innerWidth < 1000 ? 2 : 3;
  const maxSlide = () => Math.max(0, rvCards.length - vis());

  const buildDots = () => {
    rvDots.innerHTML = '';
    const n = maxSlide() + 1;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('button');
      d.className = 'rv-dot' + (i === cur ? ' on' : '');
      d.setAttribute('aria-label', 'Review ' + (i + 1));
      d.addEventListener('click', () => goSlide(i));
      rvDots.appendChild(d);
    }
  };

  const goSlide = n => {
    cur = Math.max(0, Math.min(n, maxSlide()));
    if (rvCards[0]) {
      const gap = 24; // matches CSS gap 1.5rem ≈ 24px
      const cw  = rvCards[0].offsetWidth + gap;
      rvTrack.style.transform = `translateX(-${cur * cw}px)`;
    }
    rvDots.querySelectorAll('.rv-dot').forEach((d, i) =>
      d.classList.toggle('on', i === cur));
  };

  const autoRv = () => {
    clearInterval(rvTimer);
    rvTimer = setInterval(() => goSlide(cur >= maxSlide() ? 0 : cur + 1), 5000);
  };

  buildDots();
  autoRv();
  rvPrev.addEventListener('click', () => { goSlide(cur - 1); autoRv(); });
  rvNext.addEventListener('click', () => { goSlide(cur + 1); autoRv(); });
  window.addEventListener('resize', () => { buildDots(); goSlide(0); });

  // Touch swipe
  let tStart = 0;
  const rvSlider = document.getElementById('rvSlider');
  if (rvSlider) {
    rvSlider.addEventListener('touchstart', e => { tStart = e.changedTouches[0].clientX; }, { passive: true });
    rvSlider.addEventListener('touchend', e => {
      const diff = tStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goSlide(cur + 1) : goSlide(cur - 1); autoRv(); }
    });
  }


  /* ═══════════════════════════════════════════
     CONTACT FORM
  ═══════════════════════════════════════════ */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('cSuccess');
  const submit  = document.getElementById('cSubmit');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const n = document.getElementById('cName').value.trim();
      const m = document.getElementById('cEmail').value.trim();
      const t = document.getElementById('cMsg').value.trim();
      if (!n || !m || !t) return;
      submit.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      submit.disabled   = true;
      setTimeout(() => {
        submit.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submit.style.background = 'linear-gradient(135deg,#10b981,#06b6d4)';
        success.classList.add('on');
        form.reset();
        setTimeout(() => {
          submit.innerHTML     = 'Send Message <i class="fas fa-paper-plane"></i>';
          submit.disabled      = false;
          submit.style.background = '';
          success.classList.remove('on');
        }, 5000);
      }, 1800);
    });
  }


  /* ═══════════════════════════════════════════
     BACK TO TOP
  ═══════════════════════════════════════════ */
  const btt = document.getElementById('btt');
  function toggleBtt() { btt.classList.toggle('on', window.scrollY > 600); }
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ═══════════════════════════════════════════
     MODAL
  ═══════════════════════════════════════════ */
  const modalOv    = document.getElementById('modalOv');
  const modalClose = document.getElementById('modalClose');
  const modalBody  = document.getElementById('modalBody');

  const projects = {
    w1:  { tag:'Wedding Film',         img:'assets/portfolio_wedding.png',    title:'Sofia & Marco',       loc:'📍 Tuscany, Italy',               desc:'A breathtaking wedding film set amidst the rolling hills and golden vineyards of Tuscany. Captured over two full days with a team of three cinematographers using cinema-grade cameras and aerial drones. The warm golden-hour light and ancient stone architecture created the perfect canvas for an eternal love story.' },
    w2:  { tag:'Wedding Film',         img:'assets/portfolio_wedding.png',    title:'Emma & James',        loc:'📍 Cotswolds, United Kingdom',     desc:'Shot across the idyllic English countryside, this wedding film tells the story of a day full of laughter, tears of joy, and unforgettable moments. Our drone captured sweeping aerial landscapes of rolling green hills that frame every scene with soft, dreamlike beauty.' },
    t1:  { tag:'Travel & Cinematic',   img:'assets/portfolio_travel.png',     title:'Amalfi Dreamscape',   loc:'📍 Amalfi Coast, Italy',           desc:'A cinematic travel documentary exploring the dramatic beauty of the Amalfi coastline. Shot over five days with a full cinema package including drone, underwater, and timelapse cinematography. This project earned over 1 million views on YouTube.' },
    c1:  { tag:'Commercial',           img:'assets/portfolio_commercial.png', title:'Maison Lumière',      loc:'📍 Paris, France',                 desc:'A sleek, high-fashion commercial produced for luxury Parisian brand Maison Lumière. Shot across iconic Parisian locations over three days, this campaign combined editorial photography with a cinematic 60-second hero film delivered across broadcast and digital platforms.' },
    c2:  { tag:'Commercial',           img:'assets/portfolio_commercial.png', title:'Noir Identity Film',  loc:'📍 Berlin, Germany',               desc:'A bold, high-contrast brand identity film for a Berlin-based creative agency. Shot partially on 35mm film for an authentic grain and texture that digital cannot replicate, combined with 6K digital footage for maximum versatility.' },
    ph1: { tag:'Fine Art Photography', img:'assets/portfolio_photo.png',      title:'Elegance Series',     loc:'📍 London, United Kingdom',        desc:'A fine-art portrait series exploring colour, light, and identity. Commissioned for a London gallery exhibition, these images have since been featured in Vogue Italia and several international photography publications. Shot over two weeks in our London studio.' }
  };

  window.openModal = id => {
    const p = projects[id];
    if (!p) return;
    modalBody.innerHTML = `
      <span class="modal-type">${p.tag}</span>
      <img src="${p.img}" alt="${p.title}" />
      <h2 class="modal-title">${p.title}</h2>
      <span class="modal-loc">${p.loc}</span>
      <p class="modal-desc">${p.desc}</p>
      <a href="#contact" class="btn btn-gold" onclick="closeModal()" style="margin-top:0.5rem;">
        Enquire About This Project <i class="fas fa-arrow-right"></i>
      </a>`;
    modalOv.classList.add('on');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = () => {
    modalOv.classList.remove('on');
    document.body.style.overflow = '';
  };

  modalClose.addEventListener('click', closeModal);
  modalOv.addEventListener('click', e => { if (e.target === modalOv) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


  /* ═══════════════════════════════════════════
     MAGNETIC NAV LINKS
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mousemove', e => {
      const r = link.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 5;
      link.style.transform = `translate(${x}px, ${y}px)`;
    });
    link.addEventListener('mouseleave', () => { link.style.transform = ''; });
  });


  /* ═══════════════════════════════════════════
     COUNTRY FLAG PARALLAX
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.c-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r    = card.getBoundingClientRect();
      const x    = ((e.clientX - r.left) / r.width  - 0.5) * 16;
      const y    = ((e.clientY - r.top)  / r.height - 0.5) * 16;
      const flag = card.querySelector('.c-flag');
      if (flag) flag.style.transform = `scale(1.18) rotate(-3deg) translate(${x * 0.3}px,${y * 0.3}px)`;
    });
    card.addEventListener('mouseleave', () => {
      const flag = card.querySelector('.c-flag');
      if (flag) flag.style.transform = '';
    });
  });


  /* ═══════════════════════════════════════════
     SCROLL PROGRESS BAR (top of page)
  ═══════════════════════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.id = 'scrollProgress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #7c3aed, #06b6d4, #10b981);
    z-index: 99997;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / total * 100).toFixed(1) + '%';
  }, { passive: true });


  /* ═══════════════════════════════════════════
     AMBIENT SECTION GLOW on scroll
  ═══════════════════════════════════════════ */
  const glowColors = {
    portfolio:  'rgba(124,58,237,0.06)',
    about:      'rgba(6,182,212,0.05)',
    services:   'rgba(244,63,94,0.04)',
    reviews:    'rgba(245,158,11,0.04)',
    contact:    'rgba(16,185,129,0.05)',
  };
  const bgEl = document.querySelector('body::before'); // CSS handles it, this is a JS version

  // Section color accent on scroll
  const sectionEls = ['portfolio','about','services','reviews','contact'].map(id => document.getElementById(id)).filter(Boolean);
  const colorAccent = document.createElement('div');
  colorAccent.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    transition: background 1.2s ease;
  `;
  document.body.prepend(colorAccent);

  window.addEventListener('scroll', () => {
    const mid = window.scrollY + window.innerHeight / 2;
    for (let i = sectionEls.length - 1; i >= 0; i--) {
      if (sectionEls[i] && mid >= sectionEls[i].offsetTop) {
        colorAccent.style.background = glowColors[sectionEls[i].id] || 'transparent';
        break;
      }
    }
    if (window.scrollY < (sectionEls[0]?.offsetTop || 0)) {
      colorAccent.style.background = 'transparent';
    }
  }, { passive: true });


  /* ═══════════════════════════════════════════
     STAGGERED HERO ENTRY
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.hero-content > *').forEach((el, i) => {
    el.style.animationDelay = (0.3 + i * 0.18) + 's';
  });

});
