/**
 * SHIVAM SHARMA | PERSONAL PORTFOLIO LOGIC
 * Dynamic typing, theme management, scroll-spy, filters, modals & toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initScrollSpyAndProgress();
  initSkillFilters();
  initProjectFilters();
  initModals();
  initLiveClock();
  initCopyEmail();
  initContactForm();
  initMobileMenu();
  initStatsObserver();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} theme`);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

/* --------------------------------------------------------------------------
   2. Dynamic Role Typing Effect
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Electronics Engineering Student',
    'Embedded Systems & IoT Enthusiast',
    'Web Developer & Creative Coder',
    'Robotics & Circuit Design Explorer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Short pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Scroll Spy, Top Progress Bar & Back-to-Top
   -------------------------------------------------------------------------- */
function initScrollSpyAndProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scroll Spy active section tracking
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   4. Skills Filter & Animated Progress Bars
   -------------------------------------------------------------------------- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const progressBars = document.querySelectorAll('.skill-progress-fill');

  // Animate skill bars when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-level') || '85%';
        bar.style.width = targetWidth;
      }
    });
  }, { threshold: 0.2 });

  progressBars.forEach(bar => observer.observe(bar));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Project Details & Resume Modals
   -------------------------------------------------------------------------- */
const PROJECT_DATA = {
  smarthome: {
    title: 'Smart Home Automation System',
    category: 'IoT & Embedded',
    image: 'assets/images/project-analytics.jpg',
    metric: '4 Sensors | Real-Time Web Dashboard',
    overview: 'An ESP32-based home automation system with real-time sensor monitoring (temperature, humidity, gas), relay-controlled appliances, and a web dashboard accessible over Wi-Fi.',
    challenges: 'Learned about MQTT protocol, asynchronous sensor polling, relay logic, and building a responsive web interface that updates live sensor values without page refresh.',
    solution: 'Used ESP32 with DHT22, MQ-2, and LDR sensors communicating over MQTT. Built a lightweight HTML/CSS/JS dashboard served by the ESP32 itself, with WebSocket-based live data updates.',
    tech: ['ESP32', 'Arduino IDE', 'HTML/CSS/JS', 'MQTT', 'DHT22', 'Relay Module'],
    liveUrl: '#',
    githubUrl: 'https://github.com/shivamsharma/smart-home'
  },
  weatherstation: {
    title: 'IoT Weather Station',
    category: 'IoT & Embedded',
    image: 'assets/images/project-ai.jpg',
    metric: 'Cloud Data Logging | OLED Display',
    overview: 'A portable weather monitoring station built with Arduino Nano and BME280/DHT22 sensors, logging temperature, humidity, and pressure data to ThingSpeak for cloud visualization.',
    challenges: 'Gained experience with I2C communication protocols, power management for portable operation, and integrating with cloud IoT platforms for data logging and visualization.',
    solution: 'Connected BME280 sensor via I2C to Arduino Nano, displayed readings on SSD1306 OLED, and transmitted data to ThingSpeak via ESP8266 Wi-Fi module for cloud graphing.',
    tech: ['Arduino Nano', 'BME280', 'ESP8266', 'ThingSpeak', 'OLED SSD1306', 'I2C'],
    liveUrl: '#',
    githubUrl: 'https://github.com/shivamsharma/weather-station'
  },
  portfolio: {
    title: 'Personal Portfolio Website',
    category: 'Web Development',
    image: 'assets/images/project-fintech.jpg',
    metric: 'Fully Responsive | Dark & Light Mode',
    overview: 'A modern, responsive portfolio website (this very site!) featuring dark/light theme switching, glassmorphism design, animated skill bars, interactive project modals, and smooth scroll-spy navigation.',
    challenges: 'Learned advanced CSS techniques like glassmorphism and custom properties, JavaScript DOM manipulation for interactive filtering, and how to structure a complete multi-section website.',
    solution: 'Built entirely with vanilla HTML5, CSS3 (with custom properties for theming), and JavaScript. Used IntersectionObserver for scroll animations, localStorage for theme persistence, and modular JS architecture.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Responsive Design'],
    liveUrl: '#',
    githubUrl: 'https://github.com/shivamsharma/portfolio'
  },
  robotcar: {
    title: 'Line Following & Obstacle Avoidance Robot',
    category: 'Electronics & Hardware',
    image: 'assets/images/project-ai.jpg',
    metric: 'PID Control | 5 IR Sensors | Ultrasonic',
    overview: 'An Arduino-powered autonomous robot that follows a black line track using IR sensors and dynamically avoids obstacles with ultrasonic sensors, featuring PID-controlled motor speed.',
    challenges: 'Understood PID control theory and tuned it for smooth line-following, dealt with sensor noise filtering, and managed motor driver PWM for precise speed control.',
    solution: 'Used 5-channel IR sensor array for line detection with PID algorithm for smooth turns. HC-SR04 ultrasonic sensor triggers obstacle avoidance mode. L298N motor driver controls two DC motors.',
    tech: ['Arduino UNO', 'L298N Motor Driver', 'IR Sensor Array', 'HC-SR04', 'PID Algorithm'],
    liveUrl: '#',
    githubUrl: 'https://github.com/shivamsharma/line-follower-robot'
  },
  calculator: {
    title: 'Scientific Calculator Web App',
    category: 'Web Development',
    image: 'assets/images/project-analytics.jpg',
    metric: 'Full Scientific Functions | Keyboard Support',
    overview: 'A feature-rich scientific calculator web application with trigonometric functions, logarithms, history panel, keyboard support, and a clean glassmorphism dark UI.',
    challenges: 'Learned about parsing mathematical expressions, handling operator precedence, managing calculation history state, and implementing keyboard event listeners.',
    solution: 'Built with vanilla JavaScript using eval-safe expression parsing, CSS Grid for button layout, and localStorage for calculation history persistence.',
    tech: ['HTML5', 'CSS Grid', 'JavaScript', 'Math.js'],
    liveUrl: '#',
    githubUrl: 'https://github.com/shivamsharma/sci-calculator'
  },
  signalgen: {
    title: 'DIY Function Signal Generator',
    category: 'Electronics & Hardware',
    image: 'assets/images/project-fintech.jpg',
    metric: '3 Waveforms | 20Hz–20kHz Range',
    overview: 'A custom-built function generator capable of producing sine, square, and triangular waveforms using op-amp oscillator circuits, with adjustable frequency and amplitude controls.',
    challenges: 'Deepened understanding of op-amp oscillator topologies (Wien bridge, astable multivibrator), frequency stability, and analog signal conditioning.',
    solution: 'Designed Wien bridge oscillator for sine waves, Schmitt trigger for square waves, and integrator circuit for triangle waves. Simulated in LTspice before building on perfboard, then designed PCB in KiCad.',
    tech: ['Op-Amps (741)', 'Wien Bridge Oscillator', 'PCB (KiCad)', 'LTspice Simulation'],
    liveUrl: '#',
    githubUrl: 'https://github.com/shivamsharma/signal-generator'
  }
};

function initModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const projectDetailBtns = document.querySelectorAll('[data-project-btn]');

  const resumeModal = document.getElementById('resume-modal');
  const resumeCloseBtn = document.getElementById('resume-close');
  const resumeTriggers = document.querySelectorAll('[data-resume-trigger]');

  // Project Modal Open
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project-btn');
      const data = PROJECT_DATA[projId];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-category').textContent = data.category;
      document.getElementById('modal-metric').textContent = data.metric;
      document.getElementById('modal-overview').textContent = data.overview;
      document.getElementById('modal-challenges').textContent = data.challenges;
      document.getElementById('modal-solution').textContent = data.solution;

      const imgElem = document.getElementById('modal-img');
      if (imgElem) {
        imgElem.src = data.image;
        imgElem.alt = data.title;
      }

      const techContainer = document.getElementById('modal-tech');
      techContainer.innerHTML = '';
      data.tech.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = t;
        techContainer.appendChild(tag);
      });

      const liveBtn = document.getElementById('modal-live-link');
      if (liveBtn) liveBtn.href = data.liveUrl;

      const codeBtn = document.getElementById('modal-code-link');
      if (codeBtn) codeBtn.href = data.githubUrl;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Project Modal Close
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Resume Modal Open/Close
  resumeTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', closeResumeModal);
  }
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeResumeModal();
    }
  });

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function closeResumeModal() {
    if (resumeModal) resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   7. Live Time Widget (PST / San Francisco)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockElement = document.getElementById('live-time');
  if (!clockElement) return;

  function updateClock() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const now = new Date();
    const timeString = new Intl.DateTimeFormat('en-IN', options).format(now);
    clockElement.textContent = `${timeString} IST`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   8. One-Click Copy to Clipboard & Toast
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  const email = 'shivamsharma@example.com';

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard: ' + email);
      }).catch(() => {
        showToast('Direct email: ' + email);
      });
    });
  });
}

function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const isError = type === 'error';
  const icon = isError
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;

  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'toast-error' : ''}`;
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/* --------------------------------------------------------------------------
   9. Contact Form Submission (Web3Forms Real Email Delivery)
   -------------------------------------------------------------------------- */
// 👉 Web3Forms Access Key:
// 1. Visit https://web3forms.com
// 2. Enter your email (where you want to receive messages)
// 3. Paste the free Access Key sent to your email below:
const WEB3FORMS_ACCESS_KEY = '16d990e2-6c66-4bdd-8ce9-211a76c057af';

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Check if the access key is present
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
      showToast('Please add your Web3Forms access key in js/main.js to receive messages!', 'error');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.85"></path>
      </svg>
      Sending Message...
    `;

    try {
      const formData = new FormData(form);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('from_name', 'Portfolio Contact Form');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        form.reset();
        showToast('Thank you! Your message has been sent to my email inbox.');
      } else {
        showToast(result.message || 'Failed to send message. Please try emailing directly.', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try sending again or email directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* --------------------------------------------------------------------------
   10. Mobile Menu Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    mobileToggle.innerHTML = isOpen
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });
  });
}

/* --------------------------------------------------------------------------
   11. Stats Numbers Counting Animation
   -------------------------------------------------------------------------- */
function initStatsObserver() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1500;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              clearInterval(timer);
              el.textContent = `${prefix}${target}${suffix}`;
            } else {
              el.textContent = `${prefix}${Math.floor(count)}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-bar');
  if (statsSection) observer.observe(statsSection);
}

// Add spinning animation keyframes for loader
const styleEl = document.createElement('style');
styleEl.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleEl);
