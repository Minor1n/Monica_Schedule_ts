import {bot} from "../../../index";
import {config} from "../../../config";
import payments from "../../../payments";


export default async (userId: number, refKey: string): Promise<string> => {
    const user = bot.users.getUser(userId);
    if (!user) return config.notfoundMessagesSite.user;
    return payments.setReferralKey(user, refKey);
};