const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); 

// База данных игрока в памяти сервера
let currentUser = {
    username: "Новый_Воин",
    level: 1,
    hp: 120,
    def: 15,
    silver: 100,
    gold: 0,
    gems: 0,
    onlineCount: 1080
};

// 1. Первая страница (Лендинг)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'start.html'));
});

// 2. Вторая страница (Выбор языка)
app.get('/lang', (req, res) => {
    res.sendFile(path.join(__dirname, 'lang.html'));
});

// 3. Третья страница (Ввод ника и пароля)
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// 4. Четвертая страница (Интерфейс самой игры)
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API ЗАПРОСЫ ---

// Регистрация: принимает ник и обновляет его на сервере
app.post('/api/register', (req, res) => {
    const { username } = req.body;
    currentUser.username = username;
    currentUser.level = 1;
    currentUser.hp = 250;
    currentUser.silver = 1000;
    currentUser.gold = 5;
    res.json({ success: true });
});

// Отдача данных для шапки игры
app.get('/api/user-data', (req, res) => {
    res.json(currentUser);
});

app.listen(PORT, () => {
    console.log(`🎮 Игра "Варвары" запущена на http://localhost:${PORT}`);
});
