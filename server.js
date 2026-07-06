const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Временный массив для хранения игроков (пока не подключили game.sql)
const users = []; 

// Позволяет серверу читать JSON-данные от клиента
app.use(express.json());

// Раздаем статические папки из корня проекта
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/icons', express.static(path.join(__dirname, '../icons')));
app.use('/sounds', express.static(path.join(__dirname, '../sounds')));

// --- МАРШРУТЫ ДЛЯ HTML-СТРАНИЦ ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../register.html')));
app.get('/menu', (req, res) => res.sendFile(path.join(__dirname, '../menu.html')));
app.get('/character', (req, res) => res.sendFile(path.join(__dirname, '../character.html')));

// --- API: ОБРАБОТКА РЕГИСТРАЦИИ ---
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Заполните все поля!' });
    }

    // Проверяем, свободен ли ник или email
    const userExists = users.find(u => u.email === email || u.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Такой воин или email уже зарегистрирован' });
    }

    // Сохраняем варвара во временную память сервера
    users.push({ username, email, password });
    console.log(`[Сервер]: Зарегистрирован новый варвар: ${username}`);

    res.status(201).json({ message: 'Успешная регистрация' });
});

// --- API: ОБРАБОТКА ВХОДА ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Заполните все поля!' });
    }

    // Ищем пользователя по email
    const user = users.find(u => u.email === email);

    // Если не нашли или пароль не подошел
    if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    console.log(`[Сервер]: Воин ${user.username} вошел в игру.`);
    res.status(200).json({ message: 'Успешный вход', username: user.username });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`=== Сервер запущен! ===`);
    console.log(`Игра доступна по адресу: http://localhost:${PORT}`);
});
