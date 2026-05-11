/* ── Active nav link ──────────────────────────────────────── */
(function () {
  const page = location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.nav-center a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'home.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Hamburger menu ───────────────────────────────────────── */
(function () {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── Scroll reveal (Intersection Observer) ───────────────── */
(function () {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── Hero scroll indicator ────────────────────────────────── */
(function () {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;

  let hidden = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80 && !hidden) {
      indicator.style.opacity = '0';
      hidden = true;
    } else if (window.scrollY <= 80 && hidden) {
      indicator.style.opacity = '1';
      hidden = false;
    }
  }, { passive: true });
})();

/* ── Gallery lightbox ─────────────────────────────────────── */
(function () {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  const img = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const images = Array.from(document.querySelectorAll('.gallery-grid img'));
  let current = 0;

  function open(index) {
    current = index;
    img.src = images[current].src;
    img.alt = images[current].alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    img.src = images[current].src;
    img.alt = images[current].alt;
  }

  function next() {
    current = (current + 1) % images.length;
    img.src = images[current].src;
    img.alt = images[current].alt;
  }

  images.forEach((el, i) => el.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();

/* ── Booking form: min date + validation ──────────────────── */
(function () {
  const form = document.querySelector('.booking-form');
  if (!form) return;

  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function setError(input, msg) {
    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
    input.classList.add('input-error');
  }

  function clearError(input) {
    const err = input.parentElement.querySelector('.field-error');
    if (err) err.textContent = '';
    input.classList.remove('input-error');
  }

  form.addEventListener('submit', e => {
    let valid = true;

    const nameInput = form.querySelector('input[placeholder="Your Name"]');
    const emailInput = form.querySelector('input[type="email"]');
    const guestsInput = form.querySelector('input[type="number"]');

    if (nameInput) {
      clearError(nameInput);
      if (nameInput.value.trim().length < 2) {
        setError(nameInput, 'Name must be at least 2 characters.');
        valid = false;
      }
    }

    if (emailInput) {
      clearError(emailInput);
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(emailInput.value.trim())) {
        setError(emailInput, 'Please enter a valid email address.');
        valid = false;
      }
    }

    if (guestsInput) {
      clearError(guestsInput);
      const n = parseInt(guestsInput.value, 10);
      if (isNaN(n) || n < 1 || n > 20) {
        setError(guestsInput, 'Guests must be between 1 and 20.');
        valid = false;
      }
    }

    if (dateInput) {
      clearError(dateInput);
      const today = new Date().toISOString().split('T')[0];
      if (!dateInput.value || dateInput.value < today) {
        setError(dateInput, 'Please select a date from today onwards.');
        valid = false;
      }
    }

    if (!valid) e.preventDefault();
  });
})();
