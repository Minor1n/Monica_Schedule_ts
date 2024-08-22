import {User} from "../classes";
import {config} from "../config";
import {bot} from "../index";

export default async(user: User) => {
    if (user.payment.status === 1) {
        const cost = config.paymentMessages.cost(
            user.info.id,
            user.payment.price,
            user.payment.referral.agentsApprove
        );
        await bot.telegram.sendMessage(user.info.id, config.paymentMessages.standard(cost, user.payment.price), { parse_mode: 'HTML' }).catch(console.log);
    }
}