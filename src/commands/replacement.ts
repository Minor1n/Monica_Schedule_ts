import {Context, Input} from "telegraf";
import {bot} from "../index";
import nodeHtmlToImage from "node-html-to-image";
import {SQL} from "../sql";
import {Functions} from "../functions";
import {config} from "../config";


export async function execute(ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat?.id)
        if(user){
            if(user.payment !== 'ban'){
                let html = (await SQL.replacement.select_by_index(0)).html
                let replGradients = await SQL.gradients.select_all_replGradients()
                let htmlImg = user.theme === "standard" ? replGradients[Math.floor(Math.random() * (replGradients.length-1))] : `background-image: url(${user.theme});`
                let image = await nodeHtmlToImage({
                    html: `${config.HTMLSTART1}${htmlImg}${config.HTMLSTART2}${html}${config.HTMLEND}`,
                    puppeteerArgs: config.PUPPETEER
                })
                // @ts-ignore
                await ctx.replyWithPhoto(Input.fromBuffer(Buffer.from(image), `schedule.png`))
                await Functions.payment.alert(user)
            }else{await ctx.reply('Вы заблокированы администратором')}
        }else{await ctx.reply('Зарегистрируйтесь в боте /start')}
    }
}