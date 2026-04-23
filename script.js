/* ═══════════════════════════════════════════════════════════════════
   MERIDIAN CONSULTING  |  script.js
   Handles: sticky nav, mobile menu, form validation, scroll animations
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM References ──────────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

/* ══════════════════════════════════════════════════════════════════
   1. STICKY NAVIGATION — adds "scrolled" class past 60px
   ══════════════════════════════════════════════════════════════════ */
function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load in case page is pre-scrolled

/* ══════════════════════════════════════════════════════════════════
   2. MOBILE HAMBURGER MENU
   ══════════════════════════════════════════════════════════════════ */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ══════════════════════════════════════════════════════════════════
   3. ACTIVE NAV LINK ON SCROLL (highlight current section)
   ══════════════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item[href^="#"]');

function updateActiveLink() {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      const id = section.getAttribute('id');
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

/* ══════════════════════════════════════════════════════════════════
   4. SCROLL-TRIGGERED FADE-IN ANIMATIONS
   ══════════════════════════════════════════════════════════════════ */
function setupScrollAnimations() {
  // Add fade-in class to animatable elements
  const targets = [
    '.card',
    '.value-card',
    '.team-card',
    '.blog-card',
    '.section-header',
    '.split-text',
    '.split-visual',
    '.metrics-card',
    '.contact-info',
    '.contact-form',
    '.stat',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      // Stagger delay for grid items
      if (el.closest('.cards-grid, .values-grid, .team-grid, .blog-grid, .hero-stats')) {
        el.style.transitionDelay = `${i * 0.08}s`;
      }
    });
  });

  // IntersectionObserver to trigger animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Run after DOM is fully parsed
document.addEventListener('DOMContentLoaded', setupScrollAnimations);

/* ══════════════════════════════════════════════════════════════════
   5. CONTACT FORM — validation & submission
   ══════════════════════════════════════════════════════════════════ */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(input, message) {
  input.style.borderColor = '#e53e3e';
  let errEl = input.parentElement.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'field-error';
    errEl.style.cssText = 'font-size:.78rem;color:#e53e3e;margin-top:4px;display:block;';
    input.parentElement.appendChild(errEl);
  }
  errEl.textContent = message;
}

function clearError(input) {
  input.style.borderColor = '';
  const errEl = input.parentElement.querySelector('.field-error');
  if (errEl) errEl.remove();
}

function validateForm(data) {
  let valid = true;

  if (!data.firstName.trim()) {
    setError(contactForm.firstName, 'First name is required.');
    valid = false;
  } else {
    clearError(contactForm.firstName);
  }

  if (!data.lastName.trim()) {
    setError(contactForm.lastName, 'Last name is required.');
    valid = false;
  } else {
    clearError(contactForm.lastName);
  }

  if (!data.email.trim()) {
    setError(contactForm.email, 'Email address is required.');
    valid = false;
  } else if (!validateEmail(data.email)) {
    setError(contactForm.email, 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError(contactForm.email);
  }

  return valid;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      firstName: contactForm.firstName.value,
      lastName:  contactForm.lastName.value,
      email:     contactForm.email.value,
      company:   contactForm.company.value,
      interest:  contactForm.interest.value,
      message:   contactForm.message.value,
    };

    if (!validateForm(formData)) return;

    // Simulate async submit (replace with real endpoint as needed)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Success state
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    formSuccess.classList.add('visible');

    // Hide success message after 6s
    setTimeout(() => formSuccess.classList.remove('visible'), 6000);
  });

  // Real-time validation: clear errors on input
  ['firstName', 'lastName', 'email'].forEach(field => {
    contactForm[field]?.addEventListener('input', () => {
      clearError(contactForm[field]);
    });
  });
}

/* ══════════════════════════════════════════════════════════════════
   6. SMOOTH SCROLL for anchor links (fallback for older browsers)
   ══════════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════════════════════════════
   7. PROGRESS BAR ANIMATION — trigger on scroll into view
   ══════════════════════════════════════════════════════════════════ */
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
    barObserver.observe(bar);
  });
}

document.addEventListener('DOMContentLoaded', animateProgressBars);

/* ══════════════════════════════════════════════════════════════════
   8. COUNTER ANIMATION for hero stats
   ══════════════════════════════════════════════════════════════════ */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const raw = el.textContent.trim();
      const suffix = raw.replace(/[\d.]/g, '');    // e.g. '+', '%'
      const target = parseFloat(raw.replace(/[^\d.]/g, ''));
      const duration = 1600;
      const start = performance.now();

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
}

document.addEventListener('DOMContentLoaded', animateCounters);
