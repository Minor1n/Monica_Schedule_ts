import {readFileSync} from "node:fs";
import path from "node:path";
import {User} from "../classes/User";


export async function profile(dirname:string):Promise<{body:string}>{
    return {body:readFileSync(path.join(dirname + '/html/profile.html'),'utf-8')}
}

export async function settings(dirname:string):Promise<{body:string}>{
    return {body:readFileSync(path.join(dirname + '/html/settings.html'),'utf-8')}
}

export async function home(dirname:string,userId:number):Promise<{body:string}>{
    let user = await new User().load(userId)
    if(user&&user.payment.status!==0){
        return {body:readFileSync(path.join(dirname + '/html/home.html'),'utf-8')}
    }else{
        return {body:`<table><tr><td><b class="profileB">Вы заблокированы или еще не подключены к боту!</b></td></tr></table>`}
    }
}