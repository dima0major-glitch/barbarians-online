document.addEventListener('DOMContentLoaded', () => {
    let currentPlayer = JSON.parse(localStorage.getItem('current_player'));

    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }

    if (!currentPlayer.stats) currentPlayer.stats = {};
    
    if (currentPlayer.stats.level === undefined) currentPlayer.stats.level = 1;
    if (currentPlayer.stats.health === undefined) currentPlayer.stats.health = 100;
    if (currentPlayer.stats.mana === undefined) currentPlayer.stats.mana = 1590;
    if (currentPlayer.stats.silver === undefined) currentPlayer.stats.silver = 3759;
    if (currentPlayer.stats.diamonds === undefined) currentPlayer.stats.diamonds = 0;
    if (currentPlayer.stats.gold === undefined) currentPlayer.stats.gold = 141;
    if (currentPlayer.stats.energy === undefined) currentPlayer.stats.energy = "3/3";

    // Логика восстановления боев (каждые 5 минут)
    function checkEnergyRegen() {
        let currentEnergy = parseInt(currentPlayer.stats.energy);
        if (isNaN(currentEnergy)) currentEnergy = 3;

        if (currentEnergy < 3) {
            let timerStart = localStorage.getItem('energy_timer_start');
            if (timerStart) {
                let now = Date.now();
                let timePassed = now - parseInt(timerStart);
                let regenTime = 5 * 60 * 1000; // 5 минут

                if (timePassed >= regenTime) {
                    let restored = Math.floor(timePassed / regenTime);
                    currentEnergy = Math.min(3, currentEnergy + restored);
                    currentPlayer.stats.energy = currentEnergy + "/3";
                    
                    if (currentEnergy >= 3) {
                        localStorage.removeItem('energy_timer_start');
                    } else {
                        let remainder = timePassed % regenTime;
                        localStorage.setItem('energy_timer_start', now - remainder);
                    }
                    
                    localStorage.setItem('current_player', JSON.stringify(currentPlayer));
                    let allUsers = JSON.parse(localStorage.getItem('game_users')) || [];
                    const idx = allUsers.findIndex(u => u.email === currentPlayer.email);
                    if (idx !== -1) {
                        allUsers[idx] = currentPlayer;
                        localStorage.setItem('game_users', JSON.stringify(allUsers));
                    }
                }
            }
        }
    }

    checkEnergyRegen();

    // Заполнение хедера
    document.getElementById('hdrUser').innerText = currentPlayer.username;
    document.getElementById('hdrLevel').innerText = currentPlayer.stats.level;
    document.getElementById('hdrHp').innerText = currentPlayer.stats.health;
    document.getElementById('hdrMana').innerText = currentPlayer.stats.mana;
    document.getElementById('hdrSilver').innerText = currentPlayer.stats.silver;
    document.getElementById('hdrDiamonds').innerText = currentPlayer.stats.diamonds;
    document.getElementById('hdrGold').innerText = currentPlayer.stats.gold;
    document.getElementById('hdrEnergy').innerText = currentPlayer.stats.energy;

    const randomOnline = Math.floor(Math.random() * 50) + 1050;
    document.getElementById('onlineStatus').innerHTML = `Добро пожаловать!<br><span style="font-size:14px; color:#ddd; font-weight:normal;">Рядом с тобой ${randomOnline} норманнов (онлайн)</span>`;

    // Секундный таймер для тиканья песочных часов
    setInterval(() => {
        const nowTime = new Date();
        document.getElementById('hdrTime').innerText = nowTime.toTimeString().split(' ')[0];

        let currentEnergy = parseInt(currentPlayer.stats.energy);
        // Ищем ячейку рядом со значком песочных часов ⏳
        const hourglass = document.getElementById('hdrTime').previousElementSibling; 

        if (currentEnergy < 3) {
            let timerStart = localStorage.getItem('energy_timer_start');
            if (timerStart) {
                let diff = Date.now() - parseInt(timerStart);
                let regenTime = 5 * 60 * 1000;
                let timeLeft = regenTime - diff;

                if (timeLeft <= 0) {
                    checkEnergyRegen();
                    document.getElementById('hdrEnergy').innerText = currentPlayer.stats.energy;
                } else {
                    let minutes = Math.floor(timeLeft / 60000);
                    let seconds = Math.floor((timeLeft % 60000) / 1000);
                    let displayStr = `00:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                    if (hourglass && hourglass.tagName === 'SPAN') {
                        hourglass.innerText = displayStr;
                    }
                }
            }
        } else {
            if (hourglass && hourglass.tagName === 'SPAN') hourglass.innerText = "00:00:00";
        }
    }, 1000);
});

function logout() {
    localStorage.removeItem('current_player');
    window.location.href = 'index.html';
}
