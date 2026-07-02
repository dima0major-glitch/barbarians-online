<?php
session_start();
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

if (empty($user) || empty($password)) {
    die("Заполните все поля воина!");
}

$user_safe = mysqli_real_escape_string($link, $user);
$result = mysqli_query($link, "SELECT * FROM users WHERE username = '$user_safe'");

if (mysqli_num_rows($result) == 1) {
    $player = mysqli_fetch_assoc($result);
    
    if (password_verify($password, $player['password'])) {
        $_SESSION['player_id'] = $player['id'];
        header("Location: game.php");
        exit();
    } else {
        echo "<body style='background:#2b1105; color:#f4d0a3; font-family:monospace; padding:20px; text-align:center;'>";
        echo "<h2>🚫 Неверный пароль!</h2><p>Топор соскользнул. Попробуйте еще раз.</p>";
        echo "<a href='index.html' style='color:#d4af37;'>Назад</a>";
        echo "</body>";
    }
} else {
    echo "<body style='background:#2b1105; color:#f4d0a3; font-family:monospace; padding:20px; text-align:center;'>";
    echo "<h2>🚫 Воин не найден!</h2><p>Такого имени нет в свитках.</p>";
    echo "<a href='index.html' style='color:#d4af37;'>Назад</a>";
    echo "</body>";
}

mysqli_close($link);
?>
