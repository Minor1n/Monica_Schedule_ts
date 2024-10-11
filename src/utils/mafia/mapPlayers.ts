import MafiaPlayer from "@classes/games/MafiaPlayer";
import {bot} from "@index";


export default (players: MafiaPlayer[]) => players.map(player => ({
    userId: player.id,
    userName: String(bot.users.getUser(player.id)?.info.name),
    role: player.role,
    isDeath: player.isDeath
}));