<?php
// Данные подключения к вашей базе данных InfinityFree
$host = '://infinityfree.com';
$db_user = 'if0_42320957';
$db_pass = 'QBfOnNvy5oq'; // Ваш пароль успешно добавлен сюда!
$db_name = 'if0_42320957_game';

// Создаем подключение к серверу
$link = mysqli_connect($host, $db_user, $db_pass, $db_name);

// Проверка на ошибку подключения
if (!$link) {
    die("Ошибка подключения к серверу магии: " . mysqli_connect_error());
}

// Настройка кодировки для корректного отображения русского языка
mysqli_set_charset($link, "utf8");
?>
