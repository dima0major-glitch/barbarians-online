// global_core.js — Единое ядро интерфейса, стилей, времени и логики для всех страниц WAP-игры

const MAX_BATTLES = 3;
const REGEN_TIME = 5 * 60 * 1000; // 5 минут в миллисекундах

// Автоматическая генерация HTML и CSS-стилей шапки на любой странице
function renderGlobalHeader() {
    if (document.getElementById('global-game-header-container')) return;

    // Внедряем CSS-стили шапки прямо в документ
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        .game-banner { background: linear-gradient(to bottom, #112d3e, #091a26); border-bottom: 2px solid #1c8cd1; padding: 8px; text-align: center; font-size: 16px; font-weight: bold; color: #ffffff; text-shadow: 1px 1px 3px #000; }
        .game-header { background: linear-gradient(to bottom, #091a26, #051017); border-bottom: 2px solid #142a3a; padding: 8px 5px; font-size: 12px; color: #b0cbdc; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .header-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; line-height: 1.4; }
        .header-item { display: flex; align-items: center; gap: 2px; }
        .nickname { font-weight: bold; color: #e2f2ff; cursor: pointer; }
        .lvl { color: #ff9900; font-weight: bold; cursor: pointer; }
        .hp { color: #ff4d4d; }
        .armor { color: #a0b0b8; }
        .silver { color: #e5e5e5; }
        .gold { color: #ffcc00; font-weight: bold; }
        .gems { color: #00ccff; }
        .battles-btn { cursor: pointer; text-decoration: underline; font-weight: bold; color: #ffffff; }
        .battles-btn-disabled { color: #ff4d4d; text-decoration: underline; font-weight: bold; cursor: pointer; }
    `;
    document.head.appendChild(styleTag);

    const headerContainer = document.createElement('div');
    headerContainer.id = 'global-game-header-container';
    
    // Переписанная разметка: теперь ⏳ и 🕒 ведут строго на ПОСЕЛОК (poselok.html)
    headerContainer.innerHTML = `
        <div class="game-banner">🛡️ Варвары ⚔️</div>
        <div class="game-header">
            <div class="header-row">
                <div class="header-item" style="cursor: pointer;" onclick="alert('Почта в разработке!')">✉️</div>
                <div class="header-item nickname" onclick="window.location.href='profile.html'">🪓 <span id="header-player-name">...</span></div>
                <div class="header-item lvl" onclick="window.location.href='hero.html'"><span id="header-lvl">👑 1</span></div>
                <div class="header-item hp">❤️ <span id="header-hp">250</span></div>
                <div class="header-item armor">🛡️ <span id="header-def">5</span></div>
                <div class="header-item silver"><span id="header-silver">🪙 0</span></div>
                <div class="header-item gems">💎 <span id="header-gems">0</span></div>
                <div class="header-item gold"><span id="header-gold">💰 0</span></div>
                <div class="header-item" id="header-battles-zone" onclick="window.location.href='duel.html'">
                    ⚔️ <span id="header-battles">3/3</span>
                </div>
                <div class="header-item" onclick="window.location.href='poselok.html'" style="cursor: pointer; text-decoration: underline;">⏳ <span id="header-timer">00:00</span></div>
                <div class="header-item" onclick="window.location.href='poselok.html'" style="cursor: pointer; text-decoration: underline;">🕒 <span id="header-clock">00:00:00</span></div>
            </div>
        </div>
    `;

    document.body.insertBefore(headerContainer, document.body.firstChild);
}

function updateGlobalGameCore() {
    const savedName = localStorage.getItem('barbarians_username');
    if (!savedName && !window.location.href.includes('start.html')) { 
        window.location.href = "start.html"; 
        return; 
    }

    let count = localStorage.getItem('barb_battle_count') !== null ? parseInt(localStorage.getItem('barb_battle_count')) : MAX_BATTLES;
    let lastRegen = parseInt(localStorage.getItem('barb_last_regen') || '0');
    let now = Date.now();

    if (lastRegen === 0) {
        lastRegen = now;
        localStorage.setItem('barb_last_regen', lastRegen);
    }

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

    let timerStr = "00:00";
    if (count < MAX_BATTLES) {
        let msLeft = REGEN_TIME - (now - lastRegen);
        if (msLeft < 0) msLeft = 0;
        let totalSecs = Math.floor(msLeft / 1000);
        let mins = Math.floor(totalSecs / 60);
        let secs = totalSecs % 60;
        timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

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
    const elBattlesZone = document.getElementById('header-battles-zone');

    if (elName) elName.innerText = savedName || "Воин";
    if (elLvl) elLvl.innerHTML = `👑 ${localStorage.getItem('barb_lvl') || '1'}`;
    
    if (elHp) {
        let vit = parseInt(localStorage.getItem('barb_vit') || '5');
        elHp.innerText = 250 + (vit * 20);
    }
    if (elDef) elDef.innerText = localStorage.getItem('barb_def') || '5';
    if (elSilver) elSilver.innerText = `🪙 ${localStorage.getItem('barb_silver') || '10000'}`;
    if (elGold) elGold.innerText = `💰 ${localStorage.getItem('barb_gold') || '15'}`;
    if (elGems) elGems.innerText = localStorage.getItem('barb_gems') || '0';
    
    if (elBattles) elBattles.innerText = `${count}/3`;
    if (elTimer) elTimer.innerText = timerStr;

    if (elBattlesZone) {
        if (count <= 0) {
            elBattlesZone.className = "header-item battles-btn-disabled";
        } else {
            elBattlesZone.className = "header-item battles-btn";
        }
    }

    if (elClock) {
        let d = new Date();
        elClock.innerText = d.toTimeString().split(' ')[0];
    }

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

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('barb_battle_count') === null) {
        localStorage.setItem('barb_battle_count', MAX_BATTLES);
        localStorage.setItem('barb_last_regen', Date.now());
    }
    renderGlobalHeader();
    updateGlobalGameCore();
    setInterval(updateGlobalGameCore, 1000);
});
/* ==========================================================================
   СКВОЗНАЯ АВТОГЕНЕРАЦИЯ ГЛОБАЛЬНОГО МЕНЮ НАВИГАЦИИ (НОРМАННЫ-СТИЛЬ)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Внедряем каноничные стили для нижнего меню
    if (!document.getElementById("wap-global-footer-styles")) {
        const styleElement = document.createElement("style");
        styleElement.id = "wap-global-footer-styles";
        styleElement.innerHTML = `
            .wap-footer-nav { background: #243342; border: 1px solid #2c3e50; padding: 5px; margin-top: 10px; font-size: 11px; font-family: monospace; text-align: center; box-shadow: inset 0 1px 3px rgba(0,0,0,0.4); }
            .wap-footer-nav a { color: #00d2ff; text-decoration: none; padding: 2px 5px; display: inline-block; }
            .wap-footer-nav a:hover { color: #ffffff; background-color: #2c3e50; }
            .wap-footer-divider { color: #34495e; padding: 0 2px; }
            .wap-copyright { font-size: 9px; color: #7f8c8d; text-align: center; margin-top: 5px; padding-bottom: 10px; }
        `;
        document.head.appendChild(styleElement);
    }

    // 2. Автоматически рендерим меню навигации во все блоки <div id="core-footer"></div>
    const footerContainer = document.getElementById("core-footer");
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="wap-footer-nav">
                <a href="index.html">Главная</a><span class="wap-footer-divider">|</span>
                <a href="hero.html">Герой</a><span class="wap-footer-divider">|</span>
                <a href="poselok.html" style="font-weight: bold; color: #f1c40f;">Поселок</a><span class="wap-footer-divider">|</span>
                <a href="campaign.html">Походы</a><span class="wap-footer-divider">|</span>
                <a href="events.html" style="color: #2ecc71;">События</a><span class="wap-footer-divider">|</span>
                <a href="clan.html">Клан</a>
            </div>
            <div class="wap-copyright">Barbarians WAP-RPG © 2026</div>
        `;
    }
});

/* ==========================================================================
   ГЛОБАЛЬНАЯ СИСТЕМА ЛОГИРОВАНИЯ СОБЫТИЙ (addGameEvent)
   ========================================================================== */
window.addGameEvent = function(type, category, text, hasDetails = false) {
    let events = JSON.parse(localStorage.getItem('game_events')) || [];
    
    // Форматируем славянскую / скандинавскую дату логов
    const now = new Date();
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const timeStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    const newEvent = {
        type: type,            // Типы: 'arena', 'mine', 'gift', 'boss'
        category: category,    // Название вкладки-источника
        text: text,            // HTML-текст лога с подсветкой
        time: timeStr,         // Время
        hasDetails: hasDetails // Показ кнопки подробностей
    };

    events.push(newEvent);
    
    // Жесткий WAP-лимит на 30 записей, чтобы не засорять память LocalStorage
    if (events.length > 30) {
        events.shift(); 
    }

    localStorage.setItem('game_events', JSON.stringify(events));
};
