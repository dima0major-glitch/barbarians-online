document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // ЛОГИКА РЕГИСТРАЦИИ (БЕЗ СЕРВЕРА - ДЛЯ GITHUB PAGES)
    // ==========================================================================
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Запрещаем перезагрузку страницы

            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;

            // Достаем уже существующих пользователей из памяти (или создаем пустой массив)
            let users = JSON.parse(localStorage.getItem('game_users')) || [];

            // Проверяем, нет ли уже пользователя с такой почтой или ником
            const userExists = users.some(u => u.email === email || u.username === username);
            
            if (userExists) {
                alert('Ошибка: Такой воин или email уже зарегистрирован!');
                return;
            }

            // Создаем нового варвара и добавляем в массив
            const newWarrior = { username, email, password };
            users.push(newWarrior);

            // Сохраняем обновленный список обратно в память браузера
            localStorage.setItem('game_users', JSON.stringify(users));

            alert('Регистрация успешна! Твой воин готов к битвам.');
            window.location.href = 'login.html'; // Перенаправляем на страницу входа напрямую
        });
    }

    // ==========================================================================
    // ЛОГИКА ВХОДА (БЕЗ СЕРВЕРА - ДЛЯ GITHUB PAGES)
    // ==========================================================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Запрещаем перезагрузку страницы

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;

            // Достаем пользователей из памяти телефона
            const users = JSON.parse(localStorage.getItem('game_users')) || [];

            // Ищем нужного пользователя по email
            const foundUser = users.find(u => u.email === email);

            // Проверяем пароль
            if (!foundUser || foundUser.password !== password) {
                alert('Ошибка: Неверный email или пароль!');
                return;
            }

            // Запоминаем, какой именно персонаж сейчас залогинен (пригодится для меню)
            localStorage.setItem('current_player', JSON.stringify(foundUser));

            alert(`Добро пожаловать назад, ${foundUser.username}!`);
            window.location.href = 'menu.html'; // Перенаправляем в главное меню напрямую
        });
    }
});
