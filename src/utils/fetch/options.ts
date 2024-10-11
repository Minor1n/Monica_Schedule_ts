import config from "@config";
import User from "@classes/users/User";

export default async (user:User):Promise<{ links:string[], dates:string[] }>=>{
    const responseText = await (await fetch(config.fetchUrl)).text();
    const dateRegex = /<strong>[А-Яа-я0-9. ]+/g;
    const dateMatches = responseText.match(dateRegex) || ['DateArr not found','DateArr not found']

    const year = new Date().getFullYear();
    const linkRegex = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
    const links = Array.from(new Set(responseText.match(linkRegex))).map(link => link.slice(9, -1));

    if (!dateMatches) {
        user.sendText('DateArr not found');
    }

    const dates = <string[]> dateMatches.map(match => match.match(/[0-9]+.[0-9]+.[0-9]+/g)?.[0]).filter(Boolean);

    return {
        links,
        dates
    }
}