import {config} from "../../config";
import {User,Groups} from "../../classes";


export const table = async(userId:number):Promise<{table:string}>=>{
    let user = await new User().load(userId)
    return {table: await tableGenerate(user)}
}

async function tableGenerate(user:User):Promise<string>{
    let refBonus = config.paymentMessages.refBonus(user.info.id,user.payment.referral.agentsApprove)
    let dutyDay = new Map()
        .set(1,'Понедельник')
        .set(2,'Вторник')
        .set(3,'Среда')
        .set(4,'Четверг')
        .set(5,'Пятница')
        .set(6,'Суббота')
        .set(-1,'Не задано')
    let groups = await new Groups().load()
    let arr = []
    for(let group of groups.all){
        if(group.name === user.info.groupName){
            arr.push(`<option selected value='${group.name}'>${group.name}</option>`)
        }
        else{
            arr.push(`<option value='${group.name}'>${group.name}</option>`)
        }
    }
    let arr3 = []
    for(let i=1;i<7;i++){
        if(i === user.duty.day){
            arr3.push(`<option selected value='${i}'>${dutyDay.get(i)}</option>`)
        }
        else{
            arr3.push(`<option value='${i}'>${dutyDay.get(i)}</option>`)
        }
    }
    return `
<tr><td colspan="2"><b class="profileB">Информация</b></td><td><b class="profileB">Настроить</b></td></tr>
<tr>
    <td><b class="profileB">Группа:</b></td>
    <td><b class="profileB">${user.info.groupName}</b></td>
    <td><b class="profileB"><form name="myForm">
        <select class="selectP" name="selectGroup" id="selectGroup">${arr.join('')}</select>
    </form>▼</b></td>
</tr>
<tr>
    <td><b class="profileB">Имя:</b></td>
    <td><b class="profileB">${user.info.name}</b></td>
    <td><b class="profileB">|</b><form name="myForm1">
        <input class="inputP" type="text" id="nameUpdate" name="nameUpdate" required/>
    </form></td>
</tr>
<tr>
    <td><b class="profileB">День дежурства:</b></td>
    <td><b class="profileB">${dutyDay.get(user.duty.day)}</b></td>
    <td><b class="profileB"><form name="myForm2">
        <select class="selectP" name="selectDutyDay" id="selectDutyDay">${arr3.join('')}</select>
    </form>▼</b></td>
</tr>
<tr>
    <td><b class="profileB">Телеграм id:</b></td>
    <td><b class="profileB">${user.info.id}</b></td>
    <td><b class="profileB"><i>Указывайте в коментарии платежа</i></b></td>
</tr>
<tr>
    <td><b class="profileB">Статус оплаты:</b></td>
    <td><b class="profileB">${config.payment.get(user.payment.status)}</b></td>
    <td><b class="profileB">Расчитать сумму оплаты на <br><form name="myForm4">|
        <input style="max-width: 6vw" class="inputP" type="text" id="monthPay" name="monthPay" required/>
    </form>месяцев</b></td>
</tr>
<tr>
    <td><b class="profileB">Сумма оплаты с учетом рефералки:</b></td>
    <td><b class="profileB">${Math.floor(user.payment.price - (user.payment.price * (refBonus / 100)))}р</b></td>
    <td><b class="profileB"><a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">Перейти на страницу оплаты</a></b></td>
</tr>
<tr>
    <td><b class="profileB">Реферальный ключ:</b></td>
    <td><b class="profileB">${user.payment.referral.key}</b></td>
    <td><b class="profileB">|</b><form name="myForm3">
        <input class="inputP" type="text" id="refKey" name="refKey" required/>
    </form></td>
</tr>
<tr>
    <td><b class="profileB">Бонус рефералов:</b></td>
    <td><b class="profileB">${refBonus}%</b></td>
</tr>
<tr>
    <td><b class="profileB">Связь с админом:</b></td>
    <td><b class="profileB">@a_korop</b></td>
</tr>
<tr>
    <td colspan="2"></td>
    <td><button onclick="update()"><b class="profileB">Применить</b></button></td>
</tr>
`
}