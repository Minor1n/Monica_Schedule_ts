import {bot} from "@index";
import {TrueFalseType} from "@types";

interface IQuery{
    user:string;
}

interface IResolve{
    role: string,
    isDeath: TrueFalseType,
    userName: string | undefined,
    userId: number
}

export default async (query:IQuery): Promise<IResolve[]> =>{
    const session = bot.mafiaSessions.getSession(Number(query.user))
    if(!session){
        return [];
    }
    return session.players.map(player=>({
        userId: player.id,
        userName: bot.users.getUser(player.id)?.info.name,
        role: player.role,
        isDeath: player.isDeath
    }))
}