import {bot} from "../index";
import {config} from "../config";
import {User, Users} from "../classes";


export async function recount(){
    let users = await new Users().load()
    for(let user of users.all){
        let cost = config.paymentMessages.cost(user.info.id,user.payment.price,user.payment.referral.agentsApprove)
        if(cost > 0){
            if(user.payment.status === 1){
                await bot.telegram.sendMessage(user.info.id, config.paymentMessages.ban(user.payment.price), { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
            }else
            if(user.payment.status === 2){
                await bot.telegram.sendMessage(user.info.id, config.paymentMessages.standard(cost,user.payment.price), { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
            }else
            if(user.payment.status > 2){
                await bot.telegram.sendMessage(user.info.id, config.paymentMessages.changeStatus(user.payment.status-1), { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
            }
            if(user.payment.status > 0){
                user.payment.status += -1
            }
        }
    }
}

export async function preAlert(){
    let dateArr = ['31.01','28.02','31.03','30.04','31.05','30.06','31.07','31.08','30.09','31.10','30.11','31.12']
    let date = dateArr[new Date().getMonth()]
    let users = await new Users().load()
    for(let user of users.all){
        if(user.payment.status === 1){
            await bot.telegram.sendMessage(user.info.id, `Оплатите подписку до ${date}, иначе будете отключены от бота`).catch(e=>{console.log(e)})
            await alert(user)
        }
    }
}

export async function alert(user:User){
    if(user.payment.status === 1){
        let cost = config.paymentMessages.cost(user.info.id,user.payment.price,user.payment.referral.agentsApprove)
        await bot.telegram.sendMessage(user.info.id, config.paymentMessages.standard(cost,user.payment.price), { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
    }
}

export async function paid():Promise<{text:string,callback_data:string}[][]>{
    return new Promise(async function (resolve) {
        let users = await new Users().load()
        users.all.sort((a, b) => a.info.name.localeCompare(b.info.name))
        let usersKeyboard:{text:string,callback_data:string}[][] = [[]]
        let key = 0
        let key2 = 0
        for(let user of users.all){
            if(key % 5 === 0 && key !== 0){
                key2 +=1
                usersKeyboard.push([])
                usersKeyboard[key2].push({ text: user.info.name, callback_data: `userPaid${user.info.id}` })
                key +=1
            }else{
                usersKeyboard[key2].push({ text: user.info.name, callback_data: `userPaid${user.info.id}` })
                key +=1
            }
        }
        resolve(usersKeyboard)
    })
}


export async function groupTG(groupTG:User):Promise<boolean>{
    if(groupTG.info.id<0){
        let users = await new Users().load()
        let usersCount = groupTG.info.bots
        for(let user of users.all){
            if(user.info.id!==groupTG.info.id){
                if(user.payment.status===-1||user.payment.status>2){
                    let member = await bot.telegram.getChatMember(groupTG.info.id, user.info.id)
                    if(member.status==='member'||member.status==='creator'||member.status==='administrator'){
                        usersCount+=1
                    }
                }
            }
        }
        return usersCount === Number(bot.telegram.getChatMembersCount(groupTG.info.id));
    }else return true
}