/* =========================================================
   VIXORA — site interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll state + mobile toggle ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el, i) => {
      el.style.setProperty('--i', i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 3D tilt on cards ---------- */
  const tiltEls = document.querySelectorAll('.pf-card, .svc-card');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    tiltEls.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateZ(2px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ---------- Hero ambient canvas (gold/violet drifting particles) ---------- */
  const canvas = document.querySelector('.hero-canvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const DENSITY = 70;

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function init() {
      resize();
      particles = Array.from({ length: DENSITY }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.6 + 0.4) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
        c: Math.random() > 0.5 ? 'rgba(212,175,55,' : 'rgba(124,92,255,',
        a: Math.random() * 0.5 + 0.15
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = p.c + p.a + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    init();
    tick();
    window.addEventListener('resize', () => { resize(); });
  }

  /* ---------- Lightbox (portfolio image gallery) ---------- */
  const lbTriggers = document.querySelectorAll('[data-lightbox]');
  if (lbTriggers.length) {
    const group = Array.from(lbTriggers);
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lb-close" aria-label="Close">&times;</button>
      <button class="lb-prev" aria-label="Previous">&lsaquo;</button>
      <img src="" alt="">
      <button class="lb-next" aria-label="Next">&rsaquo;</button>
      <div class="lb-counter"></div>
    `;
    document.body.appendChild(lightbox);
    const lbImg = lightbox.querySelector('img');
    const lbCounter = lightbox.querySelector('.lb-counter');
    let current = 0;

    function show(i) {
      current = (i + group.length) % group.length;
      const src = group[current].getAttribute('href') || group[current].dataset.full || group[current].src;
      lbImg.src = src;
      lbImg.alt = group[current].dataset.caption || '';
      lbCounter.textContent = `${current + 1} / ${group.length}`;
    }

    group.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        show(i);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    lightbox.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ---------- Carousel controls ---------- */
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.cn-prev');
    const next = carousel.querySelector('.cn-next');
    if (!track) return;
    const scrollAmount = () => track.querySelector('.carousel-slide')?.offsetWidth + 22 || 340;
    prev?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  });

  /* ---------- Portfolio filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pfCards = document.querySelectorAll('[data-cat]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        pfCards.forEach(card => {
          const show = f === 'all' || card.dataset.cat === f;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Contact form (Formspree-ready, graceful fallback) ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action') || '';
      if (action.includes('formspree.io') && !action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        const status = form.querySelector('.form-status');
        const btn = form.querySelector('button[type="submit"]');
        const originalLabel = btn.textContent;
        btn.textContent = 'Sending…';
        try {
          const res = await fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
          if (res.ok) {
            form.reset();
            status.textContent = 'Message sent — we will reply within 24 hours.';
          } else {
            status.textContent = 'Something went wrong. Please email us directly.';
          }
        } catch (err) {
          status.textContent = 'Network error. Please email us directly.';
        }
        btn.textContent = originalLabel;
      }
      /* if Formspree isn't configured yet, the form falls back to mailto via the
         action attribute set in contact.html — no JS handling needed for that case */
    });
  }



    /* ---------- Portfolio video background (lazy load) ---------- */
  const videoCards = document.querySelectorAll('.pf-card');
  
  if ('IntersectionObserver' in window && videoCards.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector('.pf-bg-video');
          if (video) {
            // Video ko load karein
            video.load();
            // Play karein (with error handling)
            video.play().catch(() => {
              // Agar autoplay block ho toh user interaction par play karein
              const media = entry.target.querySelector('.pf-media');
              if (media) {
                media.addEventListener('click', () => {
                  video.play();
                }, { once: true });
              }
            });
            // Unobserve karein (ek baar load karne ke baad)
            videoObserver.unobserve(entry.target);
          }
        }
      });
    }, { 
      threshold: 0.1,  // 10% visible hone par load ho
      rootMargin: '0px 0px 100px 0px'  // Thoda pehle se load ho
    });
    
    videoCards.forEach(card => videoObserver.observe(card));
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.pf-bg-video').forEach(video => {
      video.play().catch(() => {});
    });
  }



  

});
