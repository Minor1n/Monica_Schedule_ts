import {Context, Input} from "telegraf";
import {Functions} from "../functions";
import {User} from "../classes/User";
import {Group} from "../classes/Group";
import {gradients} from "../index";
import {HtmlToImage} from "../classes/HtmlToImage";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        if(user){
            if(user.payment.status !== 0){
                if(user.info.groupName !== 'null'){
                    let group = await new Group().load(user.info.groupName)
                    let html = group.schedule
                    if(html !== 'null'){
                        if(await Functions.payment.groupTG(user)){
                            let htmlImg = user.settings.theme === "standard" ? gradients.light : `background-image: url(${user.settings.theme});`
                            let image = await new HtmlToImage(htmlImg,html).getImage()
                            // @ts-ignore
                            await ctx.replyWithPhoto(Input.fromBuffer(Buffer.from(image), `schedule.png`))
                            await Functions.payment.alert(user)
                        }else {await ctx.reply('Не все участники группы оплатили подписку')}
                    }else{await ctx.reply('Расписание еще не было сгенерировано')}
                }else{await ctx.reply('Выберите группу /setgroup')}
            }else{await ctx.reply('Вы заблокированы администратором')}
        }else{await ctx.reply('Зарегистрируйтесь в боте /start')}
    }
}