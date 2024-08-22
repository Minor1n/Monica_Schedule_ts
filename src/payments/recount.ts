import {bot} from "../index";
import {config} from "../config";

export default async()=>{
    for (const user of bot.users.all) {
        const cost = config.paymentMessages.cost(
            user.info.id,
            user.payment.price,
            user.payment.referral.agentsApprove
        );
        if (cost <= 0) continue;
        switch (user.payment.status) {
            case 1:
                user.sendText(config.paymentMessages.ban(user.payment.price));
                break;
            case 2:
                user.sendText(config.paymentMessages.standard(cost, user.payment.price));
                break;
            default:
                if (user.payment.status > 2) {
                    user.sendText(config.paymentMessages.changeStatus(user.payment.status - 1));
                }
                break;
        }
        if (user.payment.status > 0) {
            user.payment.status--;
        }
    }
}