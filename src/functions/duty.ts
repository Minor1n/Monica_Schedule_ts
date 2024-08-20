import {gradients,groups} from "../index";
import {HtmlToImage} from "../classes";

export async function sender() {
    const gradient = gradients.light;
    for (const group of groups.all) {
        const html = group.duty.generateHTML(0);
        const image = await new HtmlToImage(gradient, html).getImage();
        await group.sendPhoto(image, 'duty.png', 'duty', true, html);
    }
}