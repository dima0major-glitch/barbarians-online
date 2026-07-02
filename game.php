<?php
session_start();
if (!isset($_SESSION['player_id'])) {
    header("Location: index.html");
    exit();
}

$host = '://infinityfree.com'; 
$db_user = 'if0_42320957';
$db_pass = 'QBfOnNvy5oq';
$db_name = 'if0_42320957_game';

$link = mysqli_connect($host, $db_user, $db_pass, $db_name);
mysqli_set_charset($link, "utf8");

$player_id = $_SESSION['player_id'];
$result = mysqli_query($link, "SELECT * FROM users WHERE id = '$player_id'");
$player = mysqli_fetch_assoc($result);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель Воина</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <div class="wap-nav">
            ⚔️ <b><?php echo $player['username']; ?></b> [<?php echo $player['level']; ?> ур]
        </div>
        
        <div style="background:#501d06; padding:8px; border:1px dashed #d4af37; font-size:13px; margin-bottom:10px;">
            • Каста: <b><?php echo $player['char_class']; ?></b><br>
            • Здоровье: <span style="color:#ff6666;">❤️ <?php echo $player['hp']; ?>/100</span><br>
            • Золото: <span style="color:#d4af37;">💰 <?php echo $player['gold']; ?> монеты</span>
        </div>

        <div class="wap-nav">
            🎯 <b>ДОСТУПНЫЕ ДЕЙСТВИЯ</b>
        </div>
        
        <div style="font-size:14px; line-height: 20px; padding-left:5px;">
            ⏩ <a href="#" style="color:#fff; text-decoration:none;">🌲 Пойти в тёмный лес</a><br>
            ⏩ <a href="#" style="color:#fff; text-decoration:none;">🏟️ Выйти на арену боев</a><br>
            ⏩ <a href="#" style="color:#fff; text-decoration:none;">🛒 Лавка торговца</a>
        </div>

        <hr style="border:1px solid #501d06; margin:15px 0;">
        <center><a href="logout.php" style="color:#ff6666; font-size:12px;">[ Выйти из игры ]</a></center>
    </div>
</body>
</html>
<?php mysqli_close($link); ?>
