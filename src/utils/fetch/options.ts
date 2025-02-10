import config from "@config";
import User from "@classes/users/User";
import {getNextMondayAndTomorrow} from "@utils/utils";
import puppeteer from 'puppeteer';

export default async (user:User):Promise<{ links:string[], dates:string[] }>=>{
    let error = 'Ошибка не найдена';

    // const response = await axios.get(config.fetchUrl,{
    //     headers: {
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    //         'Referer': 'http://rgkript.ru/',
    //     },
    //     timeout: 30000
    // }).catch(e=> {
    //     error = `${e.name}\n\`\`\`${e.value}\`\`\``;
    // });
    //
    // if(!response || response.statusText !== 'OK'){
    //     if(!response){
    //         console.log(`Failed to fetch: ${error}`);
    //         user.sendText(`Failed to fetch: ${error}`);
    //     }else{
    //         console.log(`Failed to fetch: ${response.statusText}`);
    //         user.sendText(`Failed to fetch: ${response.statusText}`);
    //     }
    //     return {
    //         links: [],
    //         dates: [],
    //     }
    // }

    const responseText:string|null = await fetchPageContent(config.fetchUrl);

    if (!responseText) {
        user.sendText(`Failed to fetch: ${error}`);
        return {
            links: [],
            dates: [],
        }
    }

    const dateRegex = /<strong>[А-Яа-я0-9. ]+/g;
    const matches = responseText.match(dateRegex)?.slice(0,2)
    const getDates = getNextMondayAndTomorrow()
    console.log(matches)
    const datesMatches = <string[]> matches?.map(match => match.match(/[0-9]+.[0-9]+.[0-9]+/g)?.[0]).filter(Boolean);
    const dates = []
    dates.push(datesMatches.length!>0 ? datesMatches![0] : getDates[0])
    dates.push(datesMatches.length!>1 ? datesMatches![1] : getDates[1])

    const year = new Date().getFullYear();
    const linkRegex = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
    const links = Array.from(new Set(responseText.match(linkRegex))).map(link => link.slice(9, -1));

    if (!dates) {
        user.sendText('DateArr not found');
    }


    return {
        links,
        dates
    }
}

async function fetchPageContent(url: string) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

    try {
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });

        await page.waitForSelector('body', { timeout: 10000 });

        const content = await page.content();
        return content;
    } catch (error) {
        console.error('Ошибка при загрузке страницы:', error);
        return null;
    } finally {
        await browser.close();
    }
}