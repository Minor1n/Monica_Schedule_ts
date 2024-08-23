function updateSettingsNotificationSchedule() {
    fetchAndUpdate(`settings/notifications/schedule?user=${user}`, "settingsNotification");
}

function updateSettingsNotificationReplacement() {
    fetchAndUpdate(`settings/notifications/replacement?user=${user}`, "settingsNotification");
}

function updateSettingsNotificationDuty() {
    fetchAndUpdate(`settings/notifications/duty?user=${user}`, "settingsNotification");
}

async function updateSettingsThemeCustom() {
    const url = document.querySelector("input").value
    await fetch(`${u}/settings/theme/background?user=${user}&url=${url}`, {method: 'POST'})
    await fetchAndUpdate(`settings/theme/table?user=${user}`, "settingsTheme")
    updateBackground()
}

async function updateSettingsThemeStandard() {
    const url = 'standard'
    await fetch(`${u}/settings/theme/background?user=${user}&url=${url}`, {method: 'POST'})
    await fetchAndUpdate(`settings/theme/table?user=${user}`, "settingsTheme")
    updateBackground()
}

async function updateSettingsThemeLightMode() {
    await fetch(`${u}/settings/theme/lightMode?user=${user}`, {method: 'POST'})
    await fetchAndUpdate(`settings/theme/table?user=${user}`, "settingsTheme")
    updateBackground()
}