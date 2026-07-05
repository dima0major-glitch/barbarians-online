const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<h1>⚔️ Сервер Варваров успешно запущен! ⚔️</h1>');
});

app.listen(PORT, () => {
    console.log(`Сервер работает`);
});
