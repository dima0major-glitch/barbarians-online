document.addEventListener('DOMContentLoaded', () => {
    const currentPlayer = JSON.parse(localStorage.getItem('current_player'));

    if (!currentPlayer) {
        alert('Ошибка: Сначала нужно войти в аккаунт!');
        window.location.href = 'index.html';
        return;
    }

    // Если у игрока вообще нет стат, создаем их
    if (!currentPlayer.stats) {
        currentPlayer.stats = {};
    }
    
    // Заполняем ресурсы огромными числами, как в твоем референсе
    if (currentPlayer.stats.level === undefined) currentPlayer.stats.level = 15;
    if (currentPlayer.stats.health === undefined) currentPlayer.stats.health = 172365;
    if (currentPlayer.stats.mana === undefined) currentPlayer.stats.mana = 1590; // Синяя круглая иконка (мания/репутация)
    if (currentPlayer.stats.silver === undefined) currentPlayer.stats.silver = 184491;
    if (currentPlayer.stats.diamonds === undefined) currentPlayer.stats.diamonds = 0;
    if (currentPlayer.stats.gold === undefined) currentPlayer.stats.gold = 98;
    if (currentPlayer.stats.energy === undefined) currentPlayer.stats.energy = "3/3";

    // Выводим данные в панель
    document.getElementById('hdrUser').innerText = currentPlayer.username;
    document.getElementById('hdrLevel').innerText = currentPlayer.stats.level;
    document.getElementById('hdrHp').innerText = currentPlayer.stats.health;
    document.getElementById('hdrMana').innerText = currentPlayer.stats.mana;
    document.getElementById('hdrSilver').innerText = currentPlayer.stats.silver;
    document.getElementById('hdrDiamonds').innerText = currentPlayer.stats.diamonds;
    document.getElementById('hdrGold').innerText = currentPlayer.stats.gold;
    document.getElementById('hdrEnergy').innerText = currentPlayer.stats.energy;

    // Генерация онлайна
    const randomOnline = Math.floor(Math.random() * 50) + 1050;
    document.getElementById('onlineStatus').innerHTML = `Добро пожаловать!<br><span style="font-size:14px; color:#ddd; font-weight:normal;">Рядом с тобой ${randomOnline} норманнов (онлайн)</span>`;

    // Запуск тикающих часов
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0]; // Получаем формат ЧЧ:ММ:СС
        document.getElementById('hdrTime').innerText = timeStr;
    }, 1000);
});

function logout() {
    localStorage.removeItem('current_player');
    window.location.href = 'index.html';
}
