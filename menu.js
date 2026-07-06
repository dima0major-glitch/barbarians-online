document.addEventListener('DOMContentLoaded', () => {
    const currentPlayer = JSON.parse(localStorage.getItem('current_player'));

    if (!currentPlayer) {
        alert('Ошибка: Сначала нужно войти в аккаунт!');
        window.location.href = 'index.html';
        return;
    }

    // Если у игрока еще нет уровня или золота, ставим базовые для отображения
    const stats = currentPlayer.stats || { level: 1, gold: 100, health: 100 };

    // Заполняем верхнюю панель ресурсов
    document.getElementById('hdrUser').innerText = `👑 ${currentPlayer.username} [${stats.level} ур]`;
    document.getElementById('hdrHp').innerText = stats.health;
    document.getElementById('hdrGold').innerText = stats.gold;

    // Генерируем случайное число онлайн-игроков для атмосферы
    const randomOnline = Math.floor(Math.random() * 150) + 800;
    document.getElementById('onlineStatus').innerText = `Рядом с тобой ${randomOnline} варваров (онлайн)`;
});

function logout() {
    localStorage.removeItem('current_player');
    window.location.href = 'index.html';
}
