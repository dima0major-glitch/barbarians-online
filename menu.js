document.addEventListener('DOMContentLoaded', () => {
    // Получаем данные игрока
    const currentPlayer = JSON.parse(localStorage.getItem('current_player'));

    // Находим заголовок на странице
    const welcomeTitle = document.getElementById('welcomeTitle');

    // Если игрок найден, пишем его имя. Если нет — просто оставляем "Воин"
    if (currentPlayer && welcomeTitle) {
        welcomeTitle.innerText = `⚔️ Воин, ${currentPlayer.username} ⚔️`;
    }
});

// Функция выхода
function logout() {
    localStorage.removeItem('current_player');
    window.location.href = 'index.html';
}
