document.addEventListener('DOMContentLoaded', () => {
    // 1. ЛОГИКА РЕГИСТРАЦИИ
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Запрещаем перезагрузку страницы

            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Регистрация успешна! Теперь можно войти.');
                    window.location.href = '/login'; // Переводим на страницу входа
                } else {
                    alert(`Ошибка: ${data.message}`);
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('Не удалось связаться с сервером');
            }
        });
    }

    // 2. ЛОГИКА ВХОДА (АВТОРИЗАЦИИ)
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Запрещаем перезагрузку страницы

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Добро пожаловать в игру, ${data.username}!`);
                    window.location.href = '/menu'; // Переводим в главное меню
                } else {
                    alert(`Ошибка: ${data.message}`);
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('Не удалось связаться с сервером');
            }
        });
    }
});
