import {gradients, bot, groups} from "../index";
import {Groups, HtmlToImage} from "../classes";

export async function regenerate(url: string): Promise<Groups | 'notfound'> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Failed to fetch: ${response.statusText}`);
            return 'notfound';
        }
        for (const group of groups.all) {
            if (group.users.length > 0) {
                console.log(`Generating schedule for group: ${group.name}`);
                await group.schedule.generateSchedule(response, url);
            }
        }
        return groups;
    } catch (error) {
        console.log(`Error during fetch or schedule generation: ${error}`);
        return 'notfound';
    }
}

export async function sender(groups: Groups | 'notfound') {
    if (groups === 'notfound') {
        await bot.telegram.sendMessage(6018898378, 'Расписание не найдено');
        return;
    }
    for (const group of groups.all) {
        const { name } = group;
        const { html } = group.schedule
        if (html && html !== 'null') {
            console.log(`Sending schedule for group: ${name}`);
            try {
                const gradient = gradients.light;
                const image = await new HtmlToImage(gradient, html).getImage();
                await group.sendPhoto(image, `schedule.png`, 'schedule', true, html);
            } catch (error) {
                console.log(`Error while sending photo for group ${name}: ${error}`);
            }
        }
    }
}