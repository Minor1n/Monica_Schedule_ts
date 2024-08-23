import {bot} from "../index";
import {fileType, GetFileData, HtmlToImage, Replacement} from "../classes";


export default async(url: string, date: string): Promise<void> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Failed to fetch: ${response.statusText}`);
            await bot.telegram.sendMessage(6018898378, 'Замены не найдены');
            return;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const typeFile: fileType = url.slice(-3) as fileType;
        const formattedDate = new Date(`${date.slice(-4)}-${date.slice(3, 5)}-${date.slice(0, 2)}`).getTime();

        const replacement = new Replacement({
            date: formattedDate,
            text: await new GetFileData(buffer, typeFile).getReplacementData(),
            link: url,
        });

        const oldReplacement = bot.replacements.getReplacement(0);
        const html = await replacement.getHtml();

        if (html !== oldReplacement?.html) {
            bot.replacements.insertReplacement(replacement.link, replacement.date, html);

            const gradient = bot.gradients.dark;
            const image = await new HtmlToImage(gradient, html).getImage();

            await bot.users.sendPhoto(image, `replacement.png`, 'replacement', true, html);
        }

    } catch (error) {
        console.log(`Error during processing: ${error}`);
        await bot.telegram.sendMessage(6018898378, 'Замены не найдены');
    }
}