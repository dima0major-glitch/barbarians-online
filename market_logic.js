// ==========================================
// ЛОГИКА ТОРГОВОЙ ПЛОЩАДИ (MARKET)
// ==========================================
let currentTab = 'buy';

// Загрузка данных игрока и его рюкзака
let hero = JSON.parse(localStorage.getItem('hero_stats')) || { name: "Воин", level: 1, silver: 0 };
let backpack = JSON.parse(localStorage.getItem('user_backpack')) || [];
let marketLots = JSON.parse(localStorage.getItem('market_lots')) || [];

// Инициализация рынка и генерация стартовых лотов (если пусто)
function initMarket() {
    if (marketLots.length === 0) {
        generateSystemLots();
    }
    switchMarketTab(currentTab);
}

// Генерация случайных лотов от "ботов" для симуляции живого аукциона
function generateSystemLots() {
    const mockItems = [
        { id: "m1", name: "Топор Викинга", type: "weapon", stat: 8, level: 2, seller: "Торвальд" },
        { id: "m2", name: "Кожаный Доспех", type: "armor", stat: 12, level: 1, seller: "Гуннар" },
        { id: "m3", name: "Меч Одина", type: "weapon", stat: 15, level: 4, seller: "Харальд" },
        { id: "m4", name: "Щит Норманна", type: "armor", stat: 10, level: 2, seller: "Сигурд" }
    ];

    mockItems.forEach(item => {
        let randomPrice = Math.floor(item.stat * 120 + Math.random() * 500);
        marketLots.push({
            id: "lot_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
            itemName: item.name,
            type: item.type,
            statValue: item.stat,
            reqLevel: item.level,
            price: randomPrice,
            sellerName: item.seller,
            isSystem: true
        });
    });
    localStorage.setItem('market_lots', JSON.stringify(marketLots));
}

// Переключение вкладок (Купить / Продать)
window.switchMarketTab = function(tab) {
    currentTab = tab;
    const btnBuy = document.getElementById('tab-buy');
    const btnSell = document.getElementById('tab-sell');
    const container = document.getElementById('market-view');

    if (!container) return;

    if (tab === 'buy') {
        if (btnBuy) { btnBuy.style.color = "#ffaa00"; btnBuy.style.fontWeight = "bold"; }
        if (btnSell) { btnSell.style.color = "#8da9c4"; btnSell.style.fontWeight = "normal"; }
        renderBuyTab(container);
    } else {
        if (btnSell) { btnSell.style.color = "#ffaa00"; btnSell.style.fontWeight = "bold"; }
        if (btnBuy) { btnBuy.style.color = "#8da9c4"; btnBuy.style.fontWeight = "normal"; }
        renderSellTab(container);
    }
};

// Экран Покупки чужих лотов
function renderBuyTab(container) {
    if (marketLots.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:10px; color:#aaa;">На рынке пока нет товаров...</div>`;
        return;
    }

    let html = "";
    marketLots.forEach(lot => {
        let statLabel = lot.type === 'weapon' ? `Сила: +${lot.statValue}` : `Защита: +${lot.statValue}`;
        let levelColor = hero.level >= lot.reqLevel ? "#00ff00" : "#ff0000";

        html += `
            <div style="background: #222831; border: 1px solid #3a4454; padding: 6px; margin-bottom: 6px;">
                <span style="color: #8da9c4; font-weight: bold;">${lot.itemName}</span> 
                <span style="font-size: 11px; color: #ffaa00;">(${statLabel})</span><br>
                <span style="font-size: 11px;">Лвл: <b style="color: ${levelColor};">${lot.reqLevel}</b> | Продавец: <i>${lot.sellerName}</i></span><br>
                <div style="margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
                    <span>Цена: <b style="color: #d4af37;">${lot.price} сер.</b></span>
                    ${lot.sellerName === hero.name ? 
                        `<button onclick="cancelLot('${lot.id}')" style="background:#7a2222; color:#fff; border:1px solid #a33333; padding:2px 4px; font-size:11px; cursor:pointer;">Снять</button>` : 
                        `<button onclick="buyLot('${lot.id}')" style="background:#4a5768; color:#fff; border:1px solid #8da9c4; padding:2px 6px; font-size:11px; cursor:pointer;">Купить</button>`
                    }
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Экран Выставления своих вещей на продажу
function renderSellTab(container) {
    if (backpack.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:10px; color:#aaa;">Ваш рюкзак пуст. Нечего выставлять.</div>`;
        return;
    }

    let html = `<div style="font-size:11px; margin-bottom:6px; color:#aaa;">Выберите предмет из рюкзака для продажи:</div>`;
    backpack.forEach((item, index) => {
        let statLabel = item.type === 'weapon' ? `Сила: +${item.strength}` : `Защита: +${item.defense}`;
        let itemStat = item.type === 'weapon' ? item.strength : item.defense;

        html += `
            <div style="background: #333a42; border-left: 3px solid #8da9c4; padding: 5px; margin-bottom: 5px;">
                <b>${item.name}</b> <span style="font-size:11px; color:#ffaa00;">(${statLabel})</span><br>
                <span style="font-size:11px;">Требует лвл: ${item.level || 1}</span>
                <div style="margin-top: 4px;">
                    Цена: <input type="number" id="price-input-${index}" value="${itemStat * 150}" min="1" style="background:#1e232a; color:#fff; border:1px solid #57687f; width:70px; padding:1px; font-size:11px;">
                    <button onclick="createPlayerLot(${index})" style="background:#4a5768; color:#fff; border:1px solid #8da9c4; padding:1px 6px; font-size:11px; cursor:pointer;">Выставить</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Действие: Покупка лота
window.buyLot = function(lotId) {
    let index = marketLots.findIndex(l => l.id === lotId);
    if (index === -1) return;

    let lot = marketLots[index];

    if (hero.silver < lot.price) {
        alert("Недостаточно серебра для покупки товара!");
        return;
    }
    if (hero.level < lot.reqLevel) {
        alert("Ваш уровень слишком мал для этого снаряжения!");
        return;
    }

    hero.silver -= lot.price;
    
    let newItem = {
        name: lot.itemName,
        type: lot.type,
        strength: lot.type === 'weapon' ? lot.statValue : 0,
        defense: lot.type === 'armor' ? lot.statValue : 0,
        level: lot.reqLevel
    };

    backpack.push(newItem);
    marketLots.splice(index, 1);

    saveMarketData();
    switchMarketTab('buy');
    if (typeof updateHeader === 'function') updateHeader();
    alert(`Вы успешно купили ${lot.itemName}!`);
};

// Действие: Выставление своего предмета игроком
window.createPlayerLot = function(backpackIndex) {
    let item = backpack[backpackIndex];
    let priceInput = document.getElementById(`price-input-${backpackIndex}`);
    let price = parseInt(priceInput ? priceInput.value : 0);

    if (isNaN(price) || price <= 0) {
        alert("Укажите корректную стоимость товара!");
        return;
    }

    let itemStat = item.type === 'weapon' ? item.strength : item.defense;

    marketLots.push({
        id: "lot_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
        itemName: item.name,
        type: item.type,
        statValue: itemStat,
        reqLevel: item.level || 1,
        price: price,
        sellerName: hero.name,
        isSystem: false
    });

    backpack.splice(backpackIndex, 1);

    saveMarketData();
    switchMarketTab('buy');
};

// Действие: Отмена лота игроком (возврат вещи)
window.cancelLot = function(lotId) {
    let index = marketLots.findIndex(l => l.id === lotId);
    if (index === -1) return;

    let lot = marketLots[index];
    
    let newItem = {
        name: lot.itemName,
        type: lot.type,
        strength: lot.type === 'weapon' ? lot.statValue : 0,
        defense: lot.type === 'armor' ? lot.statValue : 0,
        level: lot.reqLevel
    };

    backpack.push(newItem);
    marketLots.splice(index, 1);

    saveMarketData();
    switchMarketTab('buy');
};

function saveMarketData() {
    localStorage.setItem('hero_stats', JSON.stringify(hero));
    localStorage.setItem('user_backpack', JSON.stringify(backpack));
    localStorage.setItem('market_lots', JSON.stringify(marketLots));
}

// Запуск при открытии страницы
initMarket();
