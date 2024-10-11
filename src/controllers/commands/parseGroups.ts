import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";
import ICommand from "@interfaces/ICommand";

export default {
    name: "parsegroups",
    execute: async function(ctx:Context){
        if (ctx.from?.id !== 6018898378) {
            await ctx.reply('Написано же ДЛЯ АДМИНОВ');
            return;
        }

        const responseText = await (await fetch(config.fetchUrl)).text();

        const year = new Date().getFullYear();
        const linkRegex = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
        const links = Array.from(new Set(responseText.match(linkRegex))).map(link => link.slice(9, -1));

        const newGroups =await bot.groups.parseGroups(links[0])
        await ctx.reply(newGroups)
    }
} satisfies ICommand;