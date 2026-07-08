// Инициализируем новые переменные в данных героя, если их еще нет в сохранении
if (typeof heroData.expeditionTimeUsed === 'undefined') heroData.expeditionTimeUsed = 0;
if (typeof heroData.lastExpeditionReset === 'undefined') heroData.lastExpeditionReset = new Date().toLocaleDateString();
if (typeof heroData.activeExpedition === 'undefined') heroData.activeExpedition = null;

// Функция для ежедневного сброса лимита времени (360 минут)
function checkDailyLimitReset() {
    let today = new Date().toLocaleDateString();
    if (heroData.lastExpeditionReset !== today) {
        heroData.expeditionTimeUsed = 0;
        heroData.lastExpeditionReset = today;
        save();
    }
}

// Функция отправки персонажа в поход (принимает минуты от 10 до 360)
window.startExpedition = function(minutes) {
    checkDailyLimitReset();

    // 1. Проверяем корректность введенного времени
    if (minutes < 10 || minutes > 360) {
        alert("Время похода должно быть от 10 до 360 минут!");
        return;
    }

    // 2. Проверяем суточный лимит игрока
    if (heroData.expeditionTimeUsed + minutes > 360) {
        let timeLeft = 360 - heroData.expeditionTimeUsed;
        alert(`Превышен суточный лимит! Сегодня вы можете пойти в поход максимум на ${timeLeft} мин.`);
        return;
    }

    // 3. Проверяем, не гуляет ли игрок в походе прямо сейчас
    if (heroData.activeExpedition) {
        alert("Вы уже находитесь в походе!");
        return;
    }

    // Запускаем поход: фиксируем время завершения в секундах
    let now = Math.floor(Date.now() / 1000);
    let durationSeconds = minutes * 60;

    heroData.activeExpedition = {
        endTime: now + durationSeconds,
        durationMinutes: minutes
    };
    
    heroData.expeditionTimeUsed += minutes;
    save();
    alert(`Вы отправились в поход на ${minutes} минут!`);
};

// Функция проверки завершения похода (автоматически выдает награду по таймеру)
window.checkExpeditionEnd = function() {
    if (!heroData.activeExpedition) return;

    let now = Math.floor(Date.now() / 1000);

    // Если время похода истекло
    if (now >= heroData.activeExpedition.endTime) {
        let mins = heroData.activeExpedition.durationMinutes;

        // РАСЧЕТ НАГРАДЫ:
        // Серебро (переменная gold в вашем коде): чем дольше поход, тем больше куш.
        // За каждые 10 минут даем рандомно от 500 до 1500 серебра (настройте под свой баланс).
        let silverReward = Math.floor((mins / 10) * (Math.floor(Math.random() * 1001) + 500)); 
        
        // Золото: строго 6 штук за максимальный поход на 360 минут.
        // За меньшее время рассчитывается пропорционально (например, за 60 минут — 1 золото).
        let goldReward = Math.floor((mins / 360) * 6); 

        // Начисляем ресурсы игроку (по скриншоту: серебро — ui-gold, золото — значок монеты рядом со славой)
        heroData.gold += silverReward;
        
        // Если у вас золото хранится в отдельной переменной (например, heroData.fame или heroData.crystals), 
        // замените 'fame' ниже на вашу переменную золота из верхнего бара:
        if (typeof heroData.fame !== 'undefined') {
            heroData.fame += goldReward; 
        }

        // Сбрасываем активный поход и сохраняем прогресс в localStorage
        heroData.activeExpedition = null;
        save();

        // Выводим игроку окно события о возвращении
        alert(`Событие: Вы успешно вернулись из похода!\nНайдено серебра: ${silverReward.toLocaleString('ru-RU')}\nНайдено золота: ${goldReward}`);
        
        // Обновляем интерфейс, чтобы новые цифры сразу отобразились на экране
        if (typeof updateUI === 'function') updateUI();
    }
};
