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

    updateHeader();
    
    // Часы
    setInterval(() => {
        const nowTime = new Date();
        if (document.getElementById('hdrTime')) {
            document.getElementById('hdrTime').innerText = nowTime.toTimeString().split(' ')[0];
        }
    }, 1000);

    generateBot(category, pStats);
});

function updateHeader() {
    if (!player || !player.stats) return;
    if (document.getElementById('hdrUser')) document.getElementById('hdrUser').innerText = player.username;
    if (document.getElementById('hdrLevel')) document.getElementById('hdrLevel').innerText = player.stats.level || 15;
    if (document.getElementById('hdrHp')) document.getElementById('hdrHp').innerText = player.stats.health || 100;
    if (document.getElementById('hdrMana')) document.getElementById('hdrMana').innerText = player.stats.mana || 0;
    if (document.getElementById('hdrSilver')) document.getElementById('hdrSilver').innerText = player.stats.silver || 0;
    if (document.getElementById('hdrDiamonds')) document.getElementById('hdrDiamonds').innerText = player.stats.diamonds || 0;
    if (document.getElementById('hdrGold')) document.getElementById('hdrGold').innerText = player.stats.gold || 0;
    if (document.getElementById('hdrEnergy')) document.getElementById('hdrEnergy').innerText = player.stats.energy || "3/3";
}

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
    } else if (category === 'mercenaries') {
        bLevel = bLevel;
        bStr = Math.floor(bStr * 1.1);
        bDef = Math.floor(bDef * 0.9);
        bHp = Math.floor(bHp * 1.5);
    } else if (category === 'boss') {
        bLevel += 10;
        bStr = Math.floor(bStr * 2.5);
        bDef = Math.floor(bDef * 2.5);
        bHp = Math.floor(bHp * 2);
    } else {
        bStr = Math.floor(bStr * (0.9 + Math.random() * 0.2));
        bDef = Math.floor(bDef * (0.9 + Math.random() * 0.2));
    }

    currentBot = {
        name: randomName,
        avatar: randomAvatar,
        level: bLevel,
        strength: bStr,
        defense: bDef,
        health: bHp
    };

    document.getElementById('bName').innerText = currentBot.name;
    document.getElementById('bAvatar').innerText = currentBot.avatar;
    document.getElementById('bStr').innerText = currentBot.strength;
    document.getElementById('bDef').innerText = currentBot.defense;
    document.getElementById('bHp').innerText = currentBot.health;
}

function executeBattle() {
    player = JSON.parse(localStorage.getItem('current_player'));
    if (!player.stats.energy) player.stats.energy = "3/3";

    // Безопасное чтение энергии
    let currentEnergy = parseInt(player.stats.energy);
    if (isNaN(currentEnergy)) currentEnergy = 3;

    if (currentEnergy <= 0) {
        alert("❌ Закончились бои! Подождите восстановления.");
        return;
    }

    // Тратим 1 бой
    currentEnergy--;
    player.stats.energy = currentEnergy + "/3";

    // Включаем таймер регенерации в памяти, если потратили первый бой
    if (currentEnergy === 2 && !localStorage.getItem('energy_timer_start')) {
        localStorage.setItem('energy_timer_start', Date.now());
    }
    
    savePlayerData();
    updateHeader();

    const report = document.getElementById('reportContent');
    const actionBtn = document.getElementById('actionBtn');

    const playerDamage = Math.floor(Math.random() * 400) + (player.stats.strength * 10);
    const botDamage = Math.floor(Math.random() * 300) + (currentBot.strength * 8);

    let pLeftHp = Math.max(0, player.stats.health - botDamage);
    let bLeftHp = Math.max(0, currentBot.health - playerDamage);

    let htmlResult = "";

    if (playerDamage >= botDamage) {
        htmlResult += `<span style="color:#00ff00; font-weight:bold; font-size:16px;">🏆 ТЫ ПОБЕДИЛ!</span><br>`;
        htmlResult += `<i>Причина: нанес больше суммарного урона.</i><br><br>`;
        
        const goldWin = Math.floor(Math.random() * 8) + 4;
        const silverWin = Math.floor(Math.random() * 1200) + 400;
        
        player.stats.gold = (player.stats.gold || 0) + goldWin;
        player.stats.silver = (player.stats.silver || 0) + silverWin;
        savePlayerData();
        updateHeader();

        htmlResult += `<b style="color:#ffcc00;">Награда:</b> 🟡 +${goldWin} золота, 🪙 +${silverWin} серебра.<br><br>`;
    } else {
        htmlResult += `<span style="color:#ff4d4d; font-weight:bold; font-size:16px;">💀 ТЫ ПРОИГРАЛ!</span><br><br>`;
    }

    htmlResult += `<b style="color:#fff;">Нанесенный урон:</b><br>`;
    htmlResult += `• ${player.username} нанес: ${playerDamage}<br>`;
    htmlResult += `• ${currentBot.name} нанес: ${botDamage}<br><br>`;

    htmlResult += `<b style="color:#fff;">Осталось здоровья:</b><br>`;
    htmlResult += `• ${player.username}: ${pLeftHp}<br>`;
    htmlResult += `• ${currentBot.name}: ${bLeftHp}`;

    report.innerHTML = htmlResult;

    actionBtn.innerText = "Назад к выбору лиг";
    actionBtn.style.background = "#142d40";
    actionBtn.onclick = () => { window.location.href = 'duel.html'; };
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
