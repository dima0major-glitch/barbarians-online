// Полная боевая система "Варваров" для battle.html

// Конфигурация противников (имя, аватарка, сила, защита, жизнь, награды)
const ENEMY_TEMPLATES = {
    junior: { name: "Младший Воришка", avatar: "🐀", str: 8, def: 5, hp: 60, silver: 15, gold: 0 },
    equal: { name: "Наёмник-Ровня", avatar: "⚔️", str: 15, def: 12, hp: 100, silver: 30, gold: 1 },
    senior: { name: "Старший Гладиатор", avatar: "🦁", str: 22, def: 18, hp: 150, silver: 60, gold: 3 },
    mercenaries: { name: "Опытный Солдат", avatar: "💂", str: 16, def: 15, hp: 110, silver: 40, gold: 1 },
    boss: { name: "Владыка Наемников", avatar: "👹", str: 35, def: 25, hp: 350, silver: 200, gold: 15 },
    by_level: { name: "Твой Соперник", avatar: "🥷", str: 14, def: 13, hp: 105, silver: 35, gold: 1 }
};

const BattleSystem = {
    player: null,
    enemy: null,

    // Инициализация данных при входе на экран поединка
    init: function() {
        if (window.GameStateManager && typeof window.GameStateManager.getPlayerStats === 'function') {
            this.player = window.GameStateManager.getPlayerStats();
        } else {
            this.player = JSON.parse(localStorage.getItem('player_stats')) || {
                name: "Варвар", avatar: "🪰", str: 15, def: 15, hp: 100, maxHp: 100, silver: 100, gold: 0
            };
        }

        const category = localStorage.getItem('arena_category') || 'equal';
        const template = ENEMY_TEMPLATES[category] || ENEMY_TEMPLATES.equal;
        
        this.enemy = { ...template, maxHp: template.hp };
        this.renderStats();
    },

    // Вывод характеристик в HTML
    renderStats: function() {
        if (document.getElementById('pName')) document.getElementById('pName').innerText = this.player.name || "Ты";
        if (document.getElementById('bName')) document.getElementById('bName').innerText = this.enemy.name;

        if (document.getElementById('pAvatar')) document.getElementById('pAvatar').innerText = this.player.avatar || "🪰";
        if (document.getElementById('bAvatar')) document.getElementById('bAvatar').innerText = this.enemy.avatar;

        if (document.getElementById('pStr')) document.getElementById('pStr').innerText = this.player.str;
        if (document.getElementById('bStr')) document.getElementById('bStr').innerText = this.enemy.str;

        if (document.getElementById('pDef')) document.getElementById('pDef').innerText = this.player.def;
        if (document.getElementById('bDef')) document.getElementById('bDef').innerText = this.enemy.def;

        if (document.getElementById('pHp')) document.getElementById('pHp').innerText = this.player.hp;
        if (document.getElementById('bHp')) document.getElementById('bHp').innerText = this.enemy.hp;
    },

    // Расчет урона
    calculateDamage: function(attackerStr, defenderDef) {
        let baseDmg = attackerStr;
        let randomFactor = 0.85 + Math.random() * 0.3;
        let finalDmg = Math.round(baseDmg * randomFactor);
        
        finalDmg = finalDmg - Math.round(defenderDef * 0.4);
        return Math.max(3, finalDmg);
    },

    // Симуляция поединка
    startCombatSimulation: function() {
        let pCurrentHp = Number(this.player.hp);
        let bCurrentHp = Number(this.enemy.hp);
        let logHtml = "";
        let round = 1;

        const actionBtn = document.getElementById('actionBtn');
        if (actionBtn) actionBtn.disabled = true;

        while (pCurrentHp > 0 && bCurrentHp > 0 && round <= 30) {
            logHtml += `<div style="color: #ffd700; margin-top: 5px; font-weight: bold;">📜 Раунд ${round}</div>`;

            // 1. Ход игрока
            let pDmg = this.calculateDamage(this.player.str, this.enemy.def);
            bCurrentHp = Math.max(0, bCurrentHp - pDmg);
            logHtml += `⚔️ Вы нанесли <span style="color:#00ffcc">${this.enemy.name}</span> урон <b style="color:#00ffcc">-${pDmg}</b>. (Осталось: ${bCurrentHp})<br>`;

            if (bCurrentHp <= 0) {
                logHtml += `<br><b style="color: #00ff00; font-size: 15px;">🎉 Победа! Вы сокрушили врага!</b><br>`;
                logHtml += `<span style="color: #ffd700; font-weight: bold;">💰 Получено серебра за победу: +${this.enemy.silver} серебра</span>`;
                if (this.enemy.gold > 0) {
                    logHtml += `<br><span style="color: #ffd700; font-weight: bold;">🟡 Получено золота за победу: +${this.enemy.gold} золота</span>`;
                }
                
                this.rewardPlayer(this.enemy.silver, this.enemy.gold);
                break;
            }

            // 2. Ход бота
            let bDmg = this.calculateDamage(this.enemy.str, this.player.def);
            pCurrentHp = Math.max(0, pCurrentHp - bDmg);
            logHtml += `💥 <span style="color:#ff4d4d">${this.enemy.name}</span> бьет вас на <b style="color:#ff4d4d">-${bDmg}</b>. (Осталось: ${pCurrentHp})<br>`;

            if (pCurrentHp <= 0) {
                // Штраф при поражении: забираем 10% от текущего серебра варвара
                let currentSilver = Number(this.player.silver) || 0;
                let silverPenalty = Math.round(currentSilver * 0.10);
                
                logHtml += `<br><b style="color: #ff3333; font-size: 15px;">💀 Вы проиграли поединок...</b><br>`;
                logHtml += `<span style="color: #ff4d4d; font-weight: bold;">🛑 Потеряно серебра за поражение: -${silverPenalty} серебра</span>`;
                
                this.penalizePlayer(silverPenalty);
                break;
            }

            round++;
        }

        if (document.getElementById('pHp')) document.getElementById('pHp').innerText = pCurrentHp;
        if (document.getElementById('bHp')) document.getElementById('bHp').innerText = bCurrentHp;

        const report = document.getElementById('reportContent');
        if (report) {
            report.innerHTML = logHtml;
        }
    },

    // Начисление выигрыша
    rewardPlayer: function(silverReward, goldReward) {
        this.player.silver = (Number(this.player.silver) || 0) + silverReward;
        this.player.gold = (Number(this.player.gold) || 0) + goldReward;
        this.saveAndSync();
    },

    // Списание штрафа за проигрыш
    penalizePlayer: function(silverPenalty) {
        let currentSilver = Number(this.player.silver) || 0;
        this.player.silver = Math.max(0, currentSilver - silverPenalty);
        this.saveAndSync();
    },

    // Сохранение в память браузера и обновление циферок в шапке
    saveAndSync: function() {
        localStorage.setItem('player_stats', JSON.stringify(this.player));

        if (window.GameStateManager && typeof window.GameStateManager.updateHeaderUI === 'function') {
            window.GameStateManager.updateHeaderUI();
        } else {
            if (document.getElementById('hdrSilver')) document.getElementById('hdrSilver').innerText = this.player.silver;
            if (document.getElementById('hdrGold')) document.getElementById('hdrGold').innerText = this.player.gold;
        }
    }
};

window.executeBattle = function() {
    BattleSystem.startCombatSimulation();
};

document.addEventListener("DOMContentLoaded", () => {
    BattleSystem.init();
});
