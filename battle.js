// Полная боевая система "Варваров" для battle.html

const ENEMY_TEMPLATES = {
    junior: { name: "Младший Воришка", avatar: "🐀", str: 8, def: 5, hp: 60, silver: 15, gold: 0 },
    equal: { name: "Серебряный наемник", avatar: "⚔️", str: 15, def: 12, hp: 100, silver: 30, gold: 1 },
    senior: { name: "Старший Гладиатор", avatar: "🦁", str: 22, def: 18, hp: 150, silver: 60, gold: 3 },
    mercenaries: { name: "Опытный Солдат", avatar: "💂", str: 16, def: 15, hp: 110, silver: 40, gold: 1 },
    boss: { name: "Владыка Наемников", avatar: "👹", str: 35, def: 25, hp: 350, silver: 200, gold: 15 },
    by_level: { name: "Твой Соперник", avatar: "🥷", str: 14, def: 13, hp: 105, silver: 35, gold: 1 }
};

const BattleSystem = {
    player: null,
    enemy: null,

    init: function() {
        if (window.GameStateManager && typeof window.GameStateManager.getPlayerStats === 'function') {
            this.player = window.GameStateManager.getPlayerStats();
        } else {
            this.player = JSON.parse(localStorage.getItem('player_stats')) || {
                name: "Варвар", avatar: "🪰", str: 15, def: 15, hp: 100, maxHp: 100, silver: 100, gold: 0, energy: 3, maxEnergy: 3
            };
        }

        const headerUser = document.getElementById('hdrUser');
        if (headerUser && (!this.player.name || this.player.name === "Варвар")) {
            this.player.name = headerUser.innerText.trim();
        }

        const category = localStorage.getItem('arena_category') || 'equal';
        const template = ENEMY_TEMPLATES[category] || ENEMY_TEMPLATES.equal;
        
        this.enemy = { ...template, maxHp: template.hp };
        this.renderStats();

        // ПРОВЕРКА ЭНЕРГИИ ПЕРЕД БОЕМ: если 0, отключаем кнопку сразу
        if (Number(this.player.energy) <= 0) {
            const actionBtn = document.getElementById('actionBtn');
            if (actionBtn) {
                actionBtn.disabled = true;
                actionBtn.innerText = "НЕТ ЭНЕРГИИ";
                actionBtn.style.background = "#333";
                actionBtn.style.border = "2px solid #555";
            }
            const report = document.getElementById('reportContent');
            if (report) {
                report.innerHTML = `<span style="color:#ff3333; font-weight:bold;">У вас закончилась энергия для боев! Подождите восстановления (1 ед. каждые 5 минут).</span>`;
            }
        }
    },

    renderStats: function() {
        if (document.getElementById('pName')) document.getElementById('pName').innerText = this.player.name || "Ты";
        if (document.getElementById('bName')) document.getElementById('bName').innerText = this.enemy.name;
        if (document.getElementById('pAvatar')) document.getElementById('pAvatar').innerText = this.player.avatar || "🪰";
        if (document.getElementById('bAvatar')) document.getElementById('bAvatar').innerText = this.enemy.avatar;
        if (document.getElementById('pStr')) document.getElementById('pStr').innerText = this.player.str || 15;
        if (document.getElementById('bStr')) document.getElementById('bStr').innerText = this.enemy.str;
        if (document.getElementById('pDef')) document.getElementById('pDef').innerText = this.player.def || 15;
        if (document.getElementById('bDef')) document.getElementById('bDef').innerText = this.enemy.def;
        if (document.getElementById('pHp')) document.getElementById('pHp').innerText = this.player.hp || 100;
        if (document.getElementById('bHp')) document.getElementById('bHp').innerText = this.enemy.hp;
    },

    calculateDamage: function(attackerStr, defenderDef) {
        let baseDmg = Number(attackerStr) || 10;
        let baseDef = Number(defenderDef) || 10;
        let randomFactor = 0.85 + Math.random() * 0.3;
        let finalDmg = Math.round(baseDmg * randomFactor);
        finalDmg = finalDmg - Math.round(baseDef * 0.4);
        return Math.max(3, finalDmg);
    },

    startCombatSimulation: function() {
        // Дополнительная проверка на всякий случай
        if (Number(this.player.energy) <= 0) return;

        // СПИСЫВАЕМ 1 ЭНЕРГИЮ ЗА БОЙ
        let currentEnergy = Number(this.player.energy);
        let maxEnergy = Number(this.player.maxEnergy || 3);
        
        // Если это первый бой при полной энергии, ставим временную метку старта регена
        if (currentEnergy === maxEnergy) {
            this.player.lastEnergyTime = Date.now();
        }
        
        this.player.energy = currentEnergy - 1;

        let pCurrentHp = Number(this.player.hp) || 100;
        let bCurrentHp = Number(this.enemy.hp) || 100;
        
        let totalPlayerDamage = 0;
        let totalEnemyDamage = 0;
        
        let logHtml = "";
        let round = 1;
        let isWin = false;

        const actionBtn = document.getElementById('actionBtn');
        if (actionBtn) actionBtn.disabled = true;

        while (pCurrentHp > 0 && bCurrentHp > 0 && round <= 30) {
            logHtml += `<div style="color: #ffd700; margin-top: 5px; font-weight: bold;">📜 Раунд ${round}</div>`;

            let pDmg = this.calculateDamage(this.player.str, this.enemy.def);
            bCurrentHp = Math.max(0, bCurrentHp - pDmg);
            totalPlayerDamage += pDmg;
            logHtml += `⚔️ Вы нанесли урон <b>-${pDmg}</b>. (Осталось у врага: ${bCurrentHp})<br>`;

            if (bCurrentHp <= 0) {
                isWin = true;
                this.rewardPlayer(this.enemy.silver, this.enemy.gold);
                break;
            }

            let bDmg = this.calculateDamage(this.enemy.str, this.player.def);
            pCurrentHp = Math.max(0, pCurrentHp - bDmg);
            totalEnemyDamage += bDmg;
            logHtml += `💥 Враг нанес вам урон <b>-${bDmg}</b>. (Осталось у вас: ${pCurrentHp})<br>`;

            if (pCurrentHp <= 0) {
                isWin = false;
                let currentSilver = Number(this.player.silver) || 0;
                let silverPenalty = Math.round(currentSilver * 0.10);
                this.penalizePlayer(silverPenalty);
                break;
            }

            round++;
        }

        // Если мы не выиграли и не проиграли досрочно (просто сохраняем трату энергии)
        this.saveAndSync();

        document.getElementById('setupScreen').style.display = 'none';
        document.getElementById('screenTitle').innerText = "Итог боя";

        const resultScreen = document.getElementById('resultScreen');
        resultScreen.style.display = 'block';

        let playerName = this.player.name || "Ты";
        let enemyName = this.enemy.name;

        let resultHtml = "";
        if (isWin) {
            resultHtml += `<div class="result-status-win">Ты победил</div>`;
            resultHtml += `<div>Причина - победитель нанес больше суммарного урона</div>`;
            resultHtml += `<div style="margin-top:10px; font-weight:bold;">Награда:</div>`;
            resultHtml += `<div>Серебро: <span class="silver-icon"></span>${this.enemy.silver}</div>`;
        } else {
            let currentSilver = Number(this.player.silver) || 0;
            let penalty = Math.round(currentSilver * 0.1);
            resultHtml += `<div class="result-status-lose">Ты проиграл</div>`;
            resultHtml += `<div>Причина - соперник оказался сильнее в бою</div>`;
            resultHtml += `<div style="margin-top:10px; font-weight:bold;">Штраф:</div>`;
            resultHtml += `<div style="color:#ff4d4d">Серебро: -${penalty}</div>`;
        }

        resultHtml += `
            <div style="margin-top:15px; font-weight:bold;">Нанесенный урон:</div>
            <div>${playerName}: ${totalPlayerDamage}</div>
            <div>${enemyName}: ${totalEnemyDamage}</div>

            <div style="margin-top:15px; font-weight:bold;">Осталось здоровья:</div>
            <div>${playerName}: ${pCurrentHp}</div>
            <div>${enemyName}: ${bCurrentHp}</div>

            <div style="margin-top:15px; font-weight:bold; color: #b0c4de;">Дополнительная информация:</div>
            <div style="color: #888; font-size: 13px;">Бой завершен за ${round} раундов. Экипировка и бонусы не повлияли.</div>
        `;

        resultScreen.innerHTML = resultHtml;
        document.getElementById('reportContent').innerHTML = logHtml;
    },

    rewardPlayer: function(silverReward, goldReward) {
        this.player.silver = (Number(this.player.silver) || 0) + silverReward;
        this.player.gold = (Number(this.player.gold) || 0) + goldReward;
    },

    penalizePlayer: function(silverPenalty) {
        let currentSilver = Number(this.player.silver) || 0;
        this.player.silver = Math.max(0, currentSilver - silverPenalty);
    },

    saveAndSync: function() {
        localStorage.setItem('player_stats', JSON.stringify(this.player));
        if (window.GameStateManager && typeof window.GameStateManager.updateHeaderUI === 'function') {
            window.GameStateManager.updateHeaderUI();
        }
    }
};

window.executeBattle = function() {
    BattleSystem.startCombatSimulation();
};

document.addEventListener("DOMContentLoaded", () => {
    BattleSystem.init();
});
