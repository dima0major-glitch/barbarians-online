// Переменная для хранения текущих данных игрока
let player = null;

document.addEventListener('DOMContentLoaded', () => {
    // Получаем текущего авторизованного игрока
    player = JSON.parse(localStorage.getItem('current_player'));

    if (!player) {
        alert('Ошибка: Вы не авторизованы!');
        window.location.href = 'index.html';
        return;
    }

    // Если у игрока еще нет характеристик в памяти, создаем базовые
    if (!player.stats) {
        player.stats = {
            strength: 10,
            defense: 10,
            health: 100
        };
        savePlayerData();
    }

    // Отображаем имя и характеристики на экране
    updateScreen();
});

// Функция для обновления текста на экране
function updateScreen() {
    if (!player) return;
    
    document.getElementById('charName').innerText = `⚔️ ${player.username} ⚔️`;
    document.getElementById('statStrength').innerText = player.stats.strength;
    document.getElementById('statDefense').innerText = player.stats.defense;
    document.getElementById('statHealth').innerText = player.stats.health;
}

// Функция прокачки характеристик
function upgradeStat(statName) {
    if (!player) return;

    // Увеличиваем выбранную характеристику (жизнь увеличиваем сразу на +10, остальное на +1)
    if (statName === 'health') {
        player.stats[statName] += 10;
    } else {
        player.stats[statName] += 1;
    }

    // Сохраняем новые статы в память телефона
    savePlayerData();
    
    // Обновляем цифры на экране
    updateScreen();
}

// Вспомогательная функция для сохранения изменений в localStorage
function savePlayerData() {
    // 1. Обновляем текущую сессию
    localStorage.setItem('current_player', JSON.stringify(player));

    // 2. Находим этого игрока в общем списке всех пользователей и обновляем его там
    let allUsers = JSON.parse(localStorage.getItem('game_users')) || [];
    const userIndex = allUsers.findIndex(u => u.email === player.email);
    if (userIndex !== -1) {
        allUsers[userIndex] = player;
        localStorage.setItem('game_users', JSON.stringify(allUsers));
    }
}
