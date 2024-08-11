import {SQL, User} from "../../sql";


export default async function (userId:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    return {table: await table(user)}
}

export async function bg(userId:number,url:string):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    try{
        url = url.match(/\.(jpeg|jpg|png)$/) != null?url:'standard'
    }catch (_){
        url = 'standard'
    }
    await SQL.users.update_theme(user.userId,url)
    return {table: await table(user)}
}

async function table(user:User):Promise<string>{
    return `
<tr><td colspan="4"><b class="profileB">Настройки темы</b></td></tr>
<tr><td><b class="profileB">Фон:</b></td><td><form name="myForm"><input class="inputP" type="url" id="theme" name="theme" required/></form></td><td><button onclick="updateSettingsTheme()"><b class="profileB">Применить</b></button></td><td><button onclick="updateSettingsThemeStandard()"><b class="profileB">По умолчанию</b></button></td></tr>
    `
}