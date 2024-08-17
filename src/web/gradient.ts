import {gradients} from "../index";
import {User} from "../classes";


export const gradient = async(userId:number):Promise<{gradient:string}>=>{
    let user = await new User().load(userId)
    let bgImage = user.settings.theme
    let gradient = user.settings.lightMode === 0 ? gradients.light:gradients.dark
    return {gradient: bgImage === 'standard' ? gradient.slice(11, -1):`url(${bgImage})`}
}