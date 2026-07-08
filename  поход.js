// Инициализируем новые переменные в данных героя, если их нет в сохранении
if (typeof heroData.expeditionTimeUsed === 'undefined') heroData.expeditionTimeUsed = 0;
if (typeof heroData.lastExpeditionReset === 'undefined') heroData.lastExpeditionReset = new Date().toLocaleDateString();
if (typeof heroData.activeExpedition === 'undefined') heroData.activeExpedition = null;

// Функция для ежедневного сброса лимита времени (360 минут)
window.checkDailyLimitReset = function() {
    let today = new Date().toLocaleDateString();
    if (heroData.lastExpeditionReset !== today) {
        heroData.expeditionTimeUsed = 0;
        heroData.lastExpeditionReset = today;
        save();
    }
};

// Функция отправки персонажа в поход
window.startExpedition = function(minutes) {
    window.checkDailyLimitReset();

    if (minutes < 10 || minutes > 360) {
        alert("Время похода должно быть от 10 до 360 минут!");
        return;
    }

    if (heroData.expeditionTimeUsed + minutes > 360) {
        let timeLeft = 360 - heroData.expeditionTimeUsed;
        alert(`Превышен суточный лимит! Сегодня вы можете пойти в поход максимум на ${timeLeft} мин.`);
        return;
    }

    if (heroData.activeExpedition) {
        alert("Вы уже находитесь в походе!");
        return;
    }

    let now = Math.floor(Date.now() / 1000);
    heroData.activeExpedition = {
        endTime: now + (minutes * 60),
        durationMinutes: minutes
    };
    
    heroData.expeditionTimeUsed += minutes;
    save();
    alert(`Вы отправились в поход на ${minutes} минут!`);
};

// Функция автоматической проверки: вернулся ли персонаж из похода
window.checkExpeditionEnd = function() {
    if (!heroData.activeExpedition) return;

    let now = Math.floor(Date.now() / 1000);

    if (now >= heroData.activeExpedition.endTime) {
        let mins = heroData.activeExpedition.durationMinutes;

        // Расчет награды: серебро рандомно (зависит от минут), золото строго 6 за 360 минут
        let silverReward = Math.floor((mins / 10) * (Math.floor(Math.random() * 1001) + 500)); 
        let goldReward = Math.floor((mins / 360) * 6); 

        heroData.gold += silverReward;
        if (typeof heroData.fame !== 'undefined') { 
            heroData.fame += goldReward; 
        }

        heroData.activeExpedition = null;
        save();

        alert(`Событие: Вы успешно вернулись из похода!\nНайдено серебра: ${silverReward.toLocaleString('ru-RU')}\nНайдено золота: ${goldReward}`);
        
        if (typeof updateUI === 'function') updateUI();
    }
};
