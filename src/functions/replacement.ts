import {bot, gradients, users} from "../index";
import {fileType, GetFileData, HtmlToImage, Replacement, Replacements} from "../classes";


export async function regenerate(url: string, date: string): Promise<Replacement | 'notfound'> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Failed to fetch: ${response.statusText}`);
            return 'notfound';
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const typeFile: fileType = url.slice(-3) as fileType;
        const formattedDate = new Date(`${date.slice(-4)}-${date.slice(3, 5)}-${date.slice(0, 2)}`).getTime();
        return new Replacement({
            date: formattedDate,
            text: await new GetFileData(buffer, typeFile).getReplacementData(),
            link: url
        });
    } catch (error) {
        console.log(`Error during fetch or processing replacement: ${error}`);
        return 'notfound';
    }
}

export async function sender(replacement: Replacement | 'notfound') {
    if (replacement === 'notfound') {
        await bot.telegram.sendMessage(6018898378, 'Замены не найдены');
        return;
    }
    const replacements = await new Replacements().load();
    const oldReplacement = replacements.getReplacement(0);
    const html = await replacement.getHtml();
    if (html !== oldReplacement?.html) {
        try {
            replacements.insertReplacement(replacement.link, replacement.date, html);
            const gradient = gradients.dark;
            const image = await new HtmlToImage(gradient, html).getImage();

            await users.sendPhoto(image, `replacement.png`, 'replacement', true, html);
        } catch (error) {
            console.log(`Error during sending replacement: ${error}`);
        }
    }
}