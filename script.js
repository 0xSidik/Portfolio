/* ============================================================
   DIABY ABOUBACAR SIDIK — Portfolio v2 JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. PARTICLES CANVAS ── */
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#00ff88', '#00d4ff', '#7c3aed'];
    const COUNT = Math.min(70, Math.floor(window.innerWidth / 18));

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.15
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,136,${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ── 2. SCROLL: HEADER STYLE ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── 3. MOBILE MENU ── */
  const menuToggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-close');

  if (menuToggle && overlay) {
    menuToggle.addEventListener('click', () => overlay.classList.add('open'));
    mobileClose && mobileClose.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => overlay.classList.remove('open')));
  }

  /* ── 4. SCROLL SPY ── */
  const navLinks = document.querySelectorAll('.navbar-menu li a');
  const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href')));

  function updateActiveLink() {
    let active = 0;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top <= 90) active = i;
    });
    navLinks.forEach((l, i) => l.classList.toggle('active', i === active));
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  navLinks.forEach(l => l.addEventListener('click', () => {
    navLinks.forEach(x => x.classList.remove('active'));
    l.classList.add('active');
  }));

  /* ── 5. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  /* ── 6. CARD ACTIVE STATE ── */
  document.querySelectorAll('.design-card').forEach(card => {
    card.addEventListener('click', function () {
      document.querySelectorAll('.design-card').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ── 7. GREETING ANIMATION ── */
  if (window.anime) {
    const greetingEl = document.getElementById('greetingText');
    const greetings = [
      'Stay safe from cyber',
      'Restez en sécurité contre le cyber',
      'Protège tes données',
      'Hack the planet — ethically',
    ];
    let idx = 0;

    function animateGreeting(text) {
      greetingEl.innerHTML = '';
      text.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'greet-word';
        span.textContent = word;
        greetingEl.appendChild(span);
        if (i < text.split(' ').length - 1) greetingEl.appendChild(document.createTextNode('\u00a0'));
      });
      anime({
        targets: '#greetingText span',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 600,
        delay: (_, i) => i * 90,
        easing: 'easeOutExpo',
        complete: () => {
          idx = (idx + 1) % greetings.length;
          setTimeout(() => animateGreeting(greetings[idx]), 2800);
        }
      });
    }
    animateGreeting(greetings[idx]);
  }

  /* ── 8. HERO ENTRANCE (stagger) ── */
  if (window.anime) {
    anime({
      targets: '#content-body .body-part-1 > *',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(120, { start: 200 }),
      duration: 800,
      easing: 'easeOutExpo'
    });
  }

  /* ── 9. SKILL TAGS HOVER RIPPLE ── */
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.08)';
    });
    tag.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  /* ── 10. TYPING CURSOR IN HEADER ── */
  // Already handled by CSS .cursor-blink

});
