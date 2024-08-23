import type {User} from "../../../classes";
import {config} from "../../../config";
import {bot} from "../../../index";

export default (user: User): string => {
    const refBonus = config.paymentMessages.refBonus(user.info.id, user.payment.referral.agentsApprove);
    const dutyDays = new Map<number, string>([
        [1, 'Понедельник'],
        [2, 'Вторник'],
        [3, 'Среда'],
        [4, 'Четверг'],
        [5, 'Пятница'],
        [6, 'Суббота'],
        [-1, 'Не задано']
    ]);

    const groupOptions = Array.from(bot.groups.all.values())
        .map(group => `<option value='${group.name}' ${group.name === user.info.groupName ? 'selected' : ''}>${group.name}</option>`)
        .join('');

    const dutyDayOptions = Array.from(dutyDays.entries())
        .map(([key, value]) => `<option value='${key}' ${key === user.duty.day ? 'selected' : ''}>${value}</option>`)
        .join('');

    const paymentAmount = Math.floor(user.payment.price - (user.payment.price * (refBonus / 100)));

    return `
<tr class="fiveHeight" xmlns="http://www.w3.org/1999/html"><td colspan="2"><b class="profileB">Информация</b></td><td><b class="profileB">Настроить</b></td></tr>
<tr class="fiveHeight">
    <td><b class="profileB">Группа:</b></td>
    <td><b class="profileB">${user.info.groupName}</b></td>
    <td><b class="profileB">
        <form style="overflow: hidden; vertical-align: middle;" name="myForm">
            <img src="assets/images/pen.svg" alt="pen" style="width: 5vw; height: auto; padding-right: 1vw; float: right">
            <span style="overflow: hidden; height: 100%; vertical-align: middle; display: list-item;">
                <select style="width: 100%; display: list-item;font-size: 3vw;margin: 1vw" id="selectGroup" name="selectGroup" required/>${groupOptions}</select>
            </span>
        </form>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Имя:</b></td>
    <td><b class="profileB">${user.info.name}</b></td>
    <td><b class="profileB">
        <form style="overflow: hidden;" name="myForm1">
            <img src="assets/images/pen.svg" alt="pen" style="width: 5vw; height: auto; padding-right: 1vw; float: right">
            <span style="overflow: hidden; display: block"><input style="width: 100%; height: 100%" class="inputP" type="text" id="nameUpdate" name="nameUpdate" required/></span>
        </form>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">День дежурства:</b></td>
    <td><b class="profileB">${dutyDays.get(user.duty.day)}</b></td>
    <td><b class="profileB">
        <form style="overflow: hidden; vertical-align: middle;" name="myForm2">
            <img src="assets/images/pen.svg" alt="pen" style="width: 5vw; height: auto; padding-right: 1vw; float: right">
            <span style="overflow: hidden; height: 100%; vertical-align: middle; display: list-item;">
                <select style="width: 100%; display: list-item;font-size: 3vw;margin: 1vw" id="selectDutyDay" name="selectDutyDay" required/>${dutyDayOptions}</select>
            </span>
        </form>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Телеграм id:</b></td>
    <td><b class="profileB">${user.info.id}</b></td>
    <td><b class="profileB"><i>Указывайте в комментарии платежа</i></b></td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Статус оплаты:</b></td>
    <td><b class="profileB">${config.payment.get(user.payment.status)}</b></td>
    <td><b class="profileB">Расчитать сумму оплаты на несколько месяцев<br>
        <form style="overflow: hidden;" name="myForm4">
            <img src="assets/images/pen.svg" alt="pen" style="width: 5vw; height: auto; padding-right: 1vw; float: right">
            <span style="overflow: hidden; display: block"><input style="width: 100%;" class="inputP" type="text" id="monthPay" name="monthPay" required/></span>
        </form>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Сумма оплаты с учетом рефералки:</b></td>
    <td><b class="profileB">${paymentAmount}р</b></td>
    <td><b class="profileB"><a style="text-decoration: none" href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">Перейти на страницу оплаты</a></b></td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Реферальный ключ:</b></td>
    <td><b class="profileB">${user.payment.referral.key}</b></td>
    <td><b class="profileB">
        <form style="overflow: hidden;" name="myForm3">
            <img src="assets/images/pen.svg" alt="pen" style="width: 5vw; height: auto; padding-right: 1vw; float: right">
            <span style="overflow: hidden; display: block"><input style="width: 100%; height: 100%" class="inputP" type="text" id="refKey" name="refKey" required/></span>
        </form>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Бонус рефералов:</b></td>
    <td><b class="profileB">${refBonus}%</b></td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Связь с админом:</b></td>
    <td><b class="profileB">@a_korop</b></td>
</tr>
<tr class="fiveHeight">
    <td colspan="2"></td>
    <td><button onclick="update()">
        <img src="assets/images/drive.svg" alt="drive" style="width: 5vw; height: auto;">
    </button></td>
</tr>
`;
}