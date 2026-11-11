/* Darius Wijaya — Website portofolio. Tanpa dependensi JavaScript eksternal. */

// Ubah ke true SETELAH file PDF asli disimpan sebagai assets/cv.pdf.
const CV_AVAILABLE = false;
const CV_PATH = 'assets/cv.pdf';

const nav = document.getElementById('nav-links');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Tutup menu navigasi' : 'Buka menu navigasi');
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Tandai bagian halaman yang aktif di menu.
const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-22% 0px -65% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

// Animasi muncul saat elemen terlihat.
const revealElements = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09 });
  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

// Filter kartu portofolio.
const filterButtons = document.querySelectorAll('[data-filter]');
const portfolioCards = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const selection = button.dataset.filter;
  filterButtons.forEach(b => {
    const selected = b === button;
    b.classList.toggle('selected', selected);
    b.setAttribute('aria-pressed', String(selected));
  });
  portfolioCards.forEach(card => {
    card.hidden = selection !== 'semua' && card.dataset.category !== selection;
  });
}));

// Aktifkan tautan CV hanya jika file PDF asli telah ditambahkan.
const cvButton = document.getElementById('cv-button');
const cvStatus = document.getElementById('cv-status');
if (CV_AVAILABLE) {
  cvButton.href = CV_PATH;
  cvButton.setAttribute('download', 'CV_Darius_Wijaya.pdf');
  cvButton.removeAttribute('aria-disabled');
  cvButton.innerHTML = 'Unduh CV (PDF) <span aria-hidden="true">↓</span>';
  cvStatus.textContent = 'CV tersedia dalam format PDF.';
} else {
  cvButton.addEventListener('click', e => e.preventDefault());
}

// Salin alamat email.
document.getElementById('copy-email').addEventListener('click', async () => {
  const email = 'dariuswijaya150@gmail.com';
  const feedback = document.getElementById('copy-feedback');
  try {
    await navigator.clipboard.writeText(email);
    feedback.textContent = 'Alamat email berhasil disalin.';
  } catch {
    feedback.textContent = `Salin secara manual: ${email}`;
  }
});

document.getElementById('current-year').textContent = new Date().getFullYear();

// Galeri dokumen: preview tanpa meninggalkan halaman.
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.getElementById('modal-close');
let previousFocus;
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalImage.removeAttribute('src');
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
}
document.querySelectorAll('a.portfolio-image').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    previousFocus = document.activeElement;
    modalImage.src = link.getAttribute('href');
    modalImage.alt = link.querySelector('img')?.alt || 'Dokumentasi portofolio';
    modalCaption.textContent = modalImage.alt;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalClose.focus();
  });
});
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  if (event.key === 'Tab' && modal.classList.contains('is-open')) { event.preventDefault(); modalClose.focus(); }
});

const backTop = document.getElementById('back-to-top');
function updateScroll() { backTop.classList.toggle('is-visible', window.scrollY > 650); }
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
