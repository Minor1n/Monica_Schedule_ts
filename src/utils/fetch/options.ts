import config from "@config";
import User from "@classes/users/User";
import axios from "axios";
import {getNextMondayAndTomorrow} from "@utils/utils";

export default async (user:User):Promise<{ links:string[], dates:string[] }>=>{
    let error = 'Ошибка не найдена';

    const response = await axios.get(config.fetchUrl,{
        timeout: 30000
    }).catch(e=> {
        error = `${e.name}\n\`\`\`${e.value}\`\`\``;
    });

    if(!response || response.statusText !== 'OK'){
        if(!response){
            console.log(`Failed to fetch: ${error}`);
            user.sendText(`Failed to fetch: ${error}`);
        }else{
            console.log(`Failed to fetch: ${response.statusText}`);
            user.sendText(`Failed to fetch: ${response.statusText}`);
        }
        return {
            links: [],
            dates: [],
        }
    }

    const responseText:string = response.data;

    const dateRegex = /<strong>[А-Яа-я0-9. ]+| [0-9]+\.[0-9]+\.[0-9]+/g;
    const matches = responseText.match(dateRegex)?.slice(0,2)
    const getDates = getNextMondayAndTomorrow()
    const dateMatches = []
    dateMatches.push(matches?.length!>0 ? matches![0] : getDates[0])
    dateMatches.push(matches?.length!>1 ? matches![1] : getDates[1])

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