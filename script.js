document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE NAVIGATION ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('nav a');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- STICKY NAV HEADER ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- ACTIVE NAV LINK ON SCROLL ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('nav li');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(li => {
      li.classList.remove('active');
      const a = li.querySelector('a');
      if (a && a.getAttribute('href') === `#${current}`) {
        li.classList.add('active');
      }
    });
  });

  // --- HERO BACKGROUND PARTICLE ANIMATION ---
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const colors = ['#00f2fe', '#4facfe', '#7c3aed'];

    // Resize Canvas
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize Particles
    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
      const limit = Math.min(numberOfParticles, 80); // Cap it for performance
      for (let i = 0; i < limit; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Connection Line Helper
    function drawLines() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dist = Math.hypot(particlesArray[a].x - particlesArray[b].x, particlesArray[a].y - particlesArray[b].y);
          if (dist < 100) {
            ctx.save();
            // Gradient connection line
            const grad = ctx.createLinearGradient(particlesArray[a].x, particlesArray[a].y, particlesArray[b].x, particlesArray[b].y);
            grad.addColorStop(0, particlesArray[a].color);
            grad.addColorStop(1, particlesArray[b].color);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      drawLines();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- GALLERY LIGHTBOX ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-src'),
    title: item.querySelector('h4').textContent,
    desc: item.querySelector('p').textContent
  }));

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryData[currentGalleryIndex];
    if (item && lightbox && lightboxImg) {
      lightboxImg.src = item.src;
      if (lightboxTitle) lightboxTitle.textContent = item.title;
      if (lightboxDesc) lightboxDesc.textContent = item.desc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore background scrolling
    }
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close lightbox on clicking backdrop
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard Navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.trust-badge, .service-card, .gallery-item, .contact-card, .contact-form-box, .about-info');
  
  // Set initial opacity and translation styles via JS to allow smooth fallbacks
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- CONTACT FORM HANDLER ---
  const contactForm = document.getElementById('contactForm');
  const successToast = document.getElementById('successToast');

  if (contactForm && successToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !phone || !message) {
        alert('Please fill out all fields.');
        return;
      }

      // Simulate API submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success toast
        successToast.classList.add('show');
        
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Hide success toast after 4 seconds
        setTimeout(() => {
          successToast.classList.remove('show');
        }, 4000);
      }, 1500);
    });
  }

  // --- SCROLL TO TOP BUTTON ---
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
        scrollTopBtn.style.transform = 'translateY(0)';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
        scrollTopBtn.style.transform = 'translateY(20px)';
      }
    });

    // Initial styling
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.pointerEvents = 'none';
    scrollTopBtn.style.transform = 'translateY(20px)';
    scrollTopBtn.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
