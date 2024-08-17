import {User} from "../../classes";


export const notification = async (userId:number):Promise<{table:string}>=>{
    let user = await new User().load(userId)
    return {table: await table(user)}
}

export async function schedule(userId:number):Promise<{table:string}>{
    let user = await new User().load(userId)
    user.settings.switchSchedule()
    return {table: await table(user)}
}

export async function replacement(userId:number):Promise<{table:string}>{
    let user = await new User().load(userId)
    user.settings.switchReplacement()
    return {table: await table(user)}
}

export async function duty(userId:number):Promise<{table:string}>{
    let user = await new User().load(userId)
    user.settings.switchDuty()
    return {table: await table(user)}
}

async function table(user:User):Promise<string>{
    return `
<tr><td colspan="2"><b class="profileB">Настройки уведомлений</b></td></tr>
<tr><td><b class="profileB">Появление нового расписания:</b></td><td style="min-width: 10vw"><button style="width: 100%;" onclick="updateSettingsSchedule()"><b class="profileB">${user.settings.schedule}</b></button></td></tr>
<tr><td><b class="profileB">Появление новых замен:</b></td><td style="min-width: 10vw"><button style="width: 100%;" onclick="updateSettingsReplacement()"><b class="profileB">${user.settings.replacement}</b></button></td></tr>
<tr><td><b class="profileB">Рассылка таблицы дежурных за неделю:</b></td><td style="min-width: 10vw"><button style="width: 100%;" onclick="updateSettingsDuty()"><b class="profileB">${user.settings.duty}</b></button></td></tr>
`
}