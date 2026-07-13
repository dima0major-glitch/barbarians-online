/* ==========================================
   КЛАНОВАЯ СИСТЕМА ПО СТИЛЮ «НОРМАННОВ» — ЧАСТЬ 1
   ========================================== */
const CLAN_PRICE = 1000;
const SLOTS_LIMIT = 15;
const LVL_UP_COST = 5000;

let hero = JSON.parse(localStorage.getItem('hero_stats')) || { name: "Воин", level: 1, silver: 0, clan: null };
let clans = JSON.parse(localStorage.getItem('game_clans')) || {};

function showClanView() {
    const box = document.getElementById('clan-main-box');
    if (!box) return;

    if (!hero.clan || !clans[hero.clan]) {
        hero.clan = null;
        renderCreateForm(box);
    } else {
        renderMainMenu(box, hero.clan);
    }
}

/* Форма создания, если персонаж без клана */
function renderCreateForm(box) {
    box.innerHTML = `
        <div style="padding: 10px; color: #aaa; font-size: 12px; font-family: sans-serif; text-align: center;">
            Вы не состоите в клане.<br>Создание союза стоит <span style="color:#ffaa00;">${CLAN_PRICE} серебра</span>.
        </div>
        <div style="padding: 10px; text-align: center;">
            <input type="text" id="new-clan-title" maxlength="12" placeholder="Название клана" style="background:#0b141d; color:#fff; border:1px solid #1c354d; padding:5px; width:80%; font-size:13px;"><br><br>
            <button onclick="actionCreateClan()" style="background:#112233; color:#00ffcc; border:1px solid #1c354d; padding:6px 15px; font-size:13px; cursor:pointer;">Основать клан</button>
        </div>
    `;
}

/* Генерация списка меню в точности со скриншота */
function renderMainMenu(box, clanName) {
    const currentClan = clans[clanName];
    document.getElementById('clan-welcome-tag').innerText = `Добро пожаловать в ${currentClan.name}`;

    box.innerHTML = `
        <div class="clan-menu-item" onclick="openSubSection('info')">
            <span>📊 Информация</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('donate')">
            <span>💎 Пожертвовать</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('upgrades')">
            <span>⬆️ Улучшения</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('war')">
            <span>💀 Война</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('members')">
            <span>🪓 Воины (${currentClan.members.length}/${SLOTS_LIMIT})</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('chat')">
            <span>💬 Чат</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('appeal')">
            <span>🪶 Обращения</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('events')">
            <span>⭐ События клана</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('leaders')">
            <span>» Воеводы</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('mail')">
            <span>🦅 Рассылка</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('requests')">
            <span>🪓 Заявки (0)</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="openSubSection('edit')">
            <span>⚙️ Редактирование</span><span class="clan-btn-arrow">»</span>
        </div>
        <div class="clan-menu-item" onclick="actionDisband()" style="border-bottom:1px solid #551111;">
            <span style="color:#ff5555;">❌ Распустить клан</span><span class="clan-btn-arrow">»</span>
        </div>
    `;
}

/* Обработчик отрисовки вкладок */
window.openSubSection = function(type) {
    const box = document.getElementById('clan-main-box');
    const currentClan = clans[hero.clan];
    let backBtn = `<div onclick="showClanView()" style="background:#0d1a26; padding:8px; text-align:center; color:#00ffcc; font-size:12px; cursor:pointer; margin-top:10px; border:1px solid #1c354d;">↩️ Назад в меню клана</div>`;

    if (type === 'info') {
        box.innerHTML = `
            <div class="clan-section-title">📊 ИНФОРМАЦИЯ О КЛАНЕ</div>
            <div style="padding:10px; font-size:12px; color:#c4d6e2; line-height:1.5;">
                <b>Название:</b> ${currentClan.name}<br>
                <b>Глава клана:</b> ${currentClan.leader}<br>
                <b>Казна клана:</b> <span style="color:#ffd700;">${currentClan.treasury} серебра</span><br>
                <b>Сила Тотема:</b> Уровень ${currentClan.totemLevel} (+${currentClan.totemLevel * 2} к статам)
            </div>
            ${backBtn}
        `;
    } 
    else if (type === 'donate') {
        box.innerHTML = `
            <div class="clan-section-title">💎 ПОЖЕРТВОВАТЬ В КАЗНУ</div>
            <div style="padding:10px; font-size:12px; color:#c4d6e2;">
                Ваше серебро: <span style="color:#ffd700;">${hero.silver}</span><br><br>
                Сумма пожертвования:<br>
                <input type="number" id="cl-gold-in" min="1" max="${hero.silver}" style="background:#0b141d; color:#fff; border:1px solid #1c354d; padding:4px; width:100px; margin-top:5px;"><br><br>
                <button onclick="actionDonate()" style="background:#112233; color:#00ffcc; border:1px solid #1c354d; padding:4px 10px; cursor:pointer;">Внести серебро</button>
            </div>
            ${backBtn}
        `;
    }
    else if (type === 'upgrades') {
        let cost = (currentClan.totemLevel + 1) * LVL_UP_COST;
        box.innerHTML = `
            <div class="clan-section-title">⬆️ УЛУЧШЕНИЯ ТОТЕМА</div>
            <div style="padding:10px; font-size:12px; color:#c4d6e2;">
                Текущий уровень тотема: <b>${currentClan.totemLevel}</b><br>
                Эффект: <span style="color:#ffaa00;">+${currentClan.totemLevel * 2} Силы и Защиты</span> всем воинам.<br><br>
                Цена следующего улучшения: <b>${cost} серебра</b> (из казны)<br>
                Текущая казна: <span style="color:#ffd700;">${currentClan.treasury}</span><br><br>
                <button onclick="actionUpgradeTotem()" style="background:#112233; color:#00ffcc; border:1px solid #1c354d; padding:5px 12px; cursor:pointer;">Прокачать тотем</button>
            </div>
            ${backBtn}
        `;
    }
    else if (type === 'members') {
        box.innerHTML = `
            <div class="clan-section-title">🪓 ДРУЖИНА КЛАНА (${currentClan.members.length}/${SLOTS_LIMIT})</div>
            <div style="padding:5px;">
                ${currentClan.members.map((m, i) => `
                    <div style="padding:6px; background:#0d1a26; border-bottom:1px solid #1c354d; font-size:12px; color:#fff;">
                        ${i + 1}. <b>${m}</b> ${m === currentClan.leader ? '<span style="color:#ffd700;">[Вождь]</span>' : ''}
                    </div>
                `).join('')}
            </div>
            <div style="padding:10px; text-align:center; border-top:1px dashed #1c354d; margin-top:10px;">
                <button onclick="actionSimulateBot()" style="background:#0b141d; color:#aaa; border:1px solid #222; padding:3px 6px; font-size:11px; cursor:pointer;">🤖 Нанять бота для теста лимита (макс 15)</button>
            </div>
            ${backBtn}
        `;
    }
    else {
        box.innerHTML = `
            <div class="clan-section-title">🔒 РАЗДЕЛ В РАЗРАБОТКЕ</div>
            <div style="padding:20px; font-size:12px; color:#aaa; text-align:center;">
                Этот функционал будет добавлен в будущих походах.
            </div>
            ${backBtn}
        `;
    }
};

/* Сразу запускаем инициализацию */
showClanView();
/* ==========================================
   КЛАНОВАЯ СИСТЕМА ПО СТИЛЮ «НОРМАННОВ» — ЧАСТЬ 2
   ========================================== */

/* Действие: Основать новый союз */
window.actionCreateClan = function() {
    const input = document.getElementById('new-clan-title');
    if (!input) return;
    const name = input.value.trim();

    if (!name) return alert("Укажите имя союза!");
    if (hero.silver < CLAN_PRICE) return alert("Не хватает серебра!");
    if (clans[name]) return alert("Имя союза уже занято!");

    hero.silver -= CLAN_PRICE;
    hero.clan = name;
    clans[name] = { name: name, leader: hero.name, totemLevel: 0, treasury: 0, members: [hero.name] };

    saveAll();
};

/* Действие: Внести серебро в общий банк */
window.actionDonate = function() {
    const input = document.getElementById('cl-gold-in');
    const value = parseInt(input ? input.value : 0);

    if (isNaN(value) || value <= 0) return alert("Укажите верное число!");
    if (hero.silver < value) return alert("У вас нет столько серебра!");

    hero.silver -= value;
    clans[hero.clan].treasury += value;

    saveAll();
    openSubSection('donate');
};

/* Действие: Прокачка тотема за клановое серебро */
window.actionUpgradeTotem = function() {
    const clan = clans[hero.clan];
    const cost = (clan.totemLevel + 1) * LVL_UP_COST;

    if (clan.treasury < cost) return alert("В казне недостаточно средств!");

    clan.treasury -= cost;
    clan.totemLevel += 1;

    saveAll();
    openSubSection('upgrades');
};

/* Действие: Симуляция добавления ботов с проверкой лимита на 15 человек */
window.actionSimulateBot = function() {
    const clan = clans[hero.clan];
    if (clan.members.length >= SLOTS_LIMIT) return alert("Дружина переполнена! Лимит 15 воинов!");

    const names = ["Хакон", "Гуннар", "Тор", "Локи", "Эгиль", "Кнут", "Ульф"];
    clan.members.push(names[Math.floor(Math.random() * names.length)] + "_" + Math.floor(Math.random() * 800 + 100));

    saveAll();
    openSubSection('members');
};

/* Действие: Удаление клана лидером */
window.actionDisband = function() {
    if (!confirm("Уничтожить клан? Прогресс аннулируется.")) return;
    delete clans[hero.clan];
    hero.clan = null;
    saveAll();
};

/* Метод синхронизации и авто-расчета баффов для Арены */
function saveAll() {
    localStorage.setItem('hero_stats', JSON.stringify(hero));
    localStorage.setItem('game_clans', JSON.stringify(clans));
    
    if (hero.clan && clans[hero.clan]) {
        let b = clans[hero.clan].totemLevel * 2;
        localStorage.setItem('clan_bonus_stats', JSON.stringify({ strength: b, defense: b }));
    } else {
        localStorage.setItem('clan_bonus_stats', JSON.stringify({ strength: 0, defense: 0 }));
    }
    showClanView();
    if (typeof updateHeader === 'function') updateHeader();
}
