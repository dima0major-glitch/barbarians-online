/* ==========================================
   БАЛАНС И НАСТРОЙКИ КЛАНОВОЙ СИСТЕМЫ
   ========================================== */
const CLAN_CREATION_COST = 10000;
const MAX_MEMBERS = 15;
const UPGRADE_COST_BASE = 5000;

let hero = JSON.parse(localStorage.getItem('hero_stats')) || { name: "Воин", level: 1, silver: 0, clan: null };
let clans = JSON.parse(localStorage.getItem('game_clans')) || {};

function renderClanSystem() {
    const container = document.getElementById('clan-view');
    if (!container) return;
    
    if (!hero.clan || !clans[hero.clan]) {
        hero.clan = null; 
        renderCreateClanForm(container);
    } else {
        renderClanDashboard(container, hero.clan);
    }
}

function renderCreateClanForm(container) {
    container.innerHTML = `
        <div style="background-color: #222831; padding: 8px; border: 1px dashed #57687f; margin-bottom: 8px;">
            Вы не состоите в боевом союзе. Основать свой замок и вести за собой до <b>${MAX_MEMBERS} воинов</b>!
        </div>
        <div style="padding: 5px; background: #333a42;">
            <b>Цена основания:</b> <span style="color: #d4af37;">${CLAN_CREATION_COST} серебра</span><br><br>
            Название клана (до 12 симв.):<br>
            <input type="text" id="clan-name-input" maxlength="12" style="background: #1e232a; color: #fff; border: 1px solid #57687f; padding: 3px; width: 90%; margin-top: 4px;"><br><br>
            <button onclick="createClan()" style="background: #4a5768; color: #fff; border: 1px solid #8da9c4; padding: 4px 10px; cursor: pointer;">🔨 Основать клан</button>
        </div>
    `;
}

function renderClanDashboard(container, clanName) {
    const clan = clans[clanName];
    const isLeader = clan.leader === hero.name;
    const currentBonus = clan.totemLevel * 2;

    container.innerHTML = `
        <div style="background: #333a42; padding: 6px; margin-bottom: 6px; border-left: 3px solid #8da9c4;">
            <b>Орден:</b> <span style="color: #8da9c4; font-size: 110%;">${clan.name}</span><br>
            <b>Вождь:</b> ${clan.leader}<br>
            <b>Состав:</b> <span style="color: #00ff00;">${clan.members.length}</span> / <b>${MAX_MEMBERS} воинов</b>
        </div>

        <div style="background: #222831; padding: 6px; margin-bottom: 8px; border: 1px solid #3a4454;">
            <div style="color: #8da9c4; font-weight: bold; border-bottom: 1px solid #3a4454; padding-bottom: 2px; margin-bottom: 4px;">🐾 Тотем Ледяного Волка</div>
            Уровень тотема: <b>${clan.totemLevel}</b><br>
            Текущий бонус: <span style="color: #ffaa00;">+${currentBonus} Силы / +${currentBonus} Защиты</span> всем членам.<br>
            <div style="margin-top: 5px; background: #2b323a; padding: 4px;">
                Стоимость улучшения: <b>${(clan.totemLevel + 1) * UPGRADE_COST_BASE}</b> серебра (из казны)<br>
                <button onclick="upgradeTotem()" style="background: #3a4454; color: #fff; border: 1px solid #57687f; padding: 2px 6px; font-size: 11px; margin-top: 4px; cursor: pointer;">⚡ Качнуть тотем</button>
            </div>
        </div>

        <div style="background: #222831; padding: 6px; margin-bottom: 8px; border: 1px solid #3a4454;">
            💰 <b>Казна:</b> <span style="color: #d4af37;">${clan.treasury} серебра</span><br>
            <div style="margin-top: 4px;">
                Пополнить казну (ваше серебро: ${hero.silver}):<br>
                <input type="number" id="gold-donate" min="1" max="${hero.silver}" style="background: #1e232a; color: #fff; border: 1px solid #57687f; width: 80px; padding: 2px;">
                <button onclick="donateSilver()" style="background: #4a5768; color: #fff; border: 1px solid #8da9c4; padding: 2px 6px; font-size: 11px; cursor: pointer;">Внести</button>
            </div>
        </div>

        <div style="background: #222831; padding: 6px; margin-bottom: 8px;">
            <div style="color: #8da9c4; font-weight: bold; border-bottom: 1px solid #3a4454; padding-bottom: 2px; margin-bottom: 4px;">👥 Дружина клана:</div>
            <div id="members-list" style="font-size: 11px; line-height: 1.4;">
                ${clan.members.map((m, idx) => `<div>${idx + 1}. <b>${m}</b> ${m === clan.leader ? '<span style="color:#d4af37;">[Вождь]</span>' : ''}</div>`).join('')}
            </div>
            
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #3a4454;">
                <button onclick="simulateAddMember()" style="background: #2b323a; color: #aaa; border: 1px solid #444; padding: 2px 4px; font-size: 10px; cursor: pointer;">🤖 Нанять наемника (Тест лимита 15 чел)</button>
            </div>
        </div>

        <div style="text-align: right; padding: 4px;">
            ${isLeader ? 
                `<button onclick="disbandClan()" style="background: #7a2222; color: #fff; border: 1px solid #a33333; padding: 3px 6px; font-size: 11px; cursor: pointer;">💥 Распустить клан</button>` : 
                `<button onclick="leaveClan()" style="background: #7a2222; color: #fff; border: 1px solid #a33333; padding: 3px 6px; font-size: 11px; cursor: pointer;">🚪 Покинуть клан</button>`
            }
        </div>
    `;
}

window.createClan = function() {
    const input = document.getElementById('clan-name-input');
    if (!input) return;
    const name = input.value.trim();

    if (!name) return alert("Введите название клана!");
    if (hero.silver < CLAN_CREATION_COST) return alert("Недостаточно серебра!");
    if (clans[name]) return alert("Клан с таким именем уже зарегистрирован!");

    hero.silver -= CLAN_CREATION_COST;
    hero.clan = name;

    clans[name] = {
        name: name,
        leader: hero.name,
        totemLevel: 0,
        treasury: 0,
        members: [hero.name]
    };

    saveAndRefresh();
};

window.donateSilver = function() {
    const input = document.getElementById('gold-donate');
    const amount = parseInt(input ? input.value : 0);

    if (isNaN(amount) || amount <= 0) return alert("Введите корректное число!");
    if (hero.silver < amount) return alert("У вас нет столько серебра!");

    hero.silver -= amount;
    clans[hero.clan].treasury += amount;

    saveAndRefresh();
};

window.upgradeTotem = function() {
    const clan = clans[hero.clan];
    const cost = (clan.totemLevel + 1) * UPGRADE_COST_BASE;

    if (clan.treasury < cost) return alert("В казне не хватает серебра!");

    clan.treasury -= cost;
    clan.totemLevel += 1;

    saveAndRefresh();
};

window.simulateAddMember = function() {
    const clan = clans[hero.clan];
    
    if (clan.members.length >= MAX_MEMBERS) {
        return alert(`Лимит исчерпан! Клан не вмещает более ${MAX_MEMBERS} воинов.`);
    }

    const pool = ["Ульф", "Торстейн", "Рагнар", "Бьёрн", "Сигурд", "Харальд", "Ивар", "Кнут", "Эгиль", "Олаф"];
    let randomBot = pool[Math.floor(Math.random() * pool.length)] + "_" + Math.floor(Math.random() * 899 + 100);
    
    clan.members.push(randomBot);
    saveAndRefresh();
};

window.disbandClan = function() {
    if (!confirm("Уничтожить клан навсегда? Прогресс тотема и казна обнулятся!")) return;
    
    delete clans[hero.clan];
    hero.clan = null;

    saveAndRefresh();
};

function saveAndRefresh() {
    localStorage.setItem('hero_stats', JSON.stringify(hero));
    localStorage.setItem('game_clans', JSON.stringify(clans));
    
    if (hero.clan && clans[hero.clan]) {
        let bonus = clans[hero.clan].totemLevel * 2;
        localStorage.setItem('clan_bonus_stats', JSON.stringify({ strength: bonus, defense: bonus }));
    } else {
        localStorage.setItem('clan_bonus_stats', JSON.stringify({ strength: 0, defense: 0 }));
    }

    renderClanSystem();
    if (typeof updateHeader === 'function') updateHeader();
}

initMarket = function(){}; 
renderClanSystem();
