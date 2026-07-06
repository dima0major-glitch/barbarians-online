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

    if (!player.stats) player.stats = {};
    if (player.stats.strength === undefined) player.stats.strength = 15;
    if (player.stats.defense === undefined) player.stats.defense = 15;
    if (player.stats.health === undefined) player.stats.health = 100;
    if (player.stats.energy === undefined) player.stats.energy = "3/3";

    document.getElementById('pName').innerText = player.username;
    document.getElementById('pStr').innerText = player.stats.strength;
    document.getElementById('pDef').innerText = player.stats.defense;
    document.getElementById('pHp').innerText = player.stats.health;

    if (player.username.toLowerCase().includes('комар')) {
        document.getElementById('pAvatar').innerText = "🪰";
    }

    generateBot(category, player.stats);
});

function generateBot(category, pStats) {
    const randomName = botNames[Math.floor(Math.random() * botNames.length)];
    const randomAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];
    
    let bLevel = pStats.level || 15;
    let bStr = pStats.strength;
    let bDef = pStats.defense;
    let bHp = pStats.health;

    // Сделали максимально простую и понятную проверку для всех кнопок
    if (category === 'junior') {
        bStr = Math.floor(bStr * 0.7);
        bDef = Math.floor(bDef * 0.7);
    } else if (category === 'senior') {
        bStr = Math.floor(bStr * 1.3);
        bDef = Math.floor(bDef * 1.3);
    } else if (category === 'mercenaries') {
        bStr = Math.floor(bStr * 1.1);
        bHp = Math.floor(bHp * 1.5);
    } else if (category === 'boss') {
        bStr = Math.floor(bStr * 2.5);
        bHp = Math.floor(bHp * 2);
    }

    currentBot = {
        name: randomName,
        avatar: randomAvatar,
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
    
    let currentEnergy = parseInt(player.stats.energy || "3/3");
    if (currentEnergy <= 0) {
        alert("❌ Закончились бои!");
        return;
    }

    // Тратим 1 бой
    currentEnergy--;
    player.stats.energy = currentEnergy + "/3";

    if (currentEnergy === 2) {
        localStorage.setItem('energy_timer_start', Date.now());
    }

    const report = document.getElementById('reportContent');
    const actionBtn = document.getElementById('actionBtn');

    const playerDamage = Math.floor(Math.random() * 400) + (player.stats.strength * 10);
    const botDamage = Math.floor(Math.random() * 300) + (currentBot.strength * 8);

    let pLeftHp = Math.max(0, player.stats.health - botDamage);
    let bLeftHp = Math.max(0, currentBot.health - playerDamage);

    let htmlResult = "";

    if (playerDamage >= botDamage) {
        htmlResult += `<span style="color:#00ff00; font-weight:bold; font-size:16px;">🏆 ТЫ ПОБЕДИЛ!</span><br><br>`;
        player.stats.gold = (player.stats.gold || 0) + 5;
        player.stats.silver = (player.stats.silver || 0) + 500;
    } else {
        htmlResult += `<span style="color:#ff4d4d; font-weight:bold; font-size:16px;">💀 ТЫ ПРОИГРАЛ!</span><br><br>`;
    }

    savePlayerData();

    htmlResult += `<b style="color:#fff;">Нанесенный урон:</b><br>`;
    htmlResult += `• ${player.username}: ${playerDamage}<br>`;
    htmlResult += `• ${currentBot.name}: ${botDamage}<br><br>`;

    htmlResult += `<b style="color:#fff;">Осталось здоровья:</b><br>`;
    htmlResult += `• ${player.username}: ${pLeftHp}<br>`;
    htmlResult += `• ${currentBot.name}: ${bLeftHp}`;

    report.innerHTML = htmlResult;

    actionBtn.innerText = "Назад";
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
