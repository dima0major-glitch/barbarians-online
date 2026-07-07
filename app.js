// app.js

// Стартовые данные вашего варвара
window.currentHeroData = {
    name: "Новый Варвар",
    level: 1,
    hp: 100,
    maxHp: 100,
    gold: 500, // Серебро для тренировок
    rubies: 10,
    
    clan: "Не состоит в клане",
    brotherhood: "Дом",
    fame: 0,
    status: "Новичок",
    
    // Все параметры строго по 5
    stats: {
        strength: 5,
        defense: 5,
        agility: 5,
        mastery: 5,
        vitality: 5
    }
};

// Стоимость тренировки: текущий уровень параметра умножить на 10
window.getTrainPrice = function(statValue) {
    return statValue * 10;
};

// Функция тренировки параметров
window.trainStat = function(statName) {
    let hero = window.currentHeroData;
    let price = window.getTrainPrice(hero.stats[statName]);

    if (hero.gold >= price) {
        hero.gold -= price; // Списываем серебро
        hero.stats[statName] += 1; // Добавляем +1 к параметру
        
        // Если тренируем Живучесть, увеличиваем максимальное здоровье
        if (statName === "vitality") {
            hero.maxHp = hero.stats.vitality * 20;
            hero.hp = hero.maxHp; // Восполняем HP до максимума
        }
        
        // Обновляем цифры на экране
        window.updateProfileUI();
    } else {
        alert("Недостаточно серебра для тренировки!");
    }
};

// Функция, которая берет данные из кода и вставляет их в HTML-теги
window.updateProfileUI = function() {
    let hero = window.currentHeroData;
    
    // Ресурсы в верхней панели
    document.getElementById("ui-level").innerText = hero.level;
    document.getElementById("ui-hp").innerText = hero.hp + " / " + hero.maxHp;
    document.getElementById("ui-gold").innerText = hero.gold;
    document.getElementById("ui-rubies").innerText = hero.rubies;
    
    // Текстовый блок статуса
    document.getElementById("ui-name").innerText = hero.name;
    document.getElementById("ui-clan").innerText = hero.clan;
    document.getElementById("ui-brotherhood").innerText = hero.brotherhood;
    document.getElementById("ui-fame").innerText = hero.fame;
    document.getElementById("ui-status").innerText = hero.status;
    
    // Список параметров и цены их прокачки
    let list = ["strength", "defense", "agility", "mastery", "vitality"];
    list.forEach(function(name) {
        let value = hero.stats[name];
        let price = window.getTrainPrice(value);
        
        document.getElementById("val-" + name).innerText = value;
        document.getElementById("price-" + name).innerText = "(Цена: " + price + ")";
    });
};

// Запуск отображения сразу при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    window.updateProfileUI();
});
