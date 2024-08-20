import {Functions} from "../../functions";
import {config} from "../../config";
import {users} from "../../index";


export const group = (userId: number, groupName: string) => {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };
    user.info.groupName = decodeURI(groupName);
}

export const dutyDay = (userId: number, day: number) => {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };
    user.duty.day = day;
}

export const name = (userId: number, userName: string) => {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };
    user.info.name = decodeURI(userName);
}

export const refKey = async (userId: number, refKey: string): Promise<string> => {
    const user = users.getUser(userId);
    if (!user) return config.notfoundMessagesSite.user;
    return Functions.payment.setRefKey(user, refKey);
};

export const monthPay = (userId: number, months: number): string => {
    const user = users.getUser(userId);
    if (!user) return config.notfoundMessagesSite.user;
    const totalCost = Math.floor(
        config.paymentMessages.cost(user.info.id, user.payment.price, user.payment.referral.agentsApprove) +
        ((months - 1) * user.payment.price)
    );
    return `Сумма оплаты на ${months} месяцев: ${totalCost}`;
};