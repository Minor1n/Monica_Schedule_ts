import {bot} from "../index";
import {HtmlToImage} from "../classes";

export default async() => {
    const gradient = bot.gradients.light;
    for (const group of bot.groups.all) {
        const html = group.duty.generateHTML(1);
        const image = await new HtmlToImage(gradient, html).getImage();
        await group.sendPhoto(image, 'duty.png', 'duty', true, html);
    }
}