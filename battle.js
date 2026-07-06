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
    const actionBtn = document.getElementById('actionBtn');
    const pPower = (player.stats.strength || 15) + (player.stats.defense || 15);
    const bPower = currentBot.strength + currentBot.defense;

    if (pPower >= bPower) {
        const goldWin = Math.floor(Math.random() * 10) + 5;
        const silverWin = Math.floor(Math.random() * 1500) + 500;
        
        player.stats.gold = (player.stats.gold || 0) + goldWin;
        player.stats.silver = (player.stats.silver || 0) + silverWin;
        savePlayerData();

        alert(`🏆 ПОБЕДА!\nВы сокрушили воина ${currentBot.name}!\n\nНаграда:\n🟡 +${goldWin} золота\n🪙 +${silverWin} серебра`);
    } else {
        alert(`💀 ПОРАЖЕНИЕ!\nВоин ${currentBot.name} оказался сильнее и одолел вас на арене.`);
    }

    actionBtn.innerText = "Назад к арене";
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
