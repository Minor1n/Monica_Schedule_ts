import {bot} from "../../../index";
import {config} from "../../../config";


export default (userId: number, months: number): string => {
    const user = bot.users.getUser(userId);
    if (!user) return config.notfoundMessagesSite.user;
    const totalCost = Math.floor(
        config.paymentMessages.cost(user.info.id, user.payment.price, user.payment.referral.agentsApprove) +
        ((months - 1) * user.payment.price)
    );
    return `Сумма оплаты на ${months} месяцев: ${totalCost}`;
};