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

// Spinner animation state
let spinnerRAF = null;
let spinnerOffset = 0;
let spinnerCirc = 0;

// DOM elements (initialized in initTimer)
let timerDisplay = null;
let statusText = null;
let playBtn = null;
let iconPlay = null;
let textPlay = null;
let progressRing = null;
let spinnerRing = null;
let alarmSound = null;

// Progress ring properties
let radius = 0;
let circumference = 0;

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
    progressRing = document.getElementById('progress-ring');
    spinnerRing = document.getElementById('spinner-ring');
    alarmSound = document.getElementById('alarm-sound');

    // Initialize progress ring
    if (progressRing) {
        radius = progressRing.r.baseVal.value;
        circumference = radius * 2 * Math.PI;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference;
    }

    // Initialize spinner ring
    if (spinnerRing) {
        const sRadius = spinnerRing.r.baseVal.value;
        spinnerCirc = sRadius * 2 * Math.PI;
        const seg = Math.max(80, Math.min(220, Math.round(spinnerCirc * 0.25)));
        spinnerRing.style.setProperty('stroke-dasharray', `${seg} ${spinnerCirc - seg}`);
        spinnerRing.style.setProperty('stroke-dashoffset', '0');
    }

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
 * Set progress ring percentage
 * @param {number} percent - Progress percentage (0-100)
 */
function setProgress(percent) {
    if (!progressRing) return;

    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

/**
 * Start spinner animation
 */
function startSpinner() {
    if (!spinnerRing || spinnerRAF) return;

    spinnerOffset = 0;
    let last = performance.now();
    const speed = 400; // units per second

    const loop = (ts) => {
        const dt = ts - last;
        last = ts;
        spinnerOffset = (spinnerOffset + (dt / 1000) * speed) % spinnerCirc;
        spinnerRing.style.strokeDashoffset = -spinnerOffset;
        spinnerRAF = requestAnimationFrame(loop);
    };

    spinnerRAF = requestAnimationFrame(loop);
}

/**
 * Stop spinner animation
 */
function stopSpinner() {
    if (spinnerRAF) {
        cancelAnimationFrame(spinnerRAF);
        spinnerRAF = null;
    }
    if (spinnerRing) {
        spinnerRing.style.strokeDashoffset = 0;
    }
}

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
        playBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        playBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
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
        playBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        playBtn.classList.add('bg-green-500', 'hover:bg-green-600');
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

    // Update mode button styles
    document.querySelectorAll('[id^="btn-"]').forEach(btn => {
        btn.className = 'flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all text-gray-500 hover:text-green-600 dark:text-gray-400';
    });

    const activeBtn = document.getElementById(`btn-${mode}`);
    if (activeBtn) {
        activeBtn.className = 'flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all bg-white shadow-sm text-green-600 border border-green-100 dark:bg-gray-900 dark:text-green-400 dark:border dark:border-green-900';
    }

    // Update progress ring color
    if (progressRing) {
        progressRing.setAttribute('class', `progress-ring__circle ${MODES[mode].color}`);
    }

    resetTimer();
}

// Expose MODES globally for i18n module
window.MODES = MODES;
