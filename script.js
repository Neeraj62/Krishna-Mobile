document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. STICKY NAVBAR STATE
  // ==========================================================================
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page is refreshed while scrolled

  // ==========================================================================
  // 2. MOBILE MENU HAMBURGER TOGGLE
  // ==========================================================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ==========================================================================
  // 3. SCROLL REVEAL ANIMATION (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if observer not supported
    revealElements.forEach(element => element.classList.add('active'));
  }

  // ==========================================================================
  // 4. ANIMATED NUMBER COUNTERS (Intersection Observer)
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10) || 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      element.textContent = currentValue.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString('en-IN') + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(number => {
      statsObserver.observe(number);
    });
  } else {
    // Fallback if observer not supported
    statNumbers.forEach(number => {
      const target = number.getAttribute('data-target') || '0';
      const suffix = number.getAttribute('data-suffix') || '';
      number.textContent = target + suffix;
    });
  }

  // ==========================================================================
  // 5. FAQ ACCORDION ANIMATION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (button && answer) {
      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other accordion items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // ==========================================================================
  // 6. CONTACT FORM VALIDATION & SUBMISSION SUCCESS HANDLER
  // ==========================================================================
  const contactForm = document.getElementById('shop-contact-form');
  const successMessage = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        const parent = input.closest('.form-group');
        const errorMsg = parent.querySelector('.form-error');
        
        if (!input.value.trim()) {
          isValid = false;
          if (errorMsg) errorMsg.style.display = 'block';
          input.style.borderColor = 'var(--primary-red)';
        } else {
          if (errorMsg) errorMsg.style.display = 'none';
          input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Simple Phone Number Validation if type is tel or name is phone
        if (input.name === 'phone' && input.value.trim()) {
          const phoneRegex = /^[6-9]\d{9}$/; // 10 digit Indian mobile numbers
          const cleanPhone = input.value.replace(/\s+/g, '').replace(/[-+()]/g, '');
          // Remove leading 91 or +91 if present
          const processedPhone = cleanPhone.length > 10 && cleanPhone.startsWith('91') ? cleanPhone.slice(2) : cleanPhone;

          if (processedPhone.length !== 10 || !phoneRegex.test(processedPhone)) {
            isValid = false;
            if (errorMsg) {
              errorMsg.textContent = 'Please enter a valid 10-digit phone number.';
              errorMsg.style.display = 'block';
            }
            input.style.borderColor = 'var(--primary-red)';
          }
        }
      });

      if (isValid) {
        // Show success alert
        if (successMessage) {
          successMessage.style.display = 'block';
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          if (successMessage) {
            successMessage.style.display = 'none';
          }
        }, 6000);
      }
    });

    // Clear error style on input
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const parent = input.closest('.form-group');
        const errorMsg = parent.querySelector('.form-error');
        if (errorMsg) errorMsg.style.display = 'none';
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
    });
  }
});
