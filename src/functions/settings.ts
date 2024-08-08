import {User} from "../sql";


export async function notification(user:User){
    return `
<tr><td colspan="2"><b class="profileB">Настройки уведомлений</b></td></tr>
<tr><td><b class="profileB">Появление нового расписания:</b></td><td style="min-width: 5vw"><button onclick="updateSettingsSchedule()"><b class="profileB">${user.settingsSchedule}</b></button></td></tr>
<tr><td><b class="profileB">Появление новых замен:</b></td><td style="min-width: 5vw"><button onclick="updateSettingsReplacement()"><b class="profileB">${user.settingsReplacement}</b></button></td></tr>
<tr><td><b class="profileB">Рассылка таблицы дежурных за неделю:</b></td><td style="min-width: 5vw"><button onclick="updateSettingsDuty()"><b class="profileB">${user.settingsDuty}</b></button></td></tr>
`
}