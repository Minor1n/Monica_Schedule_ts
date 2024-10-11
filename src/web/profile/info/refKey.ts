import {bot} from "@index";
import config from "@config";
import {payments} from "@utils";

interface IQuery {
    user:string;
    refKey:string;
}

interface IResolve{
    alert: string;
}

export default async (query:IQuery): Promise<IResolve> => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return {alert: config.notfoundMessagesSite.user};
    return {alert: await payments.setReferralKey(user, query.refKey)};
};