// app.js

window.currentHeroData = {
    // Основное (убрали имя комара и картинку)
    name: "Новый Варвар",
    level: 1,
    hp: 100,
    maxHp: 100,
    gold: 500, // Ваше серебро для тренировок
    rubies: 10,
    avatar: "", // Пока пусто, картинку добавим позже
    
    // Статус и клан
    clan: "Не состоит в клане",
    brotherhood: "Дом",
    fame: 0,
    status: "Новичок",
    
    // Все параметры изначально строго по 5 штук
    stats: {
        strength: 5,
        defense: 5,
        agility: 5,
        mastery: 5,
        vitality: 5
    },
    
    // Чистая стартовая статистика
    history: {
        friends: 0,
        wins: 0,
        losses: 0,
        lootedGold: 0,
        lostGold: 0,
        lootedRubies: 0,
        lostRubies: 0,
        raidMinutes: 0,
        gardenHours: 0,
        goblinsKilled: 0,
        militaryPower: 0
    }
};

// Расчет стоимости тренировки
window.getTrainPrice = function(currentStatValue) {
    return currentStatValue * 10; 
};

// Функция тренировки параметра
window.trainStat = function(statName) {
    let p = window.currentHeroData;
    let currentPrice = window.getTrainPrice(p.stats[statName]);

    if (p.gold >= currentPrice) {
        p.gold -= currentPrice; 
        p.stats[statName] += 1; 
        
        // Если качаем живучесть, то пропорционально увеличиваем здоровье
        if (statName === 'vitality') {
            p.maxHp = p.stats.vitality * 20;
            p.hp = p.maxHp; // Сразу восполняем до максимума
        }

        window.renderProfile();
    } else {
        alert("Недостаточно серебра для тренировки!");
    }
};

// Функция отрисовки данных на странице
window.renderProfile = function() {
    let p = window.currentHeroData;
    
    // Ресурсы
    document.getElementById("heroName").innerText = p.name;
    document.getElementById("heroLevel").innerText = p.level;
    document.getElementById("heroLevel2").innerText = p.level;
    document.getElementById("heroHp").innerText = `${p.hp} / ${p.maxHp}`;
    document.getElementById("heroGold").innerText = p.gold.toLocaleString('ru-RU');
    document.getElementById("heroRubies").innerText = p.rubies;
    
    // Клан-инфо
    document.getElementById("heroClan").innerText = p.clan;
    document.getElementById("heroBrotherhood").innerText = p.brotherhood;
    document.getElementById("heroFame").innerText = p.fame.toLocaleString('ru-RU');
    document.getElementById("heroStatus").innerText = p.status;

    // Параметры
    const statNames = ['strength', 'defense', 'agility', 'mastery', 'vitality'];
    statNames.forEach(name => {
        let value = p.stats[name];
        let price = window.getTrainPrice(value);
        
        document.getElementById("val_" + name).innerText = value;
        document.getElementById("price_" + name).innerText = `(Цена: ${price} 🪙)`;
    });

    // Статистика
    document.getElementById("histFriends").innerText = p.history.friends;
    document.getElementById("histWins").innerText = p.history.wins;
    document.getElementById("histLosses").innerText = p.history.losses;
    document.getElementById("histLootGold").innerText = p.history.lootedGold;
    document.getElementById("histLostGold").innerText = p.history.lostGold;
    document.getElementById("histLootRub").innerText = p.history.lootedRubies;
    document.getElementById("histLostRub").innerText = p.history.lostRubies;
    document.getElementById("histRaid").innerText = p.history.raidMinutes;
    document.getElementById("histGarden").innerText = p.history.gardenHours;
    document.getElementById("histGoblins").innerText = p.history.goblinsKilled;
    document.getElementById("histPower").innerText = p.history.militaryPower;
};

// Запуск при загрузке
document.addEventListener("DOMContentLoaded", () => {
    window.renderProfile();
});
