// ============================================
// GARDEN MODULE
// Manages garden state, rendering, and rewards
// ============================================

// Garden assets configuration
const ASSETS = {
    tree: ['🌳', '🌴'],
    flower: ['🌻', '🌹', '🌷', '🌺', '🌸', '🌼', '🪷'],
    butterfly: ['🦋']
};

const FRUITS_GENERAL = ['🍎', '🍋', '🍊', '🍑', '🍐', '🍅', '🍒', '🍇', '🥭', '🍓'];
const FRUITS_PALM = ['🥥'];

// Garden state
let gardenState = [];

// DOM elements (initialized in initGarden)
let gardenGrid = null;
let skyLayer = null;
let plantCountEl = null;
let butterflyCountEl = null;

/**
 * Initialize garden module
 */
function initGarden() {
    // Get DOM elements
    gardenGrid = document.getElementById('garden-grid');
    skyLayer = document.getElementById('sky-layer');
    plantCountEl = document.getElementById('plant-count');
    butterflyCountEl = document.getElementById('butterfly-count');

    // Load garden state from localStorage
    loadGarden();

    // Render initial garden
    renderGarden();
}

/**
 * Load garden state from localStorage
 */
function loadGarden() {
    try {
        const saved = localStorage.getItem('pomodoroGarden');
        if (saved) {
            gardenState = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading garden:', e);
        gardenState = [];
    }
}

/**
 * Save garden state to localStorage
 */
function saveGarden() {
    try {
        localStorage.setItem('pomodoroGarden', JSON.stringify(gardenState));
    } catch (e) {
        console.error('Error saving garden:', e);
    }
}

/**
 * Get random item from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random item
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Add reward to garden
 * @param {string} type - Reward type (tree/flower/butterfly)
 */
function addRewardToGarden(type) {
    if (!ASSETS[type]) {
        console.error(`Unknown reward type: ${type}`);
        return;
    }

    const item = {
        type: type,
        emoji: getRandomItem(ASSETS[type]),
        id: Date.now() + Math.random(), // Ensure uniqueness
        delay: Math.random() * 1.2
    };

    gardenState.push(item);
    saveGarden();
    renderGarden();
}

/**
 * Clear entire garden
 */
function clearGarden() {
    if (confirm(t('clear_confirm'))) {
        gardenState = [];
        saveGarden();
        renderGarden();
    }
}

/**
 * Get current grid column count
 * @returns {number} Number of columns
 */
function getGridColumnCount() {
    if (!gardenGrid) return 4;

    const styles = window.getComputedStyle(gardenGrid);
    const cols = styles.gridTemplateColumns.split(' ').filter(Boolean).length;
    return Math.max(cols, 1);
}

/**
 * Create cell key for position tracking
 * @param {number} col - Column number
 * @param {number} row - Row number
 * @returns {string} Cell key
 */
function cellKey(col, row) {
    return `${col}-${row}`;
}

/**
 * Find free cell in ground grid
 * @param {number} cols - Number of columns
 * @param {Set} used - Set of used cell keys
 * @returns {{col: number, row: number}} Free cell position
 */
function findFreeCell(cols, used) {
    const usedRows = Array.from(used).map(k => parseInt(k.split('-')[1], 10));
    const maxRow = usedRows.length ? Math.max(...usedRows) : 0;

    // Try random positions first
    for (let attempt = 0; attempt < 200; attempt++) {
        const col = 1 + Math.floor(Math.random() * cols);
        const row = 1 + Math.floor(Math.random() * (maxRow + 3));
        const key = cellKey(col, row);
        if (!used.has(key)) return { col, row };
    }

    // Fallback to sequential search
    for (let row = 1; row < maxRow + 100; row++) {
        for (let col = 1; col <= cols; col++) {
            const key = cellKey(col, row);
            if (!used.has(key)) return { col, row };
        }
    }

    return { col: 1, row: maxRow + 1 };
}

/**
 * Ensure item has valid ground position
 * @param {Object} item - Garden item
 * @param {Set} used - Set of used cell keys
 * @param {number} cols - Number of columns
 */
function ensureGroundPosition(item, used, cols) {
    if (!item.col || !item.row) {
        const pos = findFreeCell(cols, used);
        item.col = pos.col;
        item.row = pos.row;
        saveGarden();
    }

    const k = cellKey(item.col, item.row);
    if (used.has(k)) {
        const pos = findFreeCell(cols, used);
        item.col = pos.col;
        item.row = pos.row;
        saveGarden();
    }

    used.add(cellKey(item.col, item.row));
}

/**
 * Get sky grid configuration
 * @returns {{cols: number, rows: number}} Sky grid config
 */
function skyGridConfig() {
    if (!skyLayer) return { cols: 6, rows: 4 };

    const rect = skyLayer.getBoundingClientRect();
    const cols = Math.max(Math.floor(rect.width / 80), 6);
    const rows = Math.max(Math.floor(rect.height / 80), 4);
    return { cols, rows };
}

/**
 * Find free cell in sky grid
 * @param {Set} used - Set of used cell keys
 * @param {{cols: number, rows: number}} cfg - Sky grid config
 * @returns {{col: number, row: number}} Free cell position
 */
function findFreeSkyCell(used, cfg) {
    for (let attempt = 0; attempt < 200; attempt++) {
        const col = 1 + Math.floor(Math.random() * cfg.cols);
        const row = 1 + Math.floor(Math.random() * cfg.rows);
        const key = cellKey(col, row);
        if (!used.has(key)) return { col, row };
    }
    return { col: 1, row: 1 };
}

/**
 * Convert sky cell to percentage position
 * @param {number} col - Column number
 * @param {number} row - Row number
 * @param {{cols: number, rows: number}} cfg - Sky grid config
 * @returns {{left: number, top: number}} Percentage position
 */
function skyCellToPercent(col, row, cfg) {
    const left = ((col - 0.5) / cfg.cols) * 100;
    const top = ((row - 0.5) / cfg.rows) * 100;
    return { left, top };
}

/**
 * Create tree element
 * @param {Object} item - Tree item data
 * @returns {HTMLElement} Tree element
 */
function createTreeElement(item) {
    const el = document.createElement('div');
    el.className = 'garden-item plant-item tree flex justify-center items-center h-20 w-20 bg-white/30 rounded-xl shadow-sm backdrop-blur-sm dark:bg-white/5 relative';

    const trunk = document.createElement('span');
    trunk.textContent = item.emoji || getRandomItem(ASSETS.tree);
    trunk.style.fontSize = '2rem';
    el.appendChild(trunk);

    const trunkEmoji = trunk.textContent;
    const isPalm = trunkEmoji === '🌴';

    // Validate fruits for tree type
    const invalidForType = () => {
        if (!item.fruits) return true;
        if (isPalm) return item.fruits.some(f => f !== '🥥');
        return item.fruits.some(f => f === '🥥');
    };

    // Generate fruits if needed
    if (!item.fruits || !item.fruitPositions ||
        item.fruits.length !== item.fruitPositions.length ||
        invalidForType()) {
        const count = 3 + Math.floor(Math.random() * 3);
        const pool = isPalm ? FRUITS_PALM : FRUITS_GENERAL;
        item.fruits = Array.from({ length: count }, () => getRandomItem(pool));
        item.fruitPositions = item.fruits.map(() => ({
            left: 15 + Math.random() * 70,
            top: 10 + Math.random() * 55
        }));
        saveGarden();
    }

    // Add fruits to tree
    item.fruits.forEach((fruit, i) => {
        const f = document.createElement('span');
        f.textContent = fruit;
        f.style.position = 'absolute';
        f.style.left = item.fruitPositions[i].left + '%';
        f.style.top = item.fruitPositions[i].top + '%';
        f.style.fontSize = '1rem';
        f.style.pointerEvents = 'none';
        el.appendChild(f);
    });

    // Add tree name if exists
    if (item.name) {
        const nameEl = document.createElement('div');
        nameEl.textContent = item.name;
        nameEl.className = 'absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/50 dark:bg-white/10 whitespace-nowrap';
        el.appendChild(nameEl);
    }

    // Click to name tree
    el.addEventListener('click', () => {
        const name = prompt(t('name_prompt'), item.name || '');
        if (name !== null) {
            item.name = name.trim();
            saveGarden();
            renderGarden();
        }
    });

    el.style.animationDelay = (item.delay || Math.random() * 0.8) + 's';
    return el;
}

/**
 * Create flower element
 * @param {Object} item - Flower item data
 * @returns {HTMLElement} Flower element
 */
function createFlowerElement(item) {
    const el = document.createElement('div');
    el.className = 'garden-item plant-item flex justify-center items-center h-16 w-16 bg-white/30 rounded-xl shadow-sm backdrop-blur-sm dark:bg-white/5';

    const s = document.createElement('span');
    s.textContent = item.emoji;
    s.style.fontSize = '1.5rem';
    el.appendChild(s);

    el.style.animationDelay = (item.delay || Math.random() * 0.8) + 's';
    return el;
}

/**
 * Render entire garden
 */
function renderGarden() {
    if (!gardenGrid || !skyLayer) return;

    // Clear existing content
    gardenGrid.innerHTML = '';
    skyLayer.innerHTML = '';

    const cols = getGridColumnCount();
    const used = new Set();

    let plants = 0;
    let butterflies = 0;

    const skyUsed = new Set();
    const cfg = skyGridConfig();

    // Count items
    gardenState.forEach(item => {
        if (item.type === 'butterfly') {
            butterflies++;
        } else {
            plants++;
        }
    });

    // Update counters
    if (plantCountEl) plantCountEl.textContent = plants;
    if (butterflyCountEl) butterflyCountEl.textContent = butterflies;

    // Render items
    gardenState.forEach(item => {
        if (item.type === 'butterfly') {
            // Render butterfly in sky
            if (item.left == null || item.top == null) {
                const cell = findFreeSkyCell(skyUsed, cfg);
                skyUsed.add(cellKey(cell.col, cell.row));
                const pct = skyCellToPercent(cell.col, cell.row, cfg);
                item.left = pct.left;
                item.top = pct.top;
                saveGarden();
            } else {
                const col = Math.max(1, Math.min(cfg.cols, Math.round((item.left / 100) * cfg.cols)));
                const row = Math.max(1, Math.min(cfg.rows, Math.round((item.top / 100) * cfg.rows)));
                skyUsed.add(cellKey(col, row));
            }

            const el = document.createElement('div');
            el.className = 'butterfly';
            el.textContent = item.emoji;
            el.style.left = item.left + '%';
            el.style.top = item.top + '%';
            el.style.animationDelay = (item.delay || 0) + 's';
            skyLayer.appendChild(el);
        } else {
            // Render plant on ground
            ensureGroundPosition(item, used, cols);

            let el;
            if (item.type === 'tree') {
                el = createTreeElement(item);
            } else {
                el = createFlowerElement(item);
            }

            el.style.gridColumnStart = item.col;
            el.style.gridRowStart = item.row;
            gardenGrid.appendChild(el);
        }
    });

    // Auto-scroll to bottom if there are plants
    if (plants > 0) {
        setTimeout(() => {
            gardenGrid.scrollTop = gardenGrid.scrollHeight;
        }, 100);
    }
}
