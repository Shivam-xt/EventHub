// Main JavaScript for College Event Management Platform
let selectedRole = "student";

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    console.log('Main script loaded');

    // Initialize all animations and interactions
    initNavbar();
    initHeroSlider();
    initCarousel();
    initScrollAnimations();
    initAuthForms();
    document.querySelectorAll(".role-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        // active class remove
        document.querySelectorAll(".role-tab").forEach(t => t.classList.remove("active"));

        // active add
        tab.classList.add("active");

        // role set
        selectedRole = tab.getAttribute("data-role");

        console.log("Selected Role:", selectedRole);
    });
});
});

// Navbar animations and interactions
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Show auth buttons in mobile view
        const authButtons = document.querySelector('.auth-buttons');
        if (window.innerWidth <= 768 && authButtons) {
            authButtons.classList.toggle('mobile-visible');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Hero section background slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-background-slider .slide');
    let currentSlide = 0;

    // Function to change slide
    function changeSlide() {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Add active class to current slide
        slides[currentSlide].classList.add('active');

        // Update current slide index
        currentSlide = (currentSlide + 1) % slides.length;
    }

    // Set initial slide
    changeSlide();

    // Set interval for automatic slide change
    setInterval(changeSlide, 5000);
}

// Featured events carousel
function initCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    let currentSlide = 0;

    // Set initial slide
    updateCarousel();

    // Previous button click
    prevBtn.addEventListener('click', function () {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    // Next button click
    nextBtn.addEventListener('click', function () {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Update carousel display
    function updateCarousel() {
        // Update container transform
        carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update active slide content
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    // Auto slide change
    setInterval(function () {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }, 7000);
}

// Scroll animations
function initScrollAnimations() {
    // Get all elements that need to be animated on scroll
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .contact-container');

    // Intersection Observer options
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    // Intersection Observer callback
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Notification toast function
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Authentication forms handling
function initAuthForms() {
    // Role selector functionality for register modal
    const registerRoleTabs = document.querySelectorAll('#register-modal .role-tab');
    let selectedRegisterRole = 'student'; // default

    registerRoleTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active from all tabs
            registerRoleTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            // Update selected role
            selectedRegisterRole = this.dataset.role;

            // Show/hide admin key field
            const adminKeyGroup = document.querySelector('#register-modal .admin-key-group');
            if (adminKeyGroup) {
                if (selectedRegisterRole === 'admin') {
                    adminKeyGroup.style.display = 'block';
                } else {
                    adminKeyGroup.style.display = 'none';
                }
            }
        });
    });

    // Role selector functionality for login modal
    const loginRoleTabs = document.querySelectorAll('#login-modal .role-tab');
    let selectedLoginRole = 'student'; // default

    loginRoleTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active from all tabs
            loginRoleTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            // Update selected role
            selectedLoginRole = this.dataset.role;

            // Show/hide admin key field
            const adminKeyGroup = document.querySelector('#login-modal .admin-key-group');
            if (adminKeyGroup) {
                if (selectedLoginRole === 'admin') {
                    adminKeyGroup.style.display = 'block';
                } else {
                    adminKeyGroup.style.display = 'none';
                }
            }
        });
    });

    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const adminKey = document.getElementById('register-admin-key') ?
                document.getElementById('register-admin-key').value : '';

            // Validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            const result = Auth.register(name, email, password, selectedRegisterRole, adminKey);

            if (result.success) {
                showNotification('Registration successful! Redirecting...', 'success');

                // Close modal
                const modal = document.getElementById('register-modal');
                if (modal) modal.style.display = 'none';

                // Redirect to appropriate dashboard based on role
                setTimeout(() => {
                    let targetPage;
                    if (selectedRegisterRole === 'admin') targetPage = 'admin-dashboard.html';
                    else if (selectedRegisterRole === 'admin') targetPage = 'admin-dashboard.html';
                    else targetPage = 'student-dashboard.html';

                    window.location.href = targetPage;
                }, 1000);
            } else {
                showNotification(result.message, 'error');
            }
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const result = Auth.login(email, password, selectedRole);

            if (result.success) {
                showNotification('Login successful! Redirecting...', 'success');

                // Close modal
                const modal = document.getElementById('login-modal');
                if (modal) modal.style.display = 'none';

                // Get user role and redirect to appropriate dashboard
                const currentUser = result.user;
                setTimeout(() => {
                    let targetPage;
                    if (currentUser.role === 'admin') targetPage = 'admin-dashboard.html';
                    else if (currentUser.role === 'admin') targetPage = 'admin-dashboard.html';
                    else targetPage = 'student-dashboard.html';

                    window.location.href = targetPage;
                }, 1000);
            } else {
                showNotification(result.message, 'error');
            }
        });
    }

    // Forgot password form
    const forgotPasswordLink = document.getElementById('forgot-password');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const backToLoginLink = document.getElementById('back-to-login');

    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'none';
            forgotPasswordModal.style.display = 'flex';
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', function (e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'none';
            document.getElementById('login-modal').style.display = 'flex';
        });
    }

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;
            const result = Auth.requestPasswordReset(email);
            showNotification(result.message, result.success ? 'success' : 'error');

            if (result.success) {
                setTimeout(() => {
                    forgotPasswordModal.style.display = 'none';
                    document.getElementById('login-modal').style.display = 'flex';
                }, 2000);
            }
        });
    }
}

// Add keyframe animation for pulse effect
if (!document.querySelector('#pulse-animation')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation';
    style.textContent = `
        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(229, 9, 20, 0.7);
            }
            70% {
                transform: scale(1.05);
                box-shadow: 0 0 0 10px rgba(229, 9, 20, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(229, 9, 20, 0);
            }
        }
        
        @keyframes zoomEffect {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Modal functionality
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeBtns = document.querySelectorAll('.close');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');

// Role-based access control
function initRoleBasedAccess() {
    // Check if Auth module is loaded
    if (typeof Auth === 'undefined') return;

    // Get current user
    const currentUser = Auth.getCurrentUser();

    // Update UI based on user role
    if (currentUser) {
        // Update auth buttons
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="user-info">
                    <span class="user-name">${currentUser.name}</span>
                    <span class="user-role ${currentUser.role}-role">${currentUser.role}</span>
                </div>
                <button id="dashboard-btn" class="btn">Dashboard</button>
                <button id="logout-btn" class="btn">Logout</button>
            `;

            // Add event listeners
            document.getElementById('dashboard-btn').addEventListener('click', () => {
                const targetPage = `${currentUser.role}-dashboard.html`;
                if (window.AppRouter) {
                    window.AppRouter.navigateTo(targetPage);
                } else {
                    window.location.href = targetPage;
                }
            });

            document.getElementById('logout-btn').addEventListener('click', () => {
                Auth.logout();
            });
        }

        // Show/hide role-specific elements
        document.querySelectorAll('.role-specific').forEach(el => {
            el.style.display = 'none';
        });

        document.querySelectorAll(`.${currentUser.role}-specific`).forEach(el => {
            el.style.display = 'block';
        });

        // Update event cards based on permissions
        updateEventCards();
    }
}

// Update event cards based on user permissions
function updateEventCards() {
    if (typeof Auth === 'undefined') return;

    const currentUser = Auth.getCurrentUser();
    if (!currentUser) return;

    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        const eventId = parseInt(card.dataset.eventId);

        // If event ID is defined and user doesn't have access
        if (eventId && !Auth.canAccessEvent(eventId)) {
            card.classList.add('restricted-event');

            // Replace action buttons with restricted message
            const actionButtons = card.querySelector('.event-actions');
            if (actionButtons) {
                actionButtons.innerHTML = `
                    <div class="restricted-message">
                        <i class="fas fa-lock"></i>
                        <span>You don't have access to this event</span>
                    </div>
                `;
            }
        }
    });
}

// Initialize role-based access on page load
document.addEventListener('DOMContentLoaded', function () {
    // Wait for Auth module to load
    if (typeof Auth !== 'undefined') {
        initRoleBasedAccess();
    } else {
        // If Auth is not loaded yet, wait for it
        window.addEventListener('auth_initialized', initRoleBasedAccess);
    }
});

// Open login modal
if (loginBtn) {
    loginBtn.addEventListener('click', function () {
        loginModal.classList.add('flex');
        loginModal.style.display = 'flex';
    });
}

// Open register modal
if (registerBtn) {
    registerBtn.addEventListener('click', function () {
        registerModal.classList.add('flex');
        registerModal.style.display = 'flex';
    });
}

// Close modals
closeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        loginModal.classList.remove('flex');
        registerModal.classList.remove('flex');
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';

        // Also close forgot password modal
        const forgotPasswordModal = document.getElementById('forgot-password-modal');
        if (forgotPasswordModal) {
            forgotPasswordModal.classList.remove('flex');
            forgotPasswordModal.style.display = 'none';
        }
    });
});

// Switch between modals
if (switchToRegister) {
    switchToRegister.addEventListener('click', function (e) {
        e.preventDefault();
        loginModal.classList.remove('flex');
        loginModal.style.display = 'none';
        registerModal.classList.add('flex');
        registerModal.style.display = 'flex';
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', function (e) {
        e.preventDefault();
        registerModal.classList.remove('flex');
        registerModal.style.display = 'none';
        loginModal.classList.add('flex');
        loginModal.style.display = 'flex';
    });
}

// Close modal when clicking outside
window.addEventListener('click', function (event) {
    if (event.target === loginModal) {
        loginModal.classList.remove('flex');
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.classList.remove('flex');
        registerModal.style.display = 'none';
    }
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    if (forgotPasswordModal && event.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove('flex');
        forgotPasswordModal.style.display = 'none';
    }
});
