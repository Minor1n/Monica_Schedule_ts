import {Server, Socket} from "socket.io";
import type IMafiaPlayer from "@interfaces/IMafiaPlayer";
import {bot} from "@index";
import {mafia} from "@utils";


export default (io: Server, _socket: Socket, options: { newPlayers: IMafiaPlayer[], sessionId: number }) => {
    const session = bot.mafiaSessions.getSession(options.sessionId);
    if (!session) return;
    options.newPlayers.forEach(player=>{
        const sessionPlayer = session.getPlayer(player.userId)
        if(!sessionPlayer)return player
        sessionPlayer.role = player.role
        sessionPlayer.isDeath = player.isDeath
    })
    mafia.updatePlayersInfo(io, options.sessionId, options.newPlayers);
}