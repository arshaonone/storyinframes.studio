/* =============================================
   STORYINFRAMES STUDIO — DARK BENTO UI SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR & SCROLL ─────────────────────── */
  const navbar = document.getElementById('navbar');
  const menu   = document.getElementById('navMenu');
  const burger = document.getElementById('burger');
  const links  = document.querySelectorAll('.nav-link, .nav-btn');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.style.padding = window.scrollY > 50 ? '1rem 0' : '1.5rem 0';
      navbar.style.background = window.scrollY > 50 ? 'rgba(11, 13, 16, 0.95)' : 'rgba(11, 13, 16, 0.8)';
    }
  }, { passive: true });

  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('on');
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
      // Basic mobile transition handled here
      if(menu.style.display === 'flex') {
        menu.style.position = 'fixed';
        menu.style.top = '70px';
        menu.style.left = '0';
        menu.style.width = '100%';
        menu.style.background = 'rgba(11, 13, 16, 0.98)';
        menu.style.flexDirection = 'column';
        menu.style.padding = '2rem';
        menu.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      }
    });
  }

  links.forEach(l => {
    l.addEventListener('click', () => {
      if (window.innerWidth <= 768 && menu) {
        menu.style.display = 'none';
        if (burger) burger.classList.remove('on');
      }
    });
  });

  /* ─── SMOOTH SCROLL ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId === '#') return;
      const t = document.querySelector(targetId);
      if (t) { 
        e.preventDefault(); 
        window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); 
      }
    });
  });

  /* ─── PORTFOLIO HOVER INTERACTION ─────────── */
  const pItems = document.querySelectorAll('.p-list-item');
  pItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Remove active from all
      pItems.forEach(el => {
        el.classList.remove('active-p');
        // If there's an existing floating images block, hide it
        const imgs = el.querySelector('.floating-imgs');
        if (imgs) imgs.remove();
      });

      // Add active to current
      item.classList.add('active-p');
      
      // Inject the floating images dynamically to the hovered item
      const floatingHtml = `
        <div class="floating-imgs" style="opacity: 1; transform: translateY(10px);">
            <img src="assets/portfolio_commercial.png" alt="Work" class="f-img fi-1">
            <img src="assets/portfolio_wedding.png" alt="Work" class="f-img fi-2">
        </div>
      `;
      item.insertAdjacentHTML('beforeend', floatingHtml);
    });
  });

  /* ─── BENTO CARDS 3D TILT ─────────────────── */
  document.querySelectorAll('.bento-card, .c-box').forEach(card => {
    card.addEventListener('mousemove', e => {
      // subtle 3D tilt
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 6;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -6;
      card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── FORM SUBMISSION ─────────────────────── */
  const form = document.querySelector('.contact-form');
  const btn = document.querySelector('.btn-arrow');
  if (form && btn) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully';
        btn.style.background = 'var(--accent)';
        btn.style.color = 'var(--text-dark)';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = 'var(--grad-main)';
        }, 3000);
      }, 1500);
    });
  }

});
