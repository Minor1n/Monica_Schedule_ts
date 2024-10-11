import {bot} from "@index";

interface IQuery{}

interface IResolve{
    authorId: number;
    authorName: string | undefined;
    users: number;
}

export default async (_:IQuery): Promise<IResolve[]> =>{
    return bot.mafiaSessions.games.map(session=>{
        return {
            authorId: session.sessionId,
            authorName: bot.users.getUser(session.sessionId)?.info.name,
            users: session.players.length
        }
    })
}