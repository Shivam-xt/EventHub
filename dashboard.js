// Shared Dashboard Functionality
// Handles common dashboard features across all user roles

document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard script loaded');

    // Initialize dashboard features
    initThemeToggle();
    initSidebarNavigation();
    initSearch();
    initNotifications();
    updateUserInfo();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle i');
    if (!themeToggle) return;

    if (theme === 'dark') {
        themeToggle.className = 'fas fa-sun';
    } else {
        themeToggle.className = 'fas fa-moon';
    }
}

// Sidebar Navigation
function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));

            // Add active class to clicked link
            if (!this.id || this.id !== 'logout-link') {
                this.parentElement.classList.add('active');
            }
        });
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.header-search input');
    const searchButton = document.querySelector('.header-search button');

    if (!searchInput || !searchButton) return;

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchInput = document.querySelector('.header-search input');
    const query = searchInput.value.trim();

    if (!query) return;

    console.log('Searching for:', query);
    // TODO: Implement actual search functionality
    showNotification(`Searching for: ${query}`, 'info');
}

// Notifications
function initNotifications() {
    const notificationBell = document.querySelector('.notifications');
    if (!notificationBell) return;

    notificationBell.addEventListener('click', function () {
        showNotification('No new notifications', 'info');
    });
}

// Update user info in dashboard header
function updateUserInfo() {
    if (typeof Auth === 'undefined') return;

    const currentUser = Auth.getCurrentUser();
    if (!currentUser) return;

    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }

    // Update role badge if exists
    const roleBadge = document.querySelector('.role-badge');
    if (roleBadge) {
        roleBadge.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
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

// Export for use in other scripts
window.DashboardUtils = {
    showNotification,
    updateUserInfo
};
