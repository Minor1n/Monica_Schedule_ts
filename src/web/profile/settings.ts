import {User} from "../../classes";


export async function group(userId:number,groupName:string){
    let user = await new User().load(userId)
    user.info.groupName = decodeURI(groupName)
}

export async function dutyDay(userId:number,day:number){
    let user = await new User().load(userId)
    user.duty.day = day
}

export async function name(userId:number,userName:string){
    let user = await new User().load(userId)
    user.info.name = decodeURI(userName)
}