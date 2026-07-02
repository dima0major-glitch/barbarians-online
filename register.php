<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = '://infinityfree.com'; 
$db_user = 'if0_42320957';
$db_pass = 'QBfOnNvy5oq';
$db_name = 'if0_42320957_game';

$link = mysqli_connect($host, $db_user, $db_pass, $db_name);
mysqli_set_charset($link, "utf8");

$user = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';
$class = isset($_POST['char_class']) ? $_POST['char_class'] : 'Викинг';

if (empty($user) || empty($password)) {
    die("Имя воина и пароль не могут быть пустыми!");
}

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

$user_safe = mysqli_real_escape_string($link, $user);
$check_user = mysqli_query($link, "SELECT id FROM users WHERE username = '$user_safe'");

if (mysqli_num_rows($check_user) > 0) {
    echo "<body style='background:#2b1105; color:#f4d0a3; font-family:monospace; padding:20px; text-align:center;'>";
    echo "<h2>🚫 Имя занято!</h2><p>Воин с именем <b>$user</b> уже пирует в Вальхалле.</p>";
    echo "<a href='index.html' style='color:#d4af37;'>Вернуться назад</a>";
    echo "</body>";
} else {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $class_safe = mysqli_real_escape_string($link, $class);
    
    $sql = "INSERT INTO users (username, password, char_class) VALUES ('$user_safe', '$hashed_password', '$class_safe')";
    
    if (mysqli_query($link, $sql)) {
        echo "<body style='background:#2b1105; color:#f4d0a3; font-family:monospace; padding:20px; text-align:center;'>";
        echo "<h2>🎉 Персонаж успешно создан!</h2>";
        echo "<p>Добро пожаловать в игру, великий <b>$user</b>!</p>";
        echo "<p>Ваш класс: <b>$class</b>. Вам выдано 100 золотых монет.</p>";
        echo "<p><a href='index.html' style='color:#d4af37;'>[ Теперь войдите через верхнюю форму ]</a></p>";
        echo "</body>";
    } else {
        echo "Ошибка создания персонажа: " . mysqli_error($link);
    }
}
mysqli_close($link);
?>
