import {SQL, User} from "../../sql";


export default async function (userId:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    return {table: await table(user)}
}

export async function schedule(userId:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    let status = user.settingsSchedule==='on'?'off':'on'
    await SQL.users.settings.update_schedule(user.userId,status)
    user.settingsSchedule = status
    return {table: await table(user)}
}

export async function replacement(userId:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    let status = user.settingsReplacement==='on'?'off':'on'
    await SQL.users.settings.update_replacement(user.userId,status)
    user.settingsReplacement = status
    return {table: await table(user)}
}

export async function duty(userId:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    let status = user.settingsDuty==='on'?'off':'on'
    await SQL.users.settings.update_duty(user.userId,status)
    user.settingsDuty = status
    return {table: await table(user)}
}

async function table(user:User):Promise<string>{
    return `
<tr><td colspan="2"><b class="profileB">Настройки уведомлений</b></td></tr>
<tr><td><b class="profileB">Появление нового расписания:</b></td><td style="min-width: 10vw"><button style="width: 100%;" onclick="updateSettingsSchedule()"><b class="profileB">${user.settingsSchedule}</b></button></td></tr>
<tr><td><b class="profileB">Появление новых замен:</b></td><td style="min-width: 10vw"><button style="width: 100%;" onclick="updateSettingsReplacement()"><b class="profileB">${user.settingsReplacement}</b></button></td></tr>
<tr><td><b class="profileB">Рассылка таблицы дежурных за неделю:</b></td><td style="min-width: 10vw"><button style="width: 100%;" onclick="updateSettingsDuty()"><b class="profileB">${user.settingsDuty}</b></button></td></tr>
`
}