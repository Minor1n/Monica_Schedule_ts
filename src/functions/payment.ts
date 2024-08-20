import {bot, users} from "../index";
import {config} from "../config";
import {User} from "../classes";


export async function recount(){
    for (const user of users.all) {
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

export async function preAlert() {
    const dueDate = ['31.01', '28.02', '31.03', '30.04', '31.05', '30.06', '31.07', '31.08', '30.09', '31.10', '30.11', '31.12'][new Date().getMonth()];
    users.all
        .filter(user => user.payment.status === 1)
        .forEach(user => user.sendText(`Оплатите подписку до ${dueDate}, иначе будете отключены от бота`));
}

export async function alert(user: User) {
    if (user.payment.status === 1) {
        const cost = config.paymentMessages.cost(
            user.info.id,
            user.payment.price,
            user.payment.referral.agentsApprove
        );
        await bot.telegram.sendMessage(user.info.id, config.paymentMessages.standard(cost, user.payment.price), { parse_mode: 'HTML' }).catch(console.log);
    }
}

export async function paid(): Promise<{ text: string; callback_data: string }[][]> {
    const sortedUsers = users.all.sort((a, b) => a.info.name.localeCompare(b.info.name));
    const usersKeyboard: { text: string; callback_data: string }[][] = [];
    sortedUsers.forEach((user, index) => {
        if (index % 5 === 0) usersKeyboard.push([]);
        usersKeyboard[usersKeyboard.length - 1].push({ text: user.info.name, callback_data: `userPaid${user.info.id}` });
    });
    return usersKeyboard;
}

export async function groupTG(groupTG:User):Promise<boolean>{
    if (groupTG.info.id >= 0) return true;
    const totalMembers = await bot.telegram.getChatMembersCount(groupTG.info.id);
    let activeUsersCount = groupTG.info.bots;
    const userChecks = users.all.map(async (user) => {
        if (user.info.id !== groupTG.info.id && (user.payment.status === -1 || user.payment.status > 2)) {
            const member = await bot.telegram.getChatMember(groupTG.info.id, user.info.id);
            if (['member', 'creator', 'administrator'].includes(member.status)) {
                activeUsersCount += 1;
            }
        }
    });
    await Promise.all(userChecks);
    return activeUsersCount === totalMembers;
}

export async function setRefKey(user: User, refKey: string): Promise<string> {
    if (!user) { return 'Зарегистрируйтесь в боте /start' }
    if (user.payment.paid !== 'false' || !user.payment.referral.user) {
        return 'Вы уже активировали реферальный ключ, либо оплачивали подписку ранее';
    }
    const agent = users.getUserByRefKey(refKey)
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