import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";

export default async(ctx: Context, data: string) => {
    const userId = ctx.from?.id;
    const groupName = data.slice(8);
    if(!userId)return;
    const user = bot.users.getUser(userId);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    user.info.groupName = groupName;
    await ctx.editMessageText(`Установлена группа: ${groupName}`);
}