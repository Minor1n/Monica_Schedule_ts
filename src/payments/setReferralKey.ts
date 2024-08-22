import {User} from "../classes";
import {bot} from "../index";
import {config} from "../config";

export default async(user: User, refKey: string): Promise<string> => {
    if (!user) { return 'Зарегистрируйтесь в боте /start' }
    if (user.payment.paid !== 'false' || !user.payment.referral.user) {
        return 'Вы уже активировали реферальный ключ, либо оплачивали подписку ранее';
    }
    const agent = bot.users.getUserByRefKey(refKey)
    if (!agent) {
        return `Не найден реферальный агент для ключа: ${refKey}`;
    }
    if (user.info.id === agent.info.id) {
        return 'Вы не можете использовать свой же реферальный ключ';
    }
    user.payment.status += 1;
    agent.payment.referral.insertReferral(user.info.id);
    return `Успешно активирован реферальный ключ!\nВаш статус изменен на ${config.payment.get(user.payment.status)}`;
}