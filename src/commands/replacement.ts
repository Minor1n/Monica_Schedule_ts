import {Context, Input} from "telegraf";
import {Functions} from "../functions";
import {User} from "../classes/User";
import {Replacements} from "../classes/Replacement";
import {gradients} from "../index";
import {HtmlToImage} from "../classes/HtmlToImage";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        if(user){
            if(user.payment.status !== 0){
                if(await Functions.payment.groupTG(user)){
                    let html = (await new Replacements().load()).getReplacement(0).html
                    if(!html)return
                    let htmlImg = user.settings.theme === "standard" ? gradients.dark : `background-image: url(${user.settings.theme});`
                    let image = await new HtmlToImage(htmlImg,html).getImage()
                    // @ts-ignore
                    await ctx.replyWithPhoto(Input.fromBuffer(Buffer.from(image), `schedule.png`))
                    await Functions.payment.alert(user)
                }else {await ctx.reply('Не все участники группы оплатили подписку')}
            }else{await ctx.reply('Вы заблокированы администратором')}
        }else{await ctx.reply('Зарегистрируйтесь в боте /start')}
    }
}