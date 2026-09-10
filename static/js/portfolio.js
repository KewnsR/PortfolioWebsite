document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('nav');
  const allNavLinks = document.querySelectorAll('.nav-links a:not(.btn-cv)');
  const scrollToTopButton = document.getElementById('scrollToTop');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileClose = document.getElementById('mobile-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const revealElements = document.querySelectorAll('[data-reveal]');
  const certGallery = document.querySelector('.certs-gallery');
  const certPrev = document.getElementById('cert-prev');
  const certNext = document.getElementById('cert-next');
  const projectCards = document.querySelectorAll('.project-card');
  const stackContainer = document.querySelector('.projects-stack-container');
  const progressDots = document.querySelectorAll('.projects-progress-nav .progress-dot');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleText = themeToggle?.querySelector('.theme-toggle-text');

  document.documentElement.style.scrollBehavior = 'smooth';

  function updateThemeControl() {
    const isLight = document.documentElement.dataset.theme === 'light';
    themeToggle?.setAttribute('aria-checked', String(isLight));
    themeToggle?.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    if (themeToggleText) themeToggleText.textContent = isLight ? 'Light' : 'Dark';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('portfolio-theme', nextTheme);
      updateThemeControl();
    });
    updateThemeControl();
  }

  function updateActiveNav() {
    if (!navbar) return;

    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const threshold = section.id === 'skills' ? window.innerHeight * 0.55 : navbar.offsetHeight + 100;

      if (rect.top <= threshold) {
        current = section.id;
      }
    });

    allNavLinks.forEach((link) => {
      link.classList.toggle('nav-active', link.getAttribute('href') === `#${current}`);
    });

    if (scrollToTopButton) {
      scrollToTopButton.classList.toggle('visible', window.scrollY > 300);
    }
  }

  function initMobileMenu() {
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
      });
    }

    if (mobileClose && mobileMenu) {
      mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    }

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu?.classList.remove('open');
      });
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        const navHeight = navbar?.offsetHeight || 80;
        let targetPosition;

        if (href === '#skills') {
          const viewportHeight = window.innerHeight;
          const targetHeight = target.offsetHeight;
          targetPosition = target.getBoundingClientRect().top + window.pageYOffset - (viewportHeight - targetHeight) / 2;
        } else {
          targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        }

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  function initRevealObserver() {
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  function initCertCarousel() {
    if (!certGallery) return;

    function toggleCarouselButtons() {
      const hasOverflow = certGallery.scrollWidth > certGallery.clientWidth;
      certPrev && (certPrev.style.visibility = hasOverflow ? 'visible' : 'hidden');
      certNext && (certNext.style.visibility = hasOverflow ? 'visible' : 'hidden');
    }

    if (certPrev && certNext) {
      certPrev.addEventListener('click', () => {
        const card = certGallery.querySelector('.cert-card');
        if (card) {
          const cardWidth = card.offsetWidth;
          certGallery.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        }
      });

      certNext.addEventListener('click', () => {
        const card = certGallery.querySelector('.cert-card');
        if (card) {
          const cardWidth = card.offsetWidth;
          certGallery.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
      });
    }

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    certGallery.addEventListener('mousedown', (event) => {
      isDown = true;
      certGallery.style.cursor = 'grabbing';
      certGallery.style.scrollSnapType = 'none';
      certGallery.style.scrollBehavior = 'auto';
      startX = event.pageX - certGallery.offsetLeft;
      scrollLeft = certGallery.scrollLeft;
    });

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      certGallery.style.cursor = 'grab';
      certGallery.style.scrollSnapType = 'x mandatory';
      certGallery.style.scrollBehavior = 'smooth';
    };

    certGallery.addEventListener('mouseleave', endDrag);
    certGallery.addEventListener('mouseup', endDrag);

    certGallery.addEventListener('mousemove', (event) => {
      if (!isDown) return;
      event.preventDefault();
      const x = event.pageX - certGallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      certGallery.scrollLeft = scrollLeft - walk;
    });

    certGallery.style.cursor = 'grab';
    certGallery.querySelectorAll('img, a').forEach((element) => {
      element.addEventListener('dragstart', (event) => event.preventDefault());
    });

    window.addEventListener('resize', toggleCarouselButtons);
    setTimeout(toggleCarouselButtons, 100);
  }

  function updateCardStack() {
    if (!stackContainer || !projectCards.length) return;

    let activeIndex = 0;
    const stickyTop = 120;

    projectCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();

      if (rect.top <= stickyTop + 10) {
        activeIndex = index;
      }

      const nextCard = projectCards[index + 1];
      if (nextCard) {
        const nextRect = nextCard.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - nextRect.top) / (window.innerHeight - stickyTop)));
        const scale = 1 - progress * 0.05;
        const opacity = 1 - progress * 0.45;
        const filterVal = 1 - progress * 0.35;

        card.style.transform = `scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.filter = `brightness(${filterVal})`;
      } else {
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
        card.style.filter = 'brightness(1)';
      }
    });

    progressDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  window.scrollToCard = (index) => {
    const card = projectCards[index];
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = cardRect.top + scrollTop - 120;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  };

  if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  initMobileMenu();
  initSmoothAnchors();
  initRevealObserver();
  initCertCarousel();
  updateCardStack();

  window.addEventListener('scroll', () => {
    updateActiveNav();
    requestAnimationFrame(updateCardStack);
  }, { passive: true });

  window.addEventListener('resize', updateCardStack);

  const canvas = document.getElementById('binary-rain');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const fontSize = 11;
    const chars = '10';
    let columns = 0;
    let drops = [];

    const initRain = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / (fontSize * 1.6));
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    };

    const drawRain = () => {
      const isLight = document.documentElement.dataset.theme === 'light';
      ctx.fillStyle = isLight ? 'rgba(244,245,247,0.06)' : 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Space Mono", monospace`;
      ctx.textBaseline = 'top';

      for (let index = 0; index < drops.length; index += 1) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = index * fontSize * 1.6;
        const y = drops[index] * fontSize;
        const alpha = 0.5 + Math.random() * 0.2;

        ctx.fillStyle = Math.random() > 0.7
          ? `rgba(79,95,255,${alpha})`
          : `rgba(60,75,200,${alpha})`;

        ctx.fillText(char, x, y);
        drops[index] += 0.3 + Math.random() * 0.2;

        if (drops[index] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = -Math.floor(Math.random() * 20);
        }
      }
    };

    initRain();
    setInterval(drawRain, 60);
    window.addEventListener('resize', initRain);
  }
});

window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700); // Wait for the transition to finish (700ms from tailwind class)
    }, 200);
  }
});
