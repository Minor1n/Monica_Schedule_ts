import {Context, Input} from "telegraf";
import {SQL} from "../sql";
import {config} from "../config";
import nodeHtmlToImage from "node-html-to-image";
import {Functions} from "../functions";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat.id)
        if(user){
            if(user.payment !== 'ban'){
                if(user.groupName !== 'null'){
                    let html = (await SQL.groups.select_schedule(user.groupName)).schedule
                    if(html !== 'null'){
                        let gradients = await SQL.gradients.select_all_gradients()
                        let htmlImg = user.theme === "standard" ? gradients[Math.floor(Math.random() * (gradients.length-1))] : `background-image: url(${user.theme});`
                        let image = await nodeHtmlToImage({
                            html: `${config.HTMLSTART1}${htmlImg}${config.HTMLSTART2}${html}${config.HTMLEND}`,
                            puppeteerArgs: config.PUPPETEER
                        })
                        // @ts-ignore
                        await ctx.replyWithPhoto(Input.fromBuffer(Buffer.from(image), `schedule.png`))
                        await Functions.payment.alert(user)
                    }else{await ctx.reply('Расписание еще не было сгенерировано')}
                }else{await ctx.reply('Выберите группу /setgroup')}
            }else{await ctx.reply('Вы заблокированы администратором')}
        }else{await ctx.reply('Зарегистрируйтесь в боте /start')}
    }
}