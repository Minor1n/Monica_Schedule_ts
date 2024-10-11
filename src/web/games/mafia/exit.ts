import {bot} from "@index";

interface IQuery{
    user:string;
}

interface IResolve{
    authorId: number;
    authorName: string | undefined;
    users: number;
}

export default async (query:IQuery): Promise<IResolve[]> =>{
    const session = bot.mafiaSessions.getSession(Number(query.user))
    if(session){
        session.players.forEach((player)=>{
            session.removePlayer(player.id)
        })
        bot.mafiaSessions.removeSession(session.sessionId)
    }
    return bot.mafiaSessions.games.map(session=>({
        authorId: session.sessionId,
        authorName: bot.users.getUser(session.sessionId)?.info.name,
        users: session.players.length
    }))
}