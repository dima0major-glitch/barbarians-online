// global_core.js — Единое ядро интерфейса, времени и логики для всех страниц WAP-игры

const MAX_BATTLES = 3;
const REGEN_TIME = 5 * 60 * 1000; // 5 минут в миллисекундах

// Функция, которая генерирует HTML-код шапки. 
// ЕСЛИ ВАМ НУЖНО ДОБАВИТЬ ИЛИ ИЗМЕНИТЬ КНОПКУ — ПРОСТО ОТРЕДАКТИРУЙТЕ СТРОКИ НИЖЕ!
function renderGlobalHeader() {
    // Проверяем, нет ли уже шапки на странице, чтобы не дублировать
    if (document.getElementById('global-game-header-container')) return;

    const headerContainer = document.createElement('div');
    headerContainer.id = 'global-game-header-container';
    
    // Сюда пишем весь HTML шапки. Можете добавлять любые новые кнопки или элементы.
    headerContainer.innerHTML = `
        <div class="game-banner">🛡️ Варвары ⚔️</div>
        <div class="game-header">
            <div class="header-row">
                <!-- Кнопка Почты -->
                <div class="header-item" style="cursor: pointer;" onclick="alert('Почта в разработке!')">✉️</div>
                
                <!-- Кнопка Ника (ведет в профиль) -->
                <div class="header-item nickname" onclick="window.location.href='profile.html'">🪓 <span id="header-player-name">...</span></div>
                
                <!-- Кнопка Уровня (ведет к герою) -->
                <div class="header-item lvl" onclick="window.location.href='hero.html'"><span id="header-lvl">👑 1</span></div>
                
                <!-- Индикаторы характеристик -->
                <div class="header-item hp">❤️ <span id="header-hp">250</span></div>
                <div class="header-item armor">🛡️ <span id="header-def">5</span></div>
                
                <!-- Валюта -->
                <div class="header-item silver"><span id="header-silver">🪙 0</span></div>
                <div class="header-item gems"><span id="header-gems">💎 0</span></div>
                <div class="header-item gold"><span id="header-gold">💰 0</span></div>
                
                <!-- Кнопка Боев (Переход на Арену по клику на иконку или цифры) -->
                <div class="header-item" onclick="window.location.href='duel.html'" style="cursor: pointer; text-decoration: underline; font-weight: bold;">
                    ⚔️ <span id="header-battles">3/3</span>
                </div>
                
                <!-- Таймер восстановления -->
                <div class="header-item">⏳ <span id="header-timer">00:00</span></div>
                
                <!-- Живые WAP-часы -->
                <div class="header-item">🕒 <span id="header-clock">00:00:00</span></div>
            </div>
        </div>
    `;

    // Автоматически вставляем шапку в самый верх тега <body> на текущей странице
    document.body.insertBefore(headerContainer, document.body.firstChild);
}

function updateGlobalGameCore() {
    // 1. Проверка авторизации (кроме стартового экрана)
    const savedName = localStorage.getItem('barbarians_username');
    if (!savedName && !window.location.href.includes('start.html')) { 
        window.location.href = "start.html"; 
        return; 
    }

    // 2. Инициализация переменных времени и боев
    let count = localStorage.getItem('barb_battle_count') !== null ? parseInt(localStorage.getItem('barb_battle_count')) : MAX_BATTLES;
    let lastRegen = parseInt(localStorage.getItem('barb_last_regen') || '0');
    let now = Date.now();

    if (lastRegen === 0) {
        lastRegen = now;
        localStorage.setItem('barb_last_regen', lastRegen);
    }

    // 3. Логика восстановления боев по времени
    if (count < MAX_BATTLES) {
        let passed = now - lastRegen;
        if (passed >= REGEN_TIME) {
            let restored = Math.floor(passed / REGEN_TIME);
            count = Math.min(MAX_BATTLES, count + restored);
            let remainder = passed % REGEN_TIME;
            
            localStorage.setItem('barb_battle_count', count);
            lastRegen = now - remainder;
            localStorage.setItem('barb_last_regen', lastRegen);
        }
    } else {
        lastRegen = now;
        localStorage.setItem('barb_last_regen', lastRegen);
    }

    // 4. Расчет тикающего таймера обратного отсчета
    let timerStr = "00:00";
    if (count < MAX_BATTLES) {
        let msLeft = REGEN_TIME - (now - lastRegen);
        if (msLeft < 0) msLeft = 0;
        let totalSecs = Math.floor(msLeft / 1000);
        let mins = Math.floor(totalSecs / 60);
        let secs = totalSecs % 60;
        timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 5. Заполнение сгенерированных элементов данными из Local Storage
    const elName = document.getElementById('header-player-name');
    const elLvl = document.getElementById('header-lvl');
    const elHp = document.getElementById('header-hp');
    const elDef = document.getElementById('header-def');
    const elSilver = document.getElementById('header-silver');
    const elGold = document.getElementById('header-gold');
    const elGems = document.getElementById('header-gems');
    const elBattles = document.getElementById('header-battles');
    const elTimer = document.getElementById('header-timer');
    const elClock = document.getElementById('header-clock');

    if (elName) elName.innerText = savedName || "Воин";
    if (elLvl) elLvl.innerHTML = `👑 ${localStorage.getItem('barb_lvl') || '1'}`;
    
    if (elHp) {
        let vit = parseInt(localStorage.getItem('barb_vit') || '5');
        elHp.innerText = 250 + (vit * 20);
    }
    if (elDef) elDef.innerText = localStorage.getItem('barb_def') || '5';
    if (elSilver) elSilver.innerText = `🪙 ${localStorage.getItem('barb_silver') || '10000'}`;
    if (elGold) elGold.innerText = `💰 ${localStorage.getItem('barb_gold') || '15'}`;
    if (elGems) elGems.innerText = `💎 ${localStorage.getItem('barb_gems') || '0'}`;
    
    if (elBattles) elBattles.innerText = `${count}/3`;
    if (elTimer) elTimer.innerText = timerStr;

    // Живые часы
    if (elClock) {
        let d = new Date();
        elClock.innerText = d.toTimeString().split(' ')[0];
    }

    // 6. Специфическая логика блокировки кнопок для страницы Арены (duel.html)
    const fightButtons = document.querySelectorAll('.fight-btn');
    const alertMsg = document.getElementById('no-battles-msg');
    if (fightButtons.length > 0) {
        if (count <= 0) {
            if (alertMsg) alertMsg.style.display = "block";
            fightButtons.forEach(btn => btn.classList.add('disabled-fight'));
        } else {
            if (alertMsg) alertMsg.style.display = "none";
            fightButtons.forEach(btn => btn.classList.remove('disabled-fight'));
        }
    }
}

// Инициализация при загрузке любой страницы
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('barb_battle_count') === null) {
        localStorage.setItem('barb_battle_count', MAX_BATTLES);
        localStorage.setItem('barb_last_regen', Date.now());
    }
    
    // Сначала генерируем шапку из шаблона
    renderGlobalHeader();
    // Затем сразу наполняем её актуальными цифрами
    updateGlobalGameCore();
    
    // Запускаем ежесекундный цикл обновлений
    setInterval(updateGlobalGameCore, 1000);
});
