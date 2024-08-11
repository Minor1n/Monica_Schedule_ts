import {SQL} from "../../sql";


export async function group(userId:number,groupName:string){
    let user = await SQL.users.select(userId)
    await SQL.users.update_group(user.userId,decodeURI(groupName))
}

export async function dutyDay(userId:number,day:number){
    let user = await SQL.users.select(userId)
    await SQL.users.update_scheduleDate(user.userId,day)
}

export async function name(userId:number,userName:string){
    let user = await SQL.users.select(userId)
    await SQL.users.update_name(user.userId,decodeURI(userName))
}