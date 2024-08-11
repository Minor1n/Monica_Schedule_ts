import {SQL} from "../sql";


export default async function (userId:number):Promise<{gradient:string}>{
    let bgImage = (await SQL.users.select(userId)).theme
    let gradients = await SQL.gradients.select_all_gradients()
    let gradient = gradients[Math.floor(Math.random() * (gradients.length-1))]
    return {gradient: bgImage === 'standard' ? gradient.slice(11, -1):`url(${bgImage})`}
}