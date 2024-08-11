import {SQL} from "../sql";


export default async function (userId:number):Promise<{gradient:string}>{
    let user = await SQL.users.select(userId)
    let bgImage = user.theme
    let gradients = user.lightMode === 0 ? await SQL.gradients.select_all_gradients():await SQL.gradients.select_all_replGradients()
    let gradient = gradients[Math.floor(Math.random() * (gradients.length-1))]
    return {gradient: bgImage === 'standard' ? gradient.slice(11, -1):`url(${bgImage})`}
}