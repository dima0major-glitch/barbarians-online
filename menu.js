// Глобальный менеджер состояния персонажа для игры "Варвары"

const GameStateManager = {
    defaultStats: {
        name: "Варвар",
        level: 1,
        hp: 100,
        maxHp: 100,
        mana: 1590,
        silver: 3759,
        diamonds: 0,
        gold: 100,
        energy: 3,       // Теперь это число для расчетов
        maxEnergy: 3,    // Максимум энергии
        lastEnergyTime: Date.now(), // Время последнего обновления энергии
        str: 15,
        def: 15,
        avatar: "🧔"
    },

    getPlayerStats: function() {
        let stats = localStorage.getItem('player_stats');
        if (!stats) {
            stats = this.defaultStats;
            localStorage.setItem('player_stats', JSON.stringify(stats));
            return stats;
        }
        let parsed = JSON.parse(stats);
        return { ...this.defaultStats, ...parsed };
    },

    // Логика восстановления энергии (1 единица раз в 5 минут)
    checkEnergyRegen: function(player) {
        let now = Date.now();
        let currentEnergy = Number(player.energy);
        let maxEnergy = Number(player.maxEnergy || 3);

        if (currentEnergy >= maxEnergy) {
            player.lastEnergyTime = now;
            localStorage.setItem('player_stats', JSON.stringify(player));
            return 0; // Восстанавливать не нужно, уже макс
        }

        let timePassed = now - (player.lastEnergyTime || now);
        let regenInterval = 5 * 60 * 1000; // 5 минут в миллисекундах

        if (timePassed >= regenInterval) {
            let energyToAdd = Math.floor(timePassed / regenInterval);
            player.energy = Math.min(maxEnergy, currentEnergy + energyToAdd);
            // Сдвигаем точку отсчета на остаток времени
            player.lastEnergyTime = now - (timePassed % regenInterval);
            localStorage.setItem('player_stats', JSON.stringify(player));
        }

        // Возвращаем, сколько миллисекунд осталось до следующего восстановления
        return regenInterval - (Date.now() - player.lastEnergyTime);
    },

    updateHeaderUI: function() {
        const player = this.getPlayerStats();
        
        // Считаем реген энергии перед выводом на экран
        let msLeft = this.checkEnergyRegen(player);

        const fields = {
            'hdrUser': player.name,
            'hdrLevel': player.level,
            'hdrHp': player.hp,
            'hdrMana': player.mana,
            'hdrSilver': player.silver,
            'hdrDiamonds': player.diamonds,
            'hdrGold': player.gold,
            'hdrEnergy': `${player.energy}/${player.maxEnergy || 3}`
        };

        for (const [id, value] of Object.entries(fields)) {
            const element = document.getElementById(id);
            if (element) element.innerText = value;
        }

        // Запуск часов реального времени и таймера энергии в песочных часах
        this.startHeaderClocks(msLeft, player.energy < (player.maxEnergy || 3));
    },

    startHeaderClocks: function(msLeft, needsRegen) {
        // Очистим старые интервалы, чтобы не двоились
        if (window.headerClockInterval) clearInterval(window.headerClockInterval);

        const updateClock = () => {
            // 1. Обычные системные часы (🕒)
            const timeElement = document.getElementById('hdrTime');
            if (timeElement) {
                const now = new Date();
                const hrs = String(now.getHours()).padStart(2, '0');
                const mins = String(now.getMinutes()).padStart(2, '0');
                const secs = String(now.getSeconds()).padStart(2, '0');
                timeElement.innerText = `${hrs}:${mins}:${secs}`;
            }

            // 2. Таймер песочных часов (⏳)
            const hourglassElement = document.getElementById('hdrHourglass');
            if (hourglassElement) {
                if (!needsRegen) {
                    hourglassElement.innerText = "00:00:00";
                } else {
                    // Уменьшаем оставшееся время на 1 секунду (1000мс)
                    msLeft -= 1000;
                    if (msLeft <= 0) {
                        // Если время вышло, перезапускаем всю страницу для начисления энергии
                        clearInterval(window.headerClockInterval);
                        window.location.reload();
                        return;
                    }
                    
                    let totalSecs = Math.floor(msLeft / 1000);
                    let m = String(Math.floor(totalSecs / 60)).padStart(2, '0');
                    let s = String(totalSecs % 60).padStart(2, '0');
                    hourglassElement.innerText = `00:${m}:${s}`;
                }
            }
        };

        updateClock();
        window.headerClockInterval = setInterval(updateClock, 1000);
    },

    logout: function() {
        if (confirm("Вы действительно хотите сбросить игровой прогресс персонажа?")) {
            localStorage.removeItem('player_stats');
            localStorage.removeItem('arena_category');
            window.location.href = 'menu.html';
        }
    }
};

window.logout = function() {
    GameStateManager.logout();
};

document.addEventListener("DOMContentLoaded", () => {
    GameStateManager.updateHeaderUI();
});
