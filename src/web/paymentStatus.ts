import {bot} from "@index";

interface IQuery {
    user: string;
}

interface IResolve {
    status: number;
}

export default (query:IQuery): IResolve => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return { status: 0 };

    return { status: user.payment.status };
};