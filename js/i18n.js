// ============================================
// INTERNATIONALIZATION MODULE
// Handles multi-language support (ES/PT/EN)
// ============================================

const I18N = {
    es: {
        title: '🍅 Jardín Pomodoro',
        subtitle: 'Concéntrate y cultiva tu bosque',
        mode_focus: 'Enfoque',
        mode_short: 'Descanso Corto',
        mode_long: 'Descanso Largo',
        status_ready: 'Listo para cultivar',
        status_growing: 'Creciendo...',
        status_paused: 'En pausa',
        btn_start: 'Comenzar',
        btn_pause: 'Pausar',
        btn_resume: 'Continuar',
        legend_title: 'Tu Recompensa:',
        legend_tree: '25 min = Árbol Frutal',
        legend_flower: '5 min = Flor',
        legend_butterfly: '15 min = Mariposa (Vuela)',
        garden_title: 'Tu Jardín',
        reset_btn: 'Reiniciar Jardín (Borrar todo)',
        clear_confirm: '¿Estás seguro de que quieres talar todo tu bosque? Esta acción no se puede deshacer.',
        mode_change_confirm: 'El temporizador está corriendo. ¿Quieres detenerlo y cambiar de modo?',
        alert_tree: '¡Tiempo completado! Has cultivado: Un Árbol',
        alert_flower: '¡Tiempo completado! Has cultivado: Una Flor',
        alert_butterfly: '¡Tiempo completado! Has cultivado: Una Mariposa',
        doc_label_focus: 'Enfoque',
        doc_label_short: 'Descanso Corto',
        doc_label_long: 'Descanso Largo',
        plants_label: 'Plantas',
        butterflies_label: 'Mariposas',
        toggle_to_dark: '🌚 Oscuro',
        toggle_to_light: '🌞 Claro',
        name_prompt: 'Nombre del árbol:'
    },
    pt: {
        title: '🍅 Jardim Pomodoro',
        subtitle: 'Concentre-se e cultive sua floresta',
        mode_focus: 'Foco',
        mode_short: 'Pausa Curta',
        mode_long: 'Pausa Longa',
        status_ready: 'Pronto para cultivar',
        status_growing: 'Crescendo...',
        status_paused: 'Pausado',
        btn_start: 'Começar',
        btn_pause: 'Pausar',
        btn_resume: 'Continuar',
        legend_title: 'Sua Recompensa:',
        legend_tree: '25 min = Árvore Frutífera',
        legend_flower: '5 min = Flor',
        legend_butterfly: '15 min = Borboleta (Voa)',
        garden_title: 'Seu Jardim',
        reset_btn: 'Reiniciar Jardim (Apagar tudo)',
        clear_confirm: 'Tem certeza que deseja derrubar todo o bosque? Esta ação não pode ser desfeita.',
        mode_change_confirm: 'O temporizador está em execução. Deseja parar e trocar o modo?',
        alert_tree: 'Tempo concluído! Você cultivou: Uma Árvore',
        alert_flower: 'Tempo concluído! Você cultivou: Uma Flor',
        alert_butterfly: 'Tempo concluído! Você cultivou: Uma Borboleta',
        doc_label_focus: 'Foco',
        doc_label_short: 'Pausa Curta',
        doc_label_long: 'Pausa Longa',
        plants_label: 'Plantas',
        butterflies_label: 'Borboletas',
        toggle_to_dark: '🌚 Escuro',
        toggle_to_light: '🌞 Claro',
        name_prompt: 'Nome da árvore:'
    },
    en: {
        title: '🍅 Pomodoro Garden',
        subtitle: 'Focus and grow your forest',
        mode_focus: 'Focus',
        mode_short: 'Short Break',
        mode_long: 'Long Break',
        status_ready: 'Ready to grow',
        status_growing: 'Growing...',
        status_paused: 'Paused',
        btn_start: 'Start',
        btn_pause: 'Pause',
        btn_resume: 'Resume',
        legend_title: 'Your Reward:',
        legend_tree: '25 min = Fruit Tree',
        legend_flower: '5 min = Flower',
        legend_butterfly: '15 min = Butterfly (Flies)',
        garden_title: 'Your Garden',
        reset_btn: 'Reset Garden (Erase all)',
        clear_confirm: 'Are you sure you want to clear the forest? This action cannot be undone.',
        mode_change_confirm: 'The timer is running. Do you want to stop and change mode?',
        alert_tree: 'Time complete! You cultivated: A Tree',
        alert_flower: 'Time complete! You cultivated: A Flower',
        alert_butterfly: 'Time complete! You cultivated: A Butterfly',
        doc_label_focus: 'Focus',
        doc_label_short: 'Short Break',
        doc_label_long: 'Long Break',
        plants_label: 'Plants',
        butterflies_label: 'Butterflies',
        toggle_to_dark: '🌚 Dark',
        toggle_to_light: '🌞 Light',
        name_prompt: 'Tree name:'
    }
};

// Current language (default to Spanish)
let currentLang = 'es';

/**
 * Initialize language from localStorage
 */
function initLanguage() {
    try {
        const saved = localStorage.getItem('pomodoroLang');
        if (saved && I18N[saved]) {
            currentLang = saved;
        }
    } catch (e) {
        console.warn('Could not load language preference:', e);
    }
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string} Translated text
 */
function t(key) {
    const dict = I18N[currentLang] || I18N.es;
    return dict[key] || key;
}

/**
 * Set language and update UI
 * @param {string} lang - Language code (es/pt/en)
 */
function setLang(lang) {
    if (!I18N[lang]) {
        console.warn(`Language ${lang} not supported`);
        return;
    }

    currentLang = lang;

    try {
        localStorage.setItem('pomodoroLang', lang);
    } catch (e) {
        console.warn('Could not save language preference:', e);
    }

    applyLanguage();
}

/**
 * Update all UI text with current language
 */
function applyLanguage() {
    // Update title and subtitle
    const titleEl = document.getElementById('app-title');
    const subtitleEl = document.getElementById('app-subtitle');
    if (titleEl) titleEl.textContent = t('title');
    if (subtitleEl) subtitleEl.textContent = t('subtitle');

    // Update mode buttons
    const btnFocus = document.getElementById('btn-focus');
    const btnShort = document.getElementById('btn-short');
    const btnLong = document.getElementById('btn-long');
    if (btnFocus) btnFocus.textContent = t('mode_focus');
    if (btnShort) btnShort.textContent = t('mode_short');
    if (btnLong) btnLong.textContent = t('mode_long');

    // Update legend
    const legendTitleEl = document.getElementById('legend-title');
    const legendTreeEl = document.getElementById('legend-tree');
    const legendFlowerEl = document.getElementById('legend-flower');
    const legendButterflyEl = document.getElementById('legend-butterfly');

    if (legendTitleEl) legendTitleEl.textContent = t('legend_title');
    if (legendTreeEl) legendTreeEl.innerHTML = '<span class="text-xl">🍎/🍋</span> ' + t('legend_tree');
    if (legendFlowerEl) legendFlowerEl.innerHTML = '<span class="text-xl">🌻/🌹</span> ' + t('legend_flower');
    if (legendButterflyEl) legendButterflyEl.innerHTML = '<span class="text-xl">🦋</span> ' + t('legend_butterfly');

    // Update garden section
    const gardenTitleEl = document.getElementById('garden-title');
    const plantLabelEl = document.getElementById('plant-label');
    const butterflyLabelEl = document.getElementById('butterfly-label');
    const resetBtnEl = document.getElementById('reset-btn');

    if (gardenTitleEl) gardenTitleEl.textContent = t('garden_title');
    if (plantLabelEl) plantLabelEl.textContent = t('plants_label');
    if (butterflyLabelEl) butterflyLabelEl.textContent = t('butterflies_label');
    if (resetBtnEl) resetBtnEl.textContent = t('reset_btn');

    // Update status and button text based on timer state
    updateTimerLanguage();

    // Update theme button
    updateThemeButtonLabel();

    // Update language button active state
    updateLangButtons();
}

/**
 * Update timer-related text based on current state
 */
function updateTimerLanguage() {
    if (typeof window.timerState === 'undefined') return;

    const statusText = document.getElementById('status-text');
    const textPlay = document.getElementById('text-play');

    const totalTime = window.MODES[window.timerState.currentMode].time;
    const paused = !window.timerState.isRunning &&
        window.timerState.timeLeft > 0 &&
        window.timerState.timeLeft < totalTime;

    if (statusText) {
        statusText.textContent = window.timerState.isRunning
            ? t('status_growing')
            : paused
                ? t('status_paused')
                : t('status_ready');
    }

    if (textPlay) {
        textPlay.textContent = window.timerState.isRunning
            ? t('btn_pause')
            : paused
                ? t('btn_resume')
                : t('btn_start');
    }
}

/**
 * Update language button active states
 */
function updateLangButtons() {
    const buttons = {
        es: document.getElementById('lang-es'),
        pt: document.getElementById('lang-pt'),
        en: document.getElementById('lang-en')
    };

    Object.entries(buttons).forEach(([lang, btn]) => {
        if (btn) {
            if (lang === currentLang) {
                btn.classList.add('ring-2', 'ring-green-500', 'ring-offset-1');
            } else {
                btn.classList.remove('ring-2', 'ring-green-500', 'ring-offset-1');
            }
        }
    });
}

/**
 * Update theme button label
 */
function updateThemeButtonLabel() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const isDark = document.documentElement.classList.contains('dark');
    themeToggleBtn.textContent = isDark ? t('toggle_to_light') : t('toggle_to_dark');
}
