/**
 * script.js - Interactive functionality for Maryann's portfolio
 * Features:
 * - Mobile navigation toggle
 * - Smooth scrolling for internal links
 * - Scroll reveal animations using IntersectionObserver
 * - Contact form validation and submission
 * - Auto-set year in footer
 */

(function() {
  'use strict';

  // DOM Elements
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primaryNav');
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const yearEl = document.getElementById('year');
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.querySelector('.modal-close');

  // Set current year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // PROFILE PHOTO UPLOAD
  // ============================================
  const photoUploadArea = document.getElementById('photoUploadArea');
  const photoInput = document.getElementById('photoInput');
  const profilePhoto = document.getElementById('profilePhoto');

  if (photoUploadArea && photoInput && profilePhoto) {
    // Click on the upload area to trigger file input
    photoUploadArea.addEventListener('click', function() {
      photoInput.click();
    });

    // Handle file selection
    photoInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
          profilePhoto.src = event.target.result;
          profilePhoto.classList.add('loaded');
          
          // Store in localStorage for persistence
          try {
            localStorage.setItem('profilePhotoData', event.target.result);
          } catch (err) {
            console.log('could not save to localStorage:', err);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Load photo from localStorage if it exists
    try {
      const savedPhoto = localStorage.getItem('profilePhotoData');
      if (savedPhoto) {
        profilePhoto.src = savedPhoto;
        profilePhoto.classList.add('loaded');
      }
    } catch (err) {
      console.log('could not load from localStorage:', err);
    }

    // Drag and drop support
    photoUploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.style.borderColor = 'var(--primary-blue)';
      this.style.background = 'var(--light-blue)';
    });

    photoUploadArea.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.style.borderColor = '';
      this.style.background = '';
    });

    photoUploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.style.borderColor = '';
      this.style.background = '';

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        photoInput.files = files;
        const event = new Event('change', { bubbles: true });
        photoInput.dispatchEvent(event);
      }
    });
  }

  // ============================================
  // MOBILE NAVIGATION TOGGLE
  // ============================================
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      primaryNav.classList.toggle('open');
    });

    // Close nav when link clicked
    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('open');
      });
    });
  }

  // ============================================
  // SMOOTH SCROLLING FOR INTERNAL LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ============================================
  // PORTFOLIO FILTERING
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter cards
        portfolioCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.classList.add('visible');
            }, 10);
          } else {
            card.style.display = 'none';
            card.classList.remove('visible');
          }
        });
      });
    });
  }

  // ============================================
  // PORTFOLIO CARDS - OPEN CASE STUDY MODAL
  // ============================================
  portfolioCards.forEach(card => {
    card.addEventListener('click', function() {
      const title = this.querySelector('h3').textContent;
      const category = this.getAttribute('data-category');
      const description = this.querySelector('p').textContent;
      const meta = this.querySelector('.portfolio-meta').innerHTML;
      
      const modalContent = `
        <h3>${title}</h3>
        <p style="color: var(--muted-text); margin-bottom: 1rem;">${category}</p>
        <p>${description}</p>
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
          ${meta}
        </div>
        <p style="margin-top: 1.5rem; color: var(--muted-text);">
          <strong>Results Achieved:</strong> Contact for detailed case study and results documentation.
        </p>
      `;
      
      openProjectModal(modalContent);
    });
  });

  // ============================================
  // PROJECT MODAL FUNCTION
  // ============================================
  function openProjectModal(html) {
    if (!modal) return;
    modalBody.innerHTML = html;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  if (modal && modalClose) {
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
    }
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Observe dynamically added elements
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList && node.classList.contains('reveal')) {
          revealObserver.observe(node);
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // ============================================
  // CONTACT FORM VALIDATION & SUBMISSION
  // ============================================
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form elements
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Clear previous errors
      document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
      });

      contactForm.querySelectorAll('input, textarea').forEach(el => {
        el.classList.remove('error');
      });

      // Validate inputs
      let isValid = true;
      const errors = {};

      // Validate name
      if (!nameInput.value.trim()) {
        errors.name = 'Please enter your full name';
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        errors.email = 'Please enter your email address';
        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      // Validate subject
      if (!subjectInput.value.trim()) {
        errors.subject = 'Please enter a subject';
        isValid = false;
      }

      // Validate message
      if (!messageInput.value.trim()) {
        errors.message = 'Please enter your message';
        isValid = false;
      }

      // Display errors
      if (!isValid) {
        if (errors.name) {
          nameInput.classList.add('error');
          nameInput.nextElementSibling.textContent = errors.name;
        }
        if (errors.email) {
          emailInput.classList.add('error');
          emailInput.nextElementSibling.textContent = errors.email;
        }
        if (errors.subject) {
          subjectInput.classList.add('error');
          subjectInput.nextElementSibling.textContent = errors.subject;
        }
        if (errors.message) {
          messageInput.classList.add('error');
          messageInput.nextElementSibling.textContent = errors.message;
        }
        return;
      }

      // All valid - proceed with submission
      submitForm({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
      });
    });
  }

  // ============================================
  // FORM SUBMISSION
  // ============================================
  function submitForm(formData) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate sending (in production, send to backend API)
    // For now, we'll show a success message after a short delay
    setTimeout(() => {
      // Show success message
      formMessage.textContent = '✓ Thank you! I\'ll get back to you soon.';
      formMessage.classList.add('success');
      formMessage.classList.remove('error');

      // Reset form
      contactForm.reset();

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Clear message after 5 seconds
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.classList.remove('success', 'error');
      }, 5000);
    }, 800);

    // In production, you would do something like:
    /*
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        formMessage.textContent = '✓ Thank you! I\'ll get back to you soon.';
        formMessage.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    })
    .catch(error => {
      formMessage.textContent = '✗ Error sending message. Please try again.';
      formMessage.classList.add('error');
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
    */
  }

  // ============================================
  // STICKY HEADER ON SCROLL
  // ============================================
  let lastScrollTop = 0;
  const siteHeader = document.getElementById('siteHeader');

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      siteHeader.style.boxShadow = '0 12px 24px rgba(15, 23, 42, 0.12)';
    } else {
      siteHeader.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.08)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // ============================================
  // PERFORMANCE: Lazy loading for images
  // ============================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // ACCESSIBILITY: Add keyboard navigation
  // ============================================
  document.addEventListener('keydown', function(e) {
    // Escape key closes mobile nav
    if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
    }
  });

  console.log('Portfolio loaded successfully! 🚀');

})();
