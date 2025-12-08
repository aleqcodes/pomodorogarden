// ============================================
// MAIN APP MODULE
// Initializes and coordinates all modules
// ============================================

/**
 * Theme management
 */
function initTheme() {
    try {
        const savedTheme = localStorage.getItem('pomodoroTheme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        console.warn('Could not load theme preference:', e);
    }
}

/**
 * Set theme
 * @param {string} theme - Theme to set (light/dark)
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    try {
        localStorage.setItem('pomodoroTheme', theme);
    } catch (e) {
        console.warn('Could not save theme preference:', e);
    }

    if (typeof updateThemeButtonLabel === 'function') {
        updateThemeButtonLabel();
    }
}

/**
 * Toggle theme
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
}

/**
 * Request notification permission
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(e => {
            console.warn('Could not request notification permission:', e);
        });
    }
}

/**
 * Initialize application
 */
function initApp() {
    console.log('🍅 Pomodoro Garden - Initializing...');

    // Initialize theme first (before DOM is visible)
    initTheme();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        startApp();
    }
}

/**
 * Start application after DOM is ready
 */
function startApp() {
    try {
        // Initialize modules in order
        initLanguage();
        initTimer();
        initGarden();

        // Apply language to UI
        applyLanguage();

        // Request notification permission
        requestNotificationPermission();

        console.log('✅ Pomodoro Garden - Ready!');
    } catch (e) {
        console.error('❌ Error initializing app:', e);
        alert('Error initializing application. Please refresh the page.');
    }
}

// Start app initialization
initApp();
