import {bot} from "../index";

export default async() => {
    const dueDate = ['31.01', '28.02', '31.03', '30.04', '31.05', '30.06', '31.07', '31.08', '30.09', '31.10', '30.11', '31.12'][new Date().getMonth()];
    bot.users.all
        .filter(user => user.payment.status === 1)
        .forEach(user => user.sendText(`Оплатите подписку до ${dueDate}, иначе будете отключены от бота`));
}