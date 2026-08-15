/* ===================================================
   APPLE BUTTER CAFE RIYADH — Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PRELOADER ─────────────────────────── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => setTimeout(() => preloader.classList.add('loaded'), 800));
    setTimeout(() => preloader && preloader.classList.add('loaded'), 3500);
  }

  /* ── NAVBAR SCROLL ─────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar && (window.pageYOffset > 70 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled'));
  }, { passive: true });

  /* ── HAMBURGER SIDEBAR ─────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const navSidebar   = document.getElementById('navSidebar');
  const navOverlay   = document.getElementById('navOverlay');
  const sidebarClose = document.getElementById('sidebarClose');

  function openSidebar() {
    hamburger  && hamburger.classList.add('active');
    navSidebar && navSidebar.classList.add('open');
    navOverlay && navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    hamburger  && hamburger.classList.remove('active');
    navSidebar && navSidebar.classList.remove('open');
    navOverlay && navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger    && hamburger.addEventListener('click', openSidebar);
  sidebarClose && sidebarClose.addEventListener('click', closeSidebar);
  navOverlay   && navOverlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSidebar(); closeBooking(); closeWelcome(); } });

  /* ── ACTIVE PAGE HIGHLIGHT ─────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active-page');
  });

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar ? navbar.offsetHeight : 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
      }
      closeSidebar();
    });
  });

  /* ── SCROLL REVEAL ─────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── HERO SLIDESHOW ────────────────────── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const slideDots  = document.querySelectorAll('.slide-dot');
  if (heroSlides.length) {
    let cur = 0, timer;
    function goTo(i) {
      heroSlides[cur].classList.remove('active');
      slideDots[cur] && slideDots[cur].classList.remove('active');
      cur = (i + heroSlides.length) % heroSlides.length;
      heroSlides[cur].classList.add('active');
      slideDots[cur] && slideDots[cur].classList.add('active');
    }
    function start() { timer = setInterval(() => goTo(cur + 1), 5500); }
    function reset() { clearInterval(timer); start(); }
    slideDots.forEach(dot => dot.addEventListener('click', () => { goTo(+dot.dataset.slide); reset(); }));
    start();
    // Parallax on scroll
    window.addEventListener('scroll', () => {
      const s = window.pageYOffset;
      if (s < window.innerHeight) {
        const active = document.querySelector('.hero-slide.active');
        if (active) active.style.transform = `scale(1) translateY(${s * 0.18}px)`;
      }
    }, { passive: true });
  }

  /* ── MARQUEE PAUSE ON HOVER ────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
    marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
  }

  /* ── MENU CATEGORY TABS ────────────────── */
  const menuCatBtns = document.querySelectorAll('.menu-cat-btn');
  const menuCards   = document.querySelectorAll('.menu-card');
  if (menuCatBtns.length) {
    menuCatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        menuCatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        let delay = 0;
        menuCards.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(14px)';
            const d = delay;
            setTimeout(() => {
              card.style.transition = 'opacity .4s ease, transform .4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, d);
            delay += 55;
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── BOOKING POPUP ─────────────────────── */
  const bookingPopup   = document.getElementById('bookingPopup');
  const openBookingBtns = document.querySelectorAll('[data-open-booking]');
  const closeBookingBtn = document.getElementById('closeBooking');

  function openBooking() {
    closeSidebar();
    bookingPopup && bookingPopup.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeBooking() {
    bookingPopup && bookingPopup.classList.remove('open');
    if (!navSidebar || !navSidebar.classList.contains('open')) document.body.style.overflow = '';
  }

  openBookingBtns.forEach(btn => btn.addEventListener('click', openBooking));
  closeBookingBtn && closeBookingBtn.addEventListener('click', closeBooking);
  bookingPopup && bookingPopup.addEventListener('click', e => { if (e.target === bookingPopup) closeBooking(); });

  /* ── WELCOME POPUP ─────────────────────── */
  const welcomePopup   = document.getElementById('welcomePopup');
  const closeWelcomeBtn = document.getElementById('closeWelcome');
  const bookNowBtn     = document.getElementById('welcomeBookBtn');

  function closeWelcome() {
    welcomePopup && welcomePopup.classList.remove('open');
    if (!navSidebar || !navSidebar.classList.contains('open')) document.body.style.overflow = '';
  }

  if (welcomePopup) {
    // Reliably open popup on every home page visit after 1.2s delay
    setTimeout(() => {
      welcomePopup.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 1200);

    closeWelcomeBtn && closeWelcomeBtn.addEventListener('click', closeWelcome);
    welcomePopup.addEventListener('click', e => { if (e.target === welcomePopup) closeWelcome(); });
    bookNowBtn && bookNowBtn.addEventListener('click', () => { closeWelcome(); setTimeout(openBooking, 200); });
  }

  /* ── MENU PAGE ENTERING ANIMATION ──────── */
  const menuGrid = document.getElementById('menuGrid');
  if (menuGrid) {
    const visibleCards = Array.from(menuGrid.querySelectorAll('.menu-card')).filter(c => getComputedStyle(c).display !== 'none');
    visibleCards.forEach((card, idx) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 150 + idx * 60);
    });
  }

  /* ── ABOUT PAGE SPACE CAROUSEL (Full Width, Non-Looping) ─── */
  const spaceTrack = document.getElementById('spaceTrack');
  const spaceSlides = document.querySelectorAll('.space-carousel-slide');
  const spaceDots = document.querySelectorAll('.space-dot');

  if (spaceTrack && spaceSlides.length) {
    let spaceIndex = 0;
    let spaceDirection = 1;
    let spaceTimer;

    function getItemsPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function showSpaceSlide(idx) {
      const perView = getItemsPerView();
      const maxIndex = Math.max(0, spaceSlides.length - perView);

      if (idx > maxIndex) {
        spaceIndex = maxIndex;
        spaceDirection = -1; // reverse direction smoothly, no loop jump
      } else if (idx < 0) {
        spaceIndex = 0;
        spaceDirection = 1;
      } else {
        spaceIndex = idx;
      }

      const slideWidth = spaceSlides[0].getBoundingClientRect().width;
      const gap = 20;
      const moveDistance = spaceIndex * (slideWidth + gap);

      spaceTrack.style.transform = `translateX(-${moveDistance}px)`;
      spaceDots.forEach((dot, i) => dot.classList.toggle('active', i === spaceIndex));
    }

    function autoAdvance() {
      const perView = getItemsPerView();
      const maxIndex = Math.max(0, spaceSlides.length - perView);

      if (spaceIndex >= maxIndex) spaceDirection = -1;
      else if (spaceIndex <= 0) spaceDirection = 1;

      showSpaceSlide(spaceIndex + spaceDirection);
    }

    function startSpaceTimer() {
      spaceTimer = setInterval(autoAdvance, 4000);
    }
    function resetSpaceTimer() {
      clearInterval(spaceTimer);
      startSpaceTimer();
    }

    spaceDots.forEach((dot, i) => dot.addEventListener('click', () => { showSpaceSlide(i); resetSpaceTimer(); }));
    window.addEventListener('resize', () => showSpaceSlide(spaceIndex));

    startSpaceTimer();
  }

  /* ── BOOKING FORM LOGIC ────────────────── */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    // Set min date to tomorrow
    const dateInput = bookingForm.querySelector('#book-date');
    if (dateInput) {
      const tmr = new Date();
      tmr.setDate(tmr.getDate() + 1);
      dateInput.min = tmr.toISOString().split('T')[0];
    }

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const name   = bookingForm.querySelector('#book-name').value.trim();
      const phone  = bookingForm.querySelector('#book-phone').value.trim();
      const email  = bookingForm.querySelector('#book-email').value.trim();
      const date   = bookingForm.querySelector('#book-date').value;
      const time   = bookingForm.querySelector('#book-time').value;
      const guests = bookingForm.querySelector('#book-guests').value;

      if (!name || (!phone && !email)) {
        showFormMsg('Please enter your name and at least a phone number or email.', 'error');
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormMsg('Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = bookingForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        const dateStr = date ? new Date(date).toLocaleDateString('en-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : 'date TBD';
        const timeStr = time || 'time TBD';
        showFormMsg(`Thank you, ${name}! Your reservation request for ${guests} guest${guests > 1 ? 's' : ''} on ${dateStr} at ${timeStr} has been received. We'll confirm via ${email || phone} shortly.`, 'success');
        submitBtn.textContent = 'Request Reservation';
        submitBtn.disabled = false;
        bookingForm.reset();
      }, 1600);
    });

    function showFormMsg(msg, type) {
      const existing = bookingForm.querySelector('.form-feedback');
      if (existing) existing.remove();
      const el = document.createElement('div');
      el.className = `form-feedback ${type}`;
      el.textContent = msg;
      bookingForm.insertBefore(el, bookingForm.firstChild);
      if (type === 'success') setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .5s'; setTimeout(() => el.remove(), 500); }, 8000);
    }
  }

  /* ── GALLERY HOVER PARALLAX ────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    item.addEventListener('mousemove', e => {
      const r = item.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      img.style.transform = `scale(1.08) translate(${x*7}px,${y*7}px)`;
    });
    item.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; });
  });

  /* ── BACK TO TOP ───────────────────────── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      window.pageYOffset > 400 ? backToTop.classList.add('visible') : backToTop.classList.remove('visible');
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── HIGHLIGHT TODAY IN CONTACT HOURS ─── */
  const todayIndex = new Date().getDay(); // 0=Sun
  document.querySelectorAll('.c-hours-row').forEach(row => {
    const days = row.dataset.days;
    if (days) {
      const dayNums = days.split(',').map(Number);
      if (dayNums.includes(todayIndex)) row.classList.add('today');
    }
  });

});
