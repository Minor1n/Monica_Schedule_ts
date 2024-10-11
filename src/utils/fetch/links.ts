import {fetchUtils} from "@utils";
import User from "@classes/users/User";


export default async (user:User): Promise<{ scheduleLinks: string[], replacementLinks: string[] }> =>{
    const {links} = await fetchUtils.options(user)

    const scheduleRegExp = new RegExp('.xls','g')
    const replacementRegExp = new RegExp('.doc|.pdf','g')

    const scheduleLinks:string[] = <string[]> links.map(link=> {
        if(link.match(scheduleRegExp)){
            return link
        }
    }).filter(Boolean)

    const replacementLinks:string[] = <string[]> links.map(link=> {
        if(link.match(replacementRegExp)){
            return link
        }
    }).filter(Boolean)

    return {
        scheduleLinks,
        replacementLinks
    }
}