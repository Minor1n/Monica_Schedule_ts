import {User} from "../sql";


export async function notification(user:User){
    return `
<tr><td colspan="2"><b class="profileB">Настройки уведомлений</b></td></tr>
<tr><td><b class="profileB">Появление нового расписания:</b></td><td style="min-width: 10vw"><button onclick="updateSettingsSchedule()"><b class="profileB">${user.settingsSchedule}</b></button></td></tr>
<tr><td><b class="profileB">Появление новых замен:</b></td><td style="min-width: 10vw"><button onclick="updateSettingsReplacement()"><b class="profileB">${user.settingsReplacement}</b></button></td></tr>
<tr><td><b class="profileB">Рассылка таблицы дежурных за неделю:</b></td><td style="min-width: 10vw"><button onclick="updateSettingsDuty()"><b class="profileB">${user.settingsDuty}</b></button></td></tr>
`
}
export async function theme(user:User){
    return `
<tr><td colspan="3"><b class="profileB">Настройки темы</b></td></tr>
<tr><td><b class="profileB">BG image:</b></td><td style="min-width: 10vw"><form name="myForm"><input class="inputP" type="url" id="theme" name="theme" required/></form><button onclick="updateSettingsTheme()"><b class="profileB">Применить</b></button></td></tr>
    `
}