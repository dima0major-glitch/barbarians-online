let player = null;
let currentBot = null;

const botNames = ["YRAZUDU", "Ragnar", "Floki", "Bjorn", "Torstein", "Harald", "Ivar", "Sigurd"];
const botAvatars = ["🧔", "🐺", "🐻", "🦅", "💀", "⚔️"];

document.addEventListener('DOMContentLoaded', () => {
    player = JSON.parse(localStorage.getItem('current_player'));
    const category = localStorage.getItem('arena_category') || 'equal';

    if (!player) {
        window.location.href = 'index.html';
        return;
    }

    const pStats = player.stats || { strength: 15, defense: 15, health: 100, level: 1 };
    
    if(player.username.toLowerCase().includes('комар')) {
        document.getElementById('pAvatar').innerText = "🪰";
    }

    document.getElementById('pName').innerText = player.username;
    document.getElementById('pStr').innerText = pStats.strength || 15;
    document.getElementById('pDef').innerText = pStats.defense || 15;
    document.getElementById('pHp').innerText = pStats.health || 100;

    generateBot(category, pStats);
});

function generateBot(category, pStats) {
    const randomName = botNames[Math.floor(Math.random() * botNames.length)];
    const randomAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];
    
    let bLevel = pStats.level || 15;
    let bStr = pStats.strength || 15;
    let bDef = pStats.defense || 15;
    let bHp = pStats.health || 100;

    if (category === 'junior') {
        bLevel = Math.max(1, bLevel - 3);
        bStr = Math.max(10, Math.floor(bStr * 0.7));
        bDef = Math.max(10, Math.floor(bDef * 0.7));
    } else if (category === 'senior') {
        bLevel += 3;
        bStr = Math.floor(bStr * 1.3);
        bDef = Math.floor(bDef * 1.3);
    } else if (category === 'boss') {
        bLevel += 10;
        bStr = Math.floor(bStr * 2.5);
        bDef = Math.floor(bDef * 2.5);
        bHp = Math.floor(bHp * 2);
    }

    currentBot = {
        name: randomName,
        avatar: randomAvatar,
        level: bLevel,
        strength: bStr,
        defense: bDef,
        health: bHp,
        exp: Math.floor(Math.random() * 2000) + 500,
        wins: Math.floor(Math.random() * 800) + 100,
        fame: Math.floor(Math.random() * 700) + 50
    };

    document.getElementById('bName').innerText = currentBot.name;
    document.getElementById('bAvatar').innerText = currentBot.avatar;
    document.getElementById('bStr').innerText = currentBot.strength;
    document.getElementById('bDef').innerText = currentBot.defense;
    document.getElementById('bHp').innerText = currentBot.health;

    document.getElementById('dLevel').innerText = currentBot.level;
    document.getElementById('dExp').innerText = currentBot.exp;
    document.getElementById('dWins').innerText = currentBot.wins;
    document.getElementById('dFame').innerText = currentBot.fame;
}

function executeBattle() {
    const pStats = player.stats || { strength: 15, defense: 15, health: 100 };
    
    // Скрываем блок старой подготовки, если он есть, или просто выводим под кнопкой
    const prepareBlock = document.getElementById('battlePrepareBlock');
    if (prepareBlock) prepareBlock.style.display = 'none';

    // Показываем блок результатов
    const resultBlock = document.getElementById('battleResultBlock');
    if (resultBlock) resultBlock.style.display = 'block';

    // Рассчитываем случайный урон сторон на основе силы
    const playerDamage = Math.floor(Math.random() * 500) + (pStats.strength * 100);
    const botDamage = Math.floor(Math.random() * 400) + (currentBot.strength * 80);

    let playerRemainingHp = Math.max(0, pStats.health - botDamage);
    let botRemainingHp = Math.max(0, currentBot.health - playerDamage);

    const resStatus = document.getElementById('resStatus');
    const pPower = (pStats.strength || 15) + (pStats.defense || 15);
    const bPower = currentBot.strength + currentBot.defense;

    // Условие победы по суммарной мощи
    if (pPower >= bPower) {
        if (resStatus) {
            resStatus.innerText = "🏆 ТЫ ПОБЕДИЛ!";
            resStatus.className = "win-text";
        }
        
        const goldWin = Math.floor(Math.random() * 10) + 5;
        const silverWin = Math.floor(Math.random() * 1500) + 500;
        
        player.stats.gold = (player.stats.gold || 0) + goldWin;
        player.stats.silver = (player.stats.silver || 0) + silverWin;
        savePlayerData();

        if (document.getElementById('resSilver')) {
            document.getElementById('resSilver').innerHTML = `🟡 +${goldWin} золота, 🪙 +${silverWin} серебра`;
        }
    } else {
        if (resStatus) {
            resStatus.innerText = "💀 ТЫ ПРОИГРАЛ!";
            resStatus.className = "lose-text";
        }
        if (document.getElementById('resSilver')) {
            document.getElementById('resSilver').innerText = "Награда отсутствует";
        }
    }

    // Заполняем строчки с уроном и остатком ХП на экране
    if (document.getElementById('resPlayerDmg')) document.getElementById('resPlayerDmg').innerText = `${player.username} нанес: ${playerDamage} урона`;
    if (document.getElementById('resBotDmg')) document.getElementById('resBotDmg').innerText = `${currentBot.name} нанес: ${botDamage} урона`;
    
    if (document.getElementById('resPlayerHp')) document.getElementById('resPlayerHp').innerText = `У тебя осталось здоровья: ${playerRemainingHp}`;
    if (document.getElementById('resBotHp')) document.getElementById('resBotHp').innerText = `У ${currentBot.name} осталось здоровья: ${botRemainingHp}`;
}

function savePlayerData() {
    localStorage.setItem('current_player', JSON.stringify(player));
    let allUsers = JSON.parse(localStorage.getItem('game_users')) || [];
    const userIndex = allUsers.findIndex(u => u.email === player.email);
    if (userIndex !== -1) {
        allUsers[userIndex] = player;
        localStorage.setItem('game_users', JSON.stringify(allUsers));
    }
}
