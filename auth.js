// Authentication Module for EventHub
// Handles user registration, login, and role-based access control

const Auth = (function () {
    // Role constants
    const ROLES = {
        STUDENT: 'student',
        ADMIN: 'admin'
    };

    // Default admin account
    const DEFAULT_ADMIN = {
        email: 'admin@eventhub.edu',
        password: 'admin123',
        name: 'Admin User',
        role: ROLES.ADMIN
    };

    // Teacher access key
    

    // Initialize users array from localStorage or use default
    function getUsers() {
        const users = localStorage.getItem('users');
        if (!users) {
            // Initialize with default admin
            const defaultUsers = [DEFAULT_ADMIN];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
            return defaultUsers;
        }
        return JSON.parse(users);
    }

    // Save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Get current logged-in user
    function getCurrentUser() {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    }

    // Set current user
    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Clear current user
    function clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password validation
    function isValidPassword(password) {
        return password && password.length >= 6;
    }

    // Check if email already exists
    function emailExists(email) {
        const users = getUsers();
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Register new user
    function register(name, email, password, role,) {
        // Validation
        if (!name || !email || !password || !role) {
            return {
                success: false,
                message: 'All fields are required'
            };
        }

        if (!isValidEmail(email)) {
            return {
                success: false,
                message: 'Please enter a valid email address'
            };
        }

        if (!isValidPassword(password)) {
            return {
                success: false,
                message: 'Password must be at least 6 characters long'
            };
        }

        // Check if email already exists
        if (emailExists(email)) {
            return {
                success: false,
                message: 'This email is already registered',
                isGmail: email.toLowerCase().includes('@gmail.com')
            };
        }

    

       

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email: email.toLowerCase(),
            password, // In production, this should be hashed
            role,
            createdAt: new Date().toISOString()
        };

        // Add user to users array
        const users = getUsers();
        users.push(newUser);
        saveUsers(users);

        // Auto login after registration
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        setCurrentUser(userWithoutPassword);

        return {
            success: true,
            message: 'Registration successful',
            user: userWithoutPassword
        };
    }

    // Login user
   function login(email, password, role) {
    if (!email || !password || !role) {
        return {
            success: false,
            message: 'All fields are required'
        };
    }

    const users = getUsers();

    const user = users.find(u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
        console.log("Users:", users);
        console.log("Trying:", email, password, role);
        return {
            success: false,
            message: 'Invalid credentials'
        };
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    setCurrentUser(userWithoutPassword);

    return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword
    };
}

    // Logout user
    function logout() {
        clearCurrentUser();
        window.location.href = 'index.html';
    }

    // Check if user is logged in
    function isLoggedIn() {
        return getCurrentUser() !== null;
    }

    // Check if user has specific role
    function hasRole(role) {
        const currentUser = getCurrentUser();
        return currentUser && currentUser.role === role;
    }

    // Check if user can access event (basic implementation)
    function canAccessEvent(eventId) {
        return isLoggedIn(); // All logged-in users can access events
    }

    // Get user's dashboard URL
    function getDashboardUrl() {
        const currentUser = getCurrentUser();
        if (!currentUser) return 'index.html';

        switch (currentUser.role) {
            case ROLES.ADMIN:
                return 'admin-dashboard.html';
            case ROLES.STUDENT:
                return 'student-dashboard.html';
            default:
                return 'index.html';
        }
    }

    // Password reset (basic implementation)
    function requestPasswordReset(email) {
        if (!isValidEmail(email)) {
            return {
                success: false,
                message: 'Please enter a valid email address'
            };
        }

        if (!emailExists(email)) {
            return {
                success: false,
                message: 'No account found with this email'
            };
        }

        // In production, this would send an email
        return {
            success: true,
            message: 'Password reset link has been sent to your email'
        };
    }

    // Dispatch auth initialized event
    setTimeout(() => {
        const event = new Event('auth_initialized');
        window.dispatchEvent(event);
    }, 0);

    // Public API
    return {
        ROLES,
        register,
        login,
        logout,
        isLoggedIn,
        hasRole,
        getCurrentUser,
        canAccessEvent,
        getDashboardUrl,
        requestPasswordReset,
       };
})();

// Make Auth available globally
window.Auth = Auth;
