<?php
// Подключаем настройки нашей базы данных
require_once 'db.php';

// Принимаем данные, которые игрок ввел в форму на сайте
$user = trim($_POST['username']);
$password = trim($_POST['password']);
$class = $_POST['char_class'];

if (empty($user) || empty($password)) {
    die("Имя воина и пароль не могут быть пустыми!");
}

// Автоматически создаем таблицу пользователей в базе данных, если её ещё нет
$create_table = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    char_class VARCHAR(20) NOT NULL,
    gold INT DEFAULT 100,
    level INT DEFAULT 1,
    hp INT DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
mysqli_query($link, $create_table);

// Проверяем, свободен ли логин воина
$check_user = mysqli_query($link, "SELECT id FROM users WHERE username = '".mysqli_real_escape_string($link, $user)."'");

if (mysqli_num_rows($check_user) > 0) {
    echo "<body style='background:#2b1105; color:#f4d0a3; font-family:monospace; padding:20px; text-align:center;'>";
    echo "<h2>🚫 Имя занято!</h2><p>Воин с именем <b>$user</b> уже пирует в Вальхалле. Придумайте другое имя.</p>";
    echo "<a href='../index.html' style='color:#d4af37;'>Вернуться назад</a>";
    echo "</body>";
} else {
    // Безопасно шифруем пароль
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Записываем нового персонажа в базу данных
    $sql = "INSERT INTO users (username, password, char_class) VALUES (
        '".mysqli_real_escape_string($link, $user)."', 
        '$hashed_password', 
        '".mysqli_real_escape_string($link, $class)."'"
    . ")";
    
    if (mysqli_query($link, $sql)) {
        echo "<body style='background:#2b1105; color:#f4d0a3; font-family:monospace; padding:20px; text-align:center;'>";
        echo "<h2>🎉 Персонаж успешно создан!</h2>";
        echo "<p>Добро пожаловать в игру, великий <b>$user</b>!</p>";
        echo "<p>Ваш класс: <b>$class</b>. Вам выдано 100 золотых монет на экипировку.</p>";
        echo "<p style='color:#d4af37;'>[В следующем шаге мы сделаем кнопку входа]</p>";
        echo "</body>";
    } else {
        echo "Ошибка создания персонажа: " . mysqli_error($link);
    }
}

mysqli_close($link);
?>
