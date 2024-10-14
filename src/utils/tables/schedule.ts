import {bot} from "@index";
import HtmlToImage from "@classes/HtmlToImage";
import axios from "axios";


export default async(url: string): Promise<void> => {
    try {
        const response = await axios.get(url,{
            responseType:'arraybuffer',
        });
        if (response.statusText !== 'OK') {
            await bot.telegram.sendMessage(6018898378, 'Расписание не найдено');
            return;
        }

        const buffer:Buffer = Buffer.from(response.data);
        const groups = bot.groups.all;

        for (const group of groups) {
            if (group.users.length > 0) {
                await group.schedule.generateSchedule(buffer, url);

                const { html } = group.schedule;
                if (html && html !== 'null') {
                    try {
                        const gradient = bot.gradients.light;
                        const image = await new HtmlToImage(gradient, html).getImage();
                        await group.sendPhoto(image, `schedule.png`, 'schedule', true, html);
                    } catch (error) {
                        console.log(`Error while sending photo for group ${group.name}: ${error}`);
                    }
                }
            }
        }
    } catch (error) {
        console.log(`Error during processing: ${error}`);
        await bot.telegram.sendMessage(6018898378, 'Расписание не найдено');
    }
}