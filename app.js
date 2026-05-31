// ============================================
// THRIVE VANGUARD SPORTS & COMBAT ACADEMY
// Main Application JavaScript
// ============================================

'use strict';

// ---- SECURITY: Disable right-click ----
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && ['u','s','a','c','v','p'].includes(e.key.toLowerCase()))) {
    e.preventDefault();
  }
});
document.addEventListener('selectstart', e => e.preventDefault());

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }
  if (scrollTop) {
    scrollTop.classList.toggle('visible', window.scrollY > 400);
  }
});

// ---- MOBILE MENU ----
function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
  document.body.style.overflow = '';
}

// ---- HERO PARTICLES ----
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 15 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.6};
    `;
    container.appendChild(p);
  }
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ---- COUNTER ANIMATION ----
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + (target >= 100 ? '+' : '');
          if (current >= target) clearInterval(timer);
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ---- GALLERY FILTER ----
function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item => {
    const match = cat === 'all' || item.dataset.cat === cat;
    item.style.display = match ? 'flex' : 'none';
    item.style.animation = match ? 'fadeIn 0.4s ease' : '';
  });
}

// ---- LIGHTBOX ----
function openLightbox(title) {
  const modal = document.getElementById('lightboxModal');
  const titleEl = document.getElementById('lightboxTitle');
  if (modal) modal.classList.add('open');
  if (titleEl) titleEl.textContent = title;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.id === 'lightboxModal') closeLightbox();
});

// ---- PWA INSTALL ----
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'flex';
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      const btn = document.getElementById('installBtn');
      if (btn) btn.style.display = 'none';
    });
  }
}

// ---- SERVICE WORKER ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ---- LOAD SOCIAL LINKS FROM STORAGE ----
function loadSocialLinks() {
  const links = JSON.parse(localStorage.getItem('tv_social') || '{}');
  const map = {
    'social-fb': links.facebook || '#',
    'social-ig': links.instagram || '#',
    'social-yt': links.youtube || '#',
    'social-wa': links.whatsapp || 'https://wa.me/918959992195',
    'social-li': links.linkedin || '#',
  };
  Object.entries(map).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  });
}

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollAnimations();
  animateCounters();
  loadSocialLinks();
});
