import {readFileSync} from "node:fs";
import path from "node:path";


export async function profile(dirname:string):Promise<{body:string}>{
    return {body:readFileSync(path.join(dirname + '/html/profile.html'),'utf-8')}
}

export async function settings(dirname:string):Promise<{body:string}>{
    return {body:readFileSync(path.join(dirname + '/html/settings.html'),'utf-8')}
}

export async function home(dirname:string):Promise<{body:string}>{
    return {body:readFileSync(path.join(dirname + '/html/home.html'),'utf-8')}
}