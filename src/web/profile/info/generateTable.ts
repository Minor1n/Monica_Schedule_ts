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
            <svg style="width: 5vw; height: auto; padding-right: 1vw; float: right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
            <svg style="width: 5vw; height: auto; padding-right: 1vw; float: right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span style="overflow: hidden; display: block"><input style="width: 100%; height: 100%" class="inputP" type="text" id="nameUpdate" name="nameUpdate" required/></span>
        </form>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">День дежурства:</b></td>
    <td><b class="profileB">${dutyDays.get(user.duty.day)}</b></td>
    <td><b class="profileB">
        <form style="overflow: hidden; vertical-align: middle;" name="myForm2">
            <svg style="width: 5vw; height: auto; padding-right: 1vw; float: right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
            <svg style="width: 5vw; height: auto; padding-right: 1vw; float: right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
            <svg style="width: 5vw; height: auto; padding-right: 1vw; float: right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
        <svg style="width: 5vw; height: auto;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6C4 4.89543 4.89543 4 6 4H12H14.1716C14.702 4 15.2107 4.21071 15.5858 4.58579L19.4142 8.41421C19.7893 8.78929 20 9.29799 20 9.82843V12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 4H13V7C13 7.55228 12.5523 8 12 8H9C8.44772 8 8 7.55228 8 7V4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V20H7V15Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button></td>
</tr>
`;
}