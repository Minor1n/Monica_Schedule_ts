import {SQL, User} from "../sql";
import {bot} from "../index";
import {config} from "../config";


export async function recount(){
    let users = await SQL.users.select_all()
    for(let user of users){
        let cost = user.price-((user.price/100)*(user.refAgents*6))
        if(user.payment === 1){
            await referral(user,'false')
            await bot.telegram.sendMessage(user.userId, `Вы заблокированы за неуплату(обратитесь к администратору или оплатите подписку <b>${Math.round(cost*2)}р</b>)\n🔗<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
        }else
        if(user.payment === 2){
            await referral(user,'false')
            await bot.telegram.sendMessage(user.userId, `Оплатите подписку <b>${Math.round(cost)}р</b>\nВы также можете оплатить подписку на несколько месяцев(${Math.round(cost*2)}р, ${Math.round(cost*3)}р, ${Math.round(cost*4)}р, ${Math.round(cost*5)}р, ${Math.round(cost*6)}р)\nПри оплате, в комментарии указывайте ваш id (id можно узнать введя команду /profile)\nПосле оплаты пропишите /paid для оповещения администрации об оплате\n<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>\n\nПри оплате за июнь вы получаете статус Оплачен на 3 месяца`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
        }else
        if(user.payment > 2){
            await bot.telegram.sendMessage(user.userId, `Ваш статус изменен на ${config.payment.get(user.payment-1)}`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
        }
        if(user.payment > 0){
            await SQL.users.update_payment(user.userId, user.payment-1)
        }
    }
}

export async function preAlert(){
    let dateArr = ['31.01','28.02','31.03','30.04','31.05','30.06','31.07','31.08','30.09','31.10','30.11','31.12']
    let date = dateArr[new Date().getMonth()]
    let users = await SQL.users.select_all()
    for(let user of users){
        if(user.payment === 1){
            await bot.telegram.sendMessage(user.userId, `Оплатите подписку до ${date}, иначе будете отключены от бота`).catch(e=>{console.log(e)})
            await alert(user)
        }
    }
}

export async function alert(user:User){
    if(user.payment === 1){
        let cost = user.price-((user.price/100)*(user.refAgents*6))
        await bot.telegram.sendMessage(user.userId, `Оплатите подписку <b>${Math.round(cost)}р</b>\nВы также можете оплатить подписку на несколько месяцев(${Math.round(cost*2)}р, ${Math.round(cost*3)}р, ${Math.round(cost*4)}р, ${Math.round(cost*5)}р, ${Math.round(cost*6)}р)\nПри оплате, в комментарии указывайте ваш id (id можно узнать введя команду /profile)\nПосле оплаты пропишите /paid для оповещения администрации об оплате\n<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>\n\nПри оплате за июнь вы получаете статус Оплачен на 3 месяца`, { parse_mode: 'HTML' }).catch(e=>{console.log(e)})
    }
}

export async function paid():Promise<{text:string,callback_data:string}[][]>{
    return new Promise(async function (resolve) {
        let users = await SQL.users.select_all()
        users.sort((a, b) => a.name.localeCompare(b.name))
        let usersKeyboard:{text:string,callback_data:string}[][] = [[]]
        let key = 0
        let key2 = 0
        for(let user of users){
            if(key % 5 === 0 && key !== 0){
                key2 +=1
                usersKeyboard.push([])
                usersKeyboard[key2].push({ text: user.name, callback_data: `userPaid${user.userId}` })
                key +=1
            }else{
                usersKeyboard[key2].push({ text: user.name, callback_data: `userPaid${user.userId}` })
                key +=1
            }
        }
        resolve(usersKeyboard)
    })
}

export async function referral(user:User,status:string){
    let referral = await SQL.referral.select_by_user(user.userId)
    let oldStatus = status ==='true'?"false":"true"
    if(referral){
        if(referral.status === oldStatus){
            let userAgent = await SQL.users.select(referral.agentId)
            let agents = status === 'true' ? userAgent.refAgents + 1 : userAgent.refAgents - 1
            await SQL.referral.update_status(user.userId,status)
            await SQL.users.update_refAgents(referral.agentId, agents)
        }
    }
}

export async function groupTG(groupTG:User):Promise<boolean>{
    if(groupTG.userId<0){
        let users = await SQL.users.select_all()
        let usersCount = groupTG.groupBots
        for(let user of users){
            if(user.userId!==groupTG.userId){
                if(-1<user.payment&&user.payment<2){
                    let member = await bot.telegram.getChatMember(groupTG.userId, user.userId)
                    if(member.status==='member'||member.status==='creator'||member.status==='administrator'){
                        usersCount+=1
                    }
                }
            }
        }
        return usersCount === Number(bot.telegram.getChatMembersCount(groupTG.userId));
    }else return true
}