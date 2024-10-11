import {bot} from "@index";
import config from "@config";

interface IQuery {
    user:string;
    months:string;
}

interface IResolve{
    alert: string;
}

export default (query:IQuery): IResolve => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return {alert: config.notfoundMessagesSite.user};
    const totalCost = Math.floor(
        config.paymentMessages.cost(user.info.id, user.payment.price, user.payment.referral.agentsApprove) +
        ((Number(query.months) - 1) * user.payment.price)
    );
    return {alert: `Сумма оплаты на ${Number(query.months)} месяцев: ${totalCost}`
};
};