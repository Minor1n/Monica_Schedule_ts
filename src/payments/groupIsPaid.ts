import {User} from "../classes";
import {bot} from "../index";

export default async(groupTG:User):Promise<boolean> => {
    if (groupTG.info.id >= 0) return true;
    const totalMembers = await bot.telegram.getChatMembersCount(groupTG.info.id);
    let activeUsersCount = groupTG.info.bots;
    const userChecks = bot.users.all.map(async (user) => {
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