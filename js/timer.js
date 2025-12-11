// ============================================
// TIMER MODULE
// Manages Pomodoro timer functionality
// ============================================

// Timer modes configuration
const MODES = {
    focus: {
        time: 25 * 60,
        color: 'text-green-500',
        label: 'Focus',
        reward: 'tree'
    },
    short: {
        time: 5 * 60,
        color: 'text-teal-500',
        label: 'Short Break',
        reward: 'flower'
    },
    long: {
        time: 15 * 60,
        color: 'text-indigo-500',
        label: 'Long Break',
        reward: 'butterfly'
    }
};

// Timer state (exposed globally for i18n module)
window.timerState = {
    timeLeft: MODES.focus.time,
    currentMode: 'focus',
    isRunning: false,
    timerId: null,
    startTs: null,
    endTs: null
};

// DOM elements (initialized in initTimer)
let timerDisplay = null;
let statusText = null;
let playBtn = null;
let iconPlay = null;
let textPlay = null;
let progressWrapper = null;
let spinnerWrapper = null;
let alarmSound = null;

/**
 * Initialize timer module
 */
function initTimer() {
    // Get DOM elements
    timerDisplay = document.getElementById('timer-display');
    statusText = document.getElementById('status-text');
    playBtn = document.getElementById('toggle-btn');
    iconPlay = document.getElementById('icon-play');
    textPlay = document.getElementById('text-play');
    progressWrapper = document.getElementById('progress-wrapper');
    spinnerWrapper = document.getElementById('spinner-wrapper');
    alarmSound = document.getElementById('alarm-sound');

    // Set initial mode and display
    setMode('focus');
}

/**
 * Format seconds to MM:SS
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time
 */
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Update timer display
 */
function updateDisplay() {
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(window.timerState.timeLeft);
    }

    const totalTime = MODES[window.timerState.currentMode].time;
    const percent = ((totalTime - window.timerState.timeLeft) / totalTime) * 100;
    setProgress(percent);

    // Update document title
    const modeKey = 'doc_label_' + window.timerState.currentMode;
    document.title = `${formatTime(window.timerState.timeLeft)} - ${t(modeKey)}`;
}

/**
 * Set progress circle percentage using CSS custom property
 * @param {number} percent - Progress percentage (0-100)
 */
function setProgress(percent) {
    if (!progressWrapper) return;

    // Convert percent to degrees (0-360)
    const degrees = (percent / 100) * 360;

    // Update CSS custom property for conic-gradient
    const circle = progressWrapper.querySelector('.timer-progress-circle');
    if (circle) {
        circle.style.setProperty('--progress', `${degrees}deg`);
    }
}

/**
 * Start spinner animation
 */
function startSpinner() {
    if (!spinnerWrapper) return;
    spinnerWrapper.classList.add('active');
}

/**
 * Stop spinner animation
 */
function stopSpinner() {
    if (!spinnerWrapper) return;
    spinnerWrapper.classList.remove('active');
}

/**
 * Start timer
 */
/**
 * Start timer
 */
function startTimer() {
    if (window.timerState.isRunning) return;

    if (window.timerState.timeLeft <= 0) {
        window.timerState.timeLeft = MODES[window.timerState.currentMode].time;
    }

    window.timerState.isRunning = true;

    // Update button appearance
    if (playBtn) {
        playBtn.classList.add('running');
    }
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
        timerContainer.classList.add('running');
    }

    if (iconPlay) iconPlay.textContent = '⏸';
    if (textPlay) textPlay.textContent = t('btn_pause');
    if (statusText) statusText.textContent = t('status_growing');

    startSpinner();

    // Calculate end time
    window.timerState.startTs = Date.now();
    window.timerState.endTs = window.timerState.startTs + window.timerState.timeLeft * 1000;

    // Start countdown
    window.timerState.timerId = setInterval(() => {
        const remain = Math.max(0, Math.floor((window.timerState.endTs - Date.now()) / 1000));

        if (remain !== window.timerState.timeLeft) {
            window.timerState.timeLeft = remain;
            updateDisplay();
        }

        if (remain <= 0) {
            completeCycle();
        }
    }, 250);
}

/**
 * Pause timer
 */
function pauseTimer() {
    if (window.timerState.timerId) {
        clearInterval(window.timerState.timerId);
        window.timerState.timerId = null;
    }

    window.timerState.isRunning = false;

    // Update button appearance
    if (playBtn) {
        playBtn.classList.remove('running');
    }
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
        timerContainer.classList.remove('running');
    }

    if (iconPlay) iconPlay.textContent = '▶';
    if (textPlay) textPlay.textContent = t('btn_resume');
    if (statusText) statusText.textContent = t('status_paused');

    stopSpinner();
}

/**
 * Reset timer to current mode duration
 */
function resetTimer() {
    pauseTimer();
    window.timerState.timeLeft = MODES[window.timerState.currentMode].time;
    updateDisplay();

    if (statusText) statusText.textContent = t('status_ready');
    if (textPlay) textPlay.textContent = t('btn_start');

    setProgress(0);
    stopSpinner();
}

/**
 * Toggle timer (start/pause)
 */
function toggleTimer() {
    if (window.timerState.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

/**
 * Complete timer cycle and add reward
 */
function completeCycle() {
    pauseTimer();
    window.timerState.timeLeft = 0;
    updateDisplay();

    // Play alarm sound
    try {
        if (alarmSound) {
            alarmSound.play().catch(e => console.warn('Could not play alarm:', e));
        }
    } catch (e) {
        console.warn('Could not play alarm:', e);
    }

    // Add reward to garden
    const rewardType = MODES[window.timerState.currentMode].reward;

    if (typeof addRewardToGarden === 'function') {
        addRewardToGarden(rewardType);
    }

    // Show completion alert
    const alertKey = 'alert_' + rewardType;
    alert(t(alertKey));

    // Show browser notification if permitted
    showNotification(rewardType);

    // Update UI
    if (textPlay) textPlay.textContent = t('btn_start');
    if (statusText) statusText.textContent = t('status_ready');

    stopSpinner();
}

/**
 * Show browser notification
 * @param {string} rewardType - Type of reward earned
 */
function showNotification(rewardType) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            const alertKey = 'alert_' + rewardType;
            new Notification(t('title'), {
                body: t(alertKey),
                icon: '🍅'
            });
        } catch (e) {
            console.warn('Could not show notification:', e);
        }
    }
}

/**
 * Set timer mode
 * @param {string} mode - Mode to set (focus/short/long)
 */
/**
 * Set timer mode
 * @param {string} mode - Mode to set (focus/short/long)
 */
function setMode(mode) {
    if (!MODES[mode]) {
        console.error(`Unknown mode: ${mode}`);
        return;
    }

    // Confirm if timer is running
    if (window.timerState.isRunning) {
        const confirmChange = confirm(t('mode_change_confirm'));
        if (!confirmChange) return;
    }

    pauseTimer();
    window.timerState.currentMode = mode;
    window.timerState.timeLeft = MODES[mode].time;

    // Update mode button states
    document.querySelectorAll('[id^="btn-"]').forEach(btn => {
        btn.setAttribute('aria-selected', 'false');
    });

    const activeBtn = document.getElementById(`btn-${mode}`);
    if (activeBtn) {
        activeBtn.setAttribute('aria-selected', 'true');
    }

    resetTimer();
}

// Expose MODES globally for i18n module
window.MODES = MODES;
