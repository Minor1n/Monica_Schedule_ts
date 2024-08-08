import {SQL, User} from "../sql";


export default async function (user:User){
    let group =  user.groupName,
        id = user.userId,
        surname = user.name,
        refKey = user.refKey,
        refNum = 0
    if(id === 1177837026||id === 6018898378){
        let referrals = await SQL.referral.select_by_agent(user.userId)
        for(let ref of referrals){
            let userRef = await SQL.users.select(ref.userId)
            if(ref.status === 'true' && userRef.paidWhenever === 'true'){
                refNum+=1
            }
        }
        await SQL.settings.update_number((36/100)*refNum*39.5,'agentCost')
    }
    let refBonus = id === 1177837026 || id === 6018898378 ? 38*refNum:6*user.refAgents
    let dutyDay = new Map()
        .set(1,'Понедельник')
        .set(2,'Вторник')
        .set(3,'Среда')
        .set(4,'Четверг')
        .set(5,'Пятница')
        .set(6,'Суббота')
        .set(-1,'Не задано')
    let groups = await SQL.groups.select_all()
    let arr = []
    for(let group of groups){
        if(group.name === user.groupName){
            arr.push(`<option selected value='${group.name}'>${group.name}</option>`)
        }
        else{
            arr.push(`<option value='${group.name}'>${group.name}</option>`)
        }
    }
    let arr3 = []
    for(let i=1;i<7;i++){
        if(i === user.scheduleDate){
            arr3.push(`<option selected value='${i}'>${dutyDay.get(i)}</option>`)
        }
        else{
            arr3.push(`<option value='${i}'>${dutyDay.get(i)}</option>`)
        }
    }
    return `
<tr><td colspan="2"><b>Информация</b></td><td><b>Настроить</b></td></tr>
<tr><td><b class="profileB">Группа:</b></td><td><b class="profileB">${group}</b></td><td><b class="profileB"><form name="myForm"><select class="selectP" name="selectGroup" id="selectGroup">${arr.join('')}</select></form>▼</b></td></tr>
<tr><td><b class="profileB">Имя:</b></td><td><b class="profileB">${surname}</b></td><td><b class="profileB">I</b><form name="myForm1"><input class="inputP" type="text" id="name" name="name" required/></form></td></tr>
<tr><td><b class="profileB">День дежурства:</b></td><td><b class="profileB">${dutyDay.get(user.scheduleDate)}</b></td><td><b class="profileB"><form name="myForm2"><select class="selectP" name="selectDutyDay" id="selectDutyDay">${arr3.join('')}</select></form>▼</b></td></tr>
<tr><td><b class="profileB">Телеграм id:</b></td><td><b class="profileB">${id}</b></td></tr>
<tr><td><b class="profileB">Статус оплаты:</b></td><td><b class="profileB">${user.payment === 'true' ? 'Оплачен' : user.payment === 'false' ? 'Не оплачен' : user.payment}</b></td></tr>
<tr><td><b class="profileB">Сумма оплаты с учетом рефералки:</b></td><td><b class="profileB">${Math.floor(user.price - (user.price * (refBonus / 100)))}р</b></td></tr>
<tr><td><b class="profileB">Реферальный ключ:</b></td><td><b class="profileB">${refKey}</b></td></tr>
<tr><td><b class="profileB">Бонус рефералов:</b></td><td><b class="profileB">${refBonus}%</b></td></tr>
<tr><td><b class="profileB">Связь с админом:</b></td><td><b class="profileB">@a_korop</b></td></tr>
<tr><td colspan="2"></td><td><button onclick="update()"><b class="profileB">Применить</b></button></td></tr>
`
}