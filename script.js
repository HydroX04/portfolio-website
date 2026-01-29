// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
                scrollTimeout = null;
            }, 100);
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('.section, header');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (pageYOffset >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
                
                scrollTimeout = null;
            }, 100);
        }
    });
}

// Animate Skill Bars on Scroll
const skillSection = document.querySelector('.skills');
let skillsAnimated = false;

function animateSkills() {
    if (!skillsAnimated) {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100 + (index * 50)); // Stagger animation
        });
        skillsAnimated = true;
    }
}

if (skillSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillSection);
}

// Typing Effect for Hero Text
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.opacity = '1'; // Ensure visibility
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// Smooth Reveal Animation on Scroll with Intersection Observer
const revealElements = document.querySelectorAll('.project-card, .skill-item, .about .content');

if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        revealObserver.observe(el);
    });
}

// Lazy Loading Images
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const submitBtn = this.querySelector('button[type="submit"]');

        // Validate inputs
        if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        const formData = new FormData();
        formData.append('name', name.value.trim());
        formData.append('email', email.value.trim());
        formData.append('message', message.value.trim());

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Required for Google Apps Script
        })
        .then(() => {
            showNotification(`Thank you, ${name.value}! Your message has been sent.`, 'success');
            contactForm.reset();
        })
        .catch(error => {
            showNotification('There was an error sending your message. Please try again later.', 'error');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        });
    });
}

// Custom Notification Function
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" aria-hidden="true"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Trigger reflow for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-dismiss notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: -400px;
        background: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        transition: right 0.3s ease;
        max-width: 350px;
    }
    
    .notification.show {
        right: 30px;
    }
    
    .notification i {
        font-size: 1.5em;
    }
    
    .notification.success {
        border-left: 4px solid #4caf50;
    }
    
    .notification.success i {
        color: #4caf50;
    }
    
    .notification.error {
        border-left: 4px solid #f44336;
    }
    
    .notification.error i {
        color: #f44336;
    }
    
    @media (max-width: 480px) {
        .notification {
            max-width: calc(100% - 40px);
            right: -100%;
        }
        
        .notification.show {
            right: 20px;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Keyboard Navigation Enhancement
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Performance: Reduce animations on low-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition', 'none');
}

// Skill Tabs Functionality
const skillTabButtons = document.querySelectorAll('.skill-tab-btn');
const skillPanels = document.querySelectorAll('.skill-panel');
let currentTabIndex = 0;
let skillTabAutoPlayInterval;
let isUserInteracting = false;

function switchSkillTab(index) {
    if (index >= skillTabButtons.length) {
        index = 0; // Loop back to first tab
    }
    if (index < 0) {
        index = skillTabButtons.length - 1;
    }
    
    const button = skillTabButtons[index];
    const category = button.getAttribute('data-category');
    
    // Remove active class from all buttons
    skillTabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    // Remove active class from all panels
    skillPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    
    // Add active class to corresponding panel
    const activePanel = document.querySelector(`.skill-panel[data-category="${category}"]`);
    if (activePanel) {
        activePanel.classList.add('active');
    }
    
    currentTabIndex = index;
}

// Auto-play skill tabs
function startSkillTabAutoPlay() {
    skillTabAutoPlayInterval = setInterval(() => {
        if (!isUserInteracting) {
            currentTabIndex = (currentTabIndex + 1) % skillTabButtons.length;
            switchSkillTab(currentTabIndex);
        }
    }, 4000); // Change tab every 4 seconds
}

// Pause auto-play when user hovers or interacts
function pauseSkillTabAutoPlay() {
    isUserInteracting = true;
    clearInterval(skillTabAutoPlayInterval);
}

function resumeSkillTabAutoPlay() {
    isUserInteracting = false;
    startSkillTabAutoPlay();
}

if (skillTabButtons.length > 0) {
    // Click handler for tabs
    skillTabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            pauseSkillTabAutoPlay();
            currentTabIndex = index;
            switchSkillTab(currentTabIndex);
            
            // Resume auto-play after 8 seconds of inactivity
            setTimeout(() => {
                resumeSkillTabAutoPlay();
            }, 8000);
        });
        
        // Pause on hover
        button.addEventListener('mouseenter', pauseSkillTabAutoPlay);
        button.addEventListener('mouseleave', resumeSkillTabAutoPlay);
    });
    
    // Start auto-play on page load
    startSkillTabAutoPlay();
}

// Accessibility: Allow keyboard navigation with arrow keys
if (skillTabButtons.length > 0) {
    skillTabButtons.forEach((button, index) => {
        button.addEventListener('keydown', (e) => {
            let targetIndex = index;
            
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                pauseSkillTabAutoPlay();
                targetIndex = (index + 1) % skillTabButtons.length;
                switchSkillTab(targetIndex);
                setTimeout(resumeSkillTabAutoPlay, 8000);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                pauseSkillTabAutoPlay();
                targetIndex = (index - 1 + skillTabButtons.length) % skillTabButtons.length;
                switchSkillTab(targetIndex);
                setTimeout(resumeSkillTabAutoPlay, 8000);
            }
        });
    });
}

// Console message for developers
console.log('%c👋 Hi there, developer!', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cInterested in the code? Check out my GitHub: https://github.com/HydroX04', 'font-size: 14px; color: #764ba2;');
console.log('%cFeel free to reach out: dynartubigan.1@gmail.com', 'font-size: 14px; color: #f5576c;');
