import {User} from "../../classes";
import {Functions} from "../../functions";
import {config} from "../../config";


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

export const refKey = async(userId:number,refKey:string):Promise<string>=>{
    let user = await new User().load(userId)
    return await Functions.payment.setRefKey(user,refKey)
}

export const monthPay = async (userId:number,months:number):Promise<string>=>{
    const user = await new User().load(userId)
    return `Сумма оплаты на ${months} месяцев: ${Math.floor(config.paymentMessages.cost(user.info.id, user.payment.price, user.payment.referral.agentsApprove)+((months-1)*user.payment.price))}`
}