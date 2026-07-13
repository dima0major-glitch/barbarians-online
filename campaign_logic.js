/* ==========================================================================
   ЛОГИКА АВТО-ПОХОДОВ ДЛЯ МАКСИМУМ 360 МИНУТ В СУТКИ
   ========================================================================== */

let heroStats = JSON.parse(localStorage.getItem('hero_stats')) || { name: "Воин", silver: 1000, gold: 0, level: 1 };
let campState = JSON.parse(localStorage.getItem('campaign_state')) || {
    isEnRoute: false,
    returnTime: 0,
    lastDuration: 0,
    lastSilverReward: 0,
    lastGoldReward: 0,
    timeUsedToday: 0,
    lastResetDate: ""
};

function checkDailyReset() {
    const todayStr = new Date().toDateString();
    if (campState.lastResetDate !== todayStr) {
        campState.timeUsedToday = 0;
        campState.lastResetDate = todayStr;
        localStorage.setItem('campaign_state', JSON.stringify(campState));
    }
}

function updateCampaignUI() {
    checkDailyReset();
    const box = document.getElementById('campaign-logic-box');
    if (!box) return;

    const now = Date.now();
    const timeLeftToday = 360 - campState.timeUsedToday;

    if (campState.isEnRoute) {
        if (now >= campState.returnTime) {
            processCampaignEnd();
            return;
        }

        let secondsLeft = Math.ceil((campState.returnTime - now) / 1000);
        let displayMins = Math.floor(secondsLeft / 60);
        let displaySecs = secondsLeft % 60;
        if (displaySecs < 10) displaySecs = "0" + displaySecs;

        box.innerHTML = `
            <div style="font-weight: bold; color: #ffaa00; margin-bottom: 10px;">🛡️ Ваша дружина в походе!</div>
            <div>Ваш герой вернется через: <b style="color: #00ffcc;">${displayMins}:${displaySecs}</b></div>
            <div style="font-size: 11px; color: #6a8296; margin-top: 10px;">Вы собираете трофеи на землях врагов...</div>
        `;
        
        setTimeout(updateCampaignUI, 1000);
        return;
    }

    let lastResultHTML = "";
    if (campState.lastDuration > 0) {
        let goldText = campState.lastGoldReward > 0 ? `, <span style="color:#ffcc00;">👑 ${campState.lastGoldReward} зол.</span>` : "";
        lastResultHTML = `
            <div style="background: #0d1a26; padding: 6px; border: 1px dashed #1c354d; margin-bottom: 10px; text-align: left;">
                <b>Последний поход:</b><br>
                Ты был в походе ${campState.lastDuration} минут, награда: <span style="color:#ccc;">⚪ ${campState.lastSilverReward} сер.</span>${goldText}
            </div>
        `;
    }

    box.innerHTML = `
        ${lastResultHTML}
        <div style="margin-bottom: 12px; font-weight: bold;">
            Осталось времени на поход: <span style="color: #00ffcc;">${timeLeftToday} минут</span>
        </div>

        ${timeLeftToday <= 0 ? 
            `<div style="color: #ff4444; font-weight: bold;">Вы исчерпали суточный лимит в 360 минут! Возвращайтесь завтра.</div>` : 
            `<select id="camp-duration-select" class="norman-select">
                 ${timeLeftToday >= 10 ? '<option value="10">10 минут</option>' : ''}
                 ${timeLeftToday >= 30 ? '<option value="30">30 минут</option>' : ''}
                 ${timeLeftToday >= 60 ? '<option value="60">60 минут</option>' : ''}
             </select><br>
             <button onclick="startCampaignRequest()" class="btn-send">Отправить</button>`
        }
    `;
}

window.startCampaignRequest = function() {
    const select = document.getElementById('camp-duration-select');
    if (!select) return;

    const mins = parseInt(select.value);
    const timeLeftToday = 360 - campState.timeUsedToday;

    if (mins > timeLeftToday) {
        alert("У вас нет столько доступного времени на сегодня!");
        return;
    }

    /* 1 минута похода = 1 секунда реального времени для тестов. 
       Чтобы сделать реальные минуты, замени на: mins * 60 * 1000 */
    const durationInMs = mins * 1000; 

    campState.isEnRoute = true;
    campState.returnTime = Date.now() + durationInMs;
    campState.lastDuration = mins;
    campState.timeUsedToday += mins;

    localStorage.setItem('campaign_state', JSON.stringify(campState));
    updateCampaignUI();
};

function processCampaignEnd() {
    const mins = campState.lastDuration;

    let silverEarned = Math.floor(mins * 70 + Math.random() * 50);
    let goldEarned = 0;

    if (mins === 60) {
        if (Math.random() < 0.8) goldEarned = 1;
    } else if (mins === 30) {
        if (Math.random() < 0.3) goldEarned = 1;
    }

    heroStats.silver += silverEarned;
    heroStats.gold += goldEarned;

    campState.isEnRoute = false;
    campState.returnTime = 0;
    campState.lastSilverReward = silverEarned;
    campState.lastGoldReward = goldEarned;

    localStorage.setItem('hero_stats', JSON.stringify(heroStats));
    localStorage.setItem('campaign_state', JSON.stringify(campState));

    updateCampaignUI();
    if (typeof updateHeader === 'function') updateHeader();
}

updateCampaignUI();
