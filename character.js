let player = null;

document.addEventListener('DOMContentLoaded', () => {
    player = JSON.parse(localStorage.getItem('current_player'));

    if (!player) {
        alert('Ошибка: Вы не авторизованы!');
        window.location.href = 'index.html';
        return;
    }

    // Добавляем уровень и золото, если их еще нет
    if (!player.stats) {
        player.stats = {
            level: 1,
            gold: 100,
            strength: 10,
            defense: 10,
            health: 100
        };
        savePlayerData();
    } else {
        // На случай, если статы были, но без золота и уровня
        if (player.stats.level === undefined) player.stats.level = 1;
        if (player.stats.gold === undefined) player.stats.gold = 100;
        savePlayerData();
    }

    updateScreen();
});

function updateScreen() {
    if (!player) return;
    document.getElementById('charName').innerText = `⚔️ ${player.username} ⚔️`;
    document.getElementById('statStrength').innerText = player.stats.strength;
    document.getElementById('statDefense').innerText = player.stats.defense;
    document.getElementById('statHealth').innerText = player.stats.health;
}

function upgradeStat(statName) {
    if (!player) return;

    // Прокачка стоит, например, 10 золота
    if (player.stats.gold < 10) {
        alert('Недостаточно золота! Нужно 10 💰');
        return;
    }

    player.stats.gold -= 10;

    if (statName === 'health') {
        player.stats[statName] += 10;
    } else {
        player.stats[statName] += 1;
    }

    savePlayerData();
    updateScreen();
}

function savePlayerData() {
    localStorage.setItem('current_player', JSON.stringify(player));
    let allUsers = JSON.parse(localStorage.getItem('game_users')) || [];
    const userIndex = allUsers.findIndex(u => u.email === player.email);
    if (userIndex !== -1) {
        allUsers[userIndex] = player;
        localStorage.setItem('game_users', JSON.stringify(allUsers));
    }
}
