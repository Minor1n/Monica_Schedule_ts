let replacementPage = 0
let dutyPage = 0
let u = 'http://localhost:3000'
let tg = window.Telegram.WebApp;
let user = tg?.initDataUnsafe?.user?.id ? tg.initDataUnsafe.user.id: 6018898378//alert('Вы не можете использовать monica_schedule в браузере')

function updateBackground() {
    fetch(`${u}/gradient?user=${user}`)
        .then(req => req.json())
        .then(res => {
            document.body.style.backgroundImage = res.gradient;
        })
        .catch(err => console.error('Ошибка при обновлении фона:', err));
}

async function fetchAndUpdate(url, elementId = null) {
    try {
        const response = await fetch(`${u}/${url}`);
        if (!response.ok) return console.error('Network response was not ok');
        const data = await response.json();
        if (elementId) {
            document.getElementById(elementId).innerHTML = `<table>${data.table}</table>`;
        } else {
            let newScript = document.createElement("script");
            newScript.src = `scripts/${url.split('?')[0]}.js`;
            document.body.innerHTML = data.body;
            document.body.appendChild(newScript);
        }
    } catch (error) {
        console.error(`Ошибка при обновлении данных для ${url}:`, error);
    }
}

async function profile() {
    await fetchAndUpdate(`profile`)
    await Promise.all([
        fetchAndUpdate(`profile/info/table?user=${user}`, "profile")
    ])
}

async function settings() {
    await fetchAndUpdate(`settings`)
    await Promise.all([
        fetchAndUpdate(`settings/notifications/table?user=${user}`, "settingsNotification"),
        fetchAndUpdate(`settings/theme/table?user=${user}`, "settingsTheme")
    ]);
}

async function home() {
    await fetchAndUpdate(`home?user=${user}`);
    await Promise.all([
        fetchAndUpdate(`home/schedule/table?user=${user}`, "schedule"),
        fetchAndUpdate(`home/replacement/table?page=${replacementPage}`, "replacement"),
        fetchAndUpdate(`home/schedule/select?user=${user}`, "selectGroup")
    ]);
}

async function duty(){
    await fetchAndUpdate(`duty?user=${user}`);
    await Promise.all([
        fetchAndUpdate(`duty/table?user=${user}&page=${dutyPage}`, "duty")
    ])
}

window.onload = () => {
    updateBackground();
    home();
};