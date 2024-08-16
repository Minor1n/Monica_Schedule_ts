import {bot} from "../index";
import {config} from "../config";
import {User, Users} from "../classes/User";


export async function recount(){
    let users = await new Users().load()
    for(let user of users.all){
        let cost = user.payment.price-((user.payment.price/100)*(user.payment.referral.agentsApprove*6))
        if(user.payment.status === 1){
            await referral(user,'false')
            await bot.telegram.sendMessage(user.info.id, `Вы заблокированы за неуплату(обратитесь к администратору или оплатите подписку <b>${Math.round(cost*2)}р</b>)\n🔗<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
        }else
        if(user.payment.status === 2){
            await referral(user,'false')
            await bot.telegram.sendMessage(user.info.id, `Оплатите подписку <b>${Math.round(cost)}р</b>\nВы также можете оплатить подписку на несколько месяцев(${Math.round(cost*2)}р, ${Math.round(cost*3)}р, ${Math.round(cost*4)}р, ${Math.round(cost*5)}р, ${Math.round(cost*6)}р)\nПри оплате, в комментарии указывайте ваш id (id можно узнать введя команду /profile)\nПосле оплаты пропишите /paid для оповещения администрации об оплате\n<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>\n\nПри оплате за июнь вы получаете статус Оплачен на 3 месяца`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
        }else
        if(user.payment.status > 2){
            await bot.telegram.sendMessage(user.info.id, `Ваш статус изменен на ${config.payment.get(user.payment.status-1)}`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
        }
        if(user.payment.status > 0){
            user.payment.status += -1
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
        let cost = user.payment.price-((user.payment.price/100)*(user.payment.referral.agentsApprove*6))
        await bot.telegram.sendMessage(user.info.id, `Оплатите подписку <b>${Math.round(cost)}р</b>\nВы также можете оплатить подписку на несколько месяцев(${Math.round(cost*2)}р, ${Math.round(cost*3)}р, ${Math.round(cost*4)}р, ${Math.round(cost*5)}р, ${Math.round(cost*6)}р)\nПри оплате, в комментарии указывайте ваш id (id можно узнать введя команду /profile)\nПосле оплаты пропишите /paid для оповещения администрации об оплате\n<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>\n\nПри оплате за июнь вы получаете статус Оплачен на 3 месяца`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
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

export async function referral(user:User,status:'true'|'false'){
    let referral = user.payment.referral.user
    let oldStatus:'true'|'false' = status ==='true'?"false":"true"
    if(referral){
        if(referral.status === oldStatus){
            let userAgent = await new User().load(referral.agentId)
            let agents = status === 'true' ? userAgent.payment.referral.agentsApprove + 1 : userAgent.payment.referral.agentsApprove - 1
            user.payment.referral.setUserStatus(status)
            user.payment.referral.agentsApprove = agents
        }
    }
}

export async function groupTG(groupTG:User):Promise<boolean>{
    if(groupTG.info.id<0){
        let users = await new Users().load()
        let usersCount = groupTG.info.bots
        for(let user of users.all){
            if(user.info.id!==groupTG.info.id){
                if(-1<user.payment.status&&user.payment.status<2){
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

export async function refBonus(user:User){
    let refNum = 0
    if(user.info.id === 1177837026||user.info.id === 6018898378){
        let referrals = user.payment.referral.agents
        for(let ref of referrals){
            let userRef = await new User().load(ref.userId)
            if(ref.status === 'true' && userRef.payment.paid === 'true'){
                refNum+=1
            }
        }
    }
    return user.info.id === 1177837026 || user.info.id === 6018898378 ? 38*refNum:6*user.payment.referral.agentsApprove
}