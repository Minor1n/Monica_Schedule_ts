import {bot} from "@index";
import config from "@config";

interface IQuery {
    user:string;
}

interface IResolve{
    name:string
    groupName:string
    duty:string
    payment:string
    refKey:string
    refBonus:string
    paymentAmount:string
    groupOptions:string
    dutyDayOptions:string
}

export default (query:IQuery): IResolve|void  => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return;
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

    return <IResolve>{
        name: user.info.name,
        groupName: user.info.groupName,
        duty: dutyDays.get(user.duty.day),
        payment: config.payment.get(user.payment.status),
        refKey: user.payment.referral.key,
        refBonus: String(refBonus),
        paymentAmount: String(paymentAmount),
        groupOptions: groupOptions,
        dutyDayOptions: dutyDayOptions
    }
}