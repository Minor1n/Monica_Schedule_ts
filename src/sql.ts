import mysql from 'mysql';
import {config} from "./config";
const data = {
    host: config.SQLHOST,
    user: config.SQLUSER,
    database: config.SQLDATABASE,
    password: config.SQLPASSWORD,
}
const connection = mysql.createPool(data);
export type User = {
    groupName:string;
    userId:number;
    userName:string;
    payment:number;
    price:number;
    name:string;
    role:string;
    duty:number;
    dutyDate:number;
    scheduleDate:number;
    settingsMeme:string;
    settingsSchedule:string;
    settingsReplacement:string;
    settingsDuty:string;
    theme:string;
    refKey:string;
    refAgents:number;
    refKeyStatus:string;
    paidWhenever:string;
    lightMode:number;
}
export type Settings = {
    type:string;
    value:string;
    number:number;
}
//:Promise<>
export type Group = {
    name:string;
    schedule:string;
    replacement:string;
    next:string;
}
export type Referral = {
    agentId:number;
    userId:number;
    refKey:string;
    status:string;
}
export type Replacement = {
    link:string;
    date:number;
    html:string;
}
export type Gradients = {
    css:string;
}
export const SQL= {
    users:{

        select: async (userId:number):Promise<User> => {
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM users WHERE userId = '${userId}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result[0]);
                })
            })
        },

        select_all_by_group: async (group:string):Promise<User[]> => {
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM users WHERE groupName = '${group}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        },

        select_all: async ():Promise<User[]> => {
            return new Promise(async function (resolve,reject) {
                connection.query('SELECT * FROM users', (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        },

        select_refAgents_by_refKey: async (refKey:string):Promise<User> => {
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM users WHERE refKey = '${refKey}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result[0]);
                })
            })
        },

        insert: async (userId:number,userName:string|undefined,payment:string,name:string|undefined,refKey:string) => {
            connection.query(`INSERT INTO users (userId,userName,payment,name,refKey) values('${userId}','${userName}','${payment}','${name}','${refKey}')`)
        },

        update_payment: async function (id:number,payment:number) {
            connection.query(`UPDATE users SET payment = '${payment}' WHERE userId = '${id}'`)
        },

        update_theme: async function (id:number,theme:string) {
            connection.query(`UPDATE users SET theme = '${theme}' WHERE userId = '${id}'`)
        },

        update_duty: async function (id:number,duty:number) {
            connection.query(`UPDATE users SET duty = '${duty}' WHERE userId = '${id}'`)
        },

        update_dutyDate: async function (id:number,dutyDate:number) {
            connection.query(`UPDATE users SET dutyDate = '${dutyDate}' WHERE userId = '${id}'`)
        },

        update_scheduleDate: async function (id:number,day:number) {
            connection.query(`UPDATE users SET scheduleDate = '${day}' WHERE userId = '${id}'`)
        },

        update_name: async (id:number,name:string)=>{
            connection.query(`UPDATE users SET name = '${name}' WHERE userId = '${id}'`)
        },

        update_refAgents: async (id:number,number:number)=>{
            connection.query(`UPDATE users SET refAgents = '${number}' WHERE userId = '${id}'`)
        },

        update_group:  async (id:number,group:string)=>{
            connection.query(`UPDATE users SET groupName = '${group}' WHERE userId = '${id}'`)
        },

        update_refKeyStatus: async (id:number,status:string)=>{
            connection.query(`UPDATE users SET refKeyStatus = '${status}' WHERE userId = '${id}'`)
        },

        update_paidWhenever: async (id:number,status:string)=>{
            connection.query(`UPDATE users SET paidWhenever = '${status}' WHERE userId = '${id}'`)
        },

        update_lightMode: async function (id:number,lightMode:0|1) {
            connection.query(`UPDATE users SET lightMode = '${lightMode}' WHERE userId = '${id}'`)
        },

        settings:{

            update_schedule: async function (id:number,status:string) {
                connection.query(`UPDATE users SET settingsSchedule = '${status}' WHERE userId = '${id}'`)
            },

            update_replacement: async function (id:number,status:string) {
                connection.query(`UPDATE users SET settingsReplacement = '${status}' WHERE userId = '${id}'`)
            },

            update_duty: async function (id:number,status:string) {
                connection.query(`UPDATE users SET settingsDuty = '${status}' WHERE userId = '${id}'`)
            },

        }

    },
    settings:{

        select: async (type:string):Promise<Settings> => {
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM settings WHERE type = '${type}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result[0]);
                })
            })
        },

        update_value: async (value:string,type:string)=>{
            connection.query(`UPDATE settings SET value = '${value}' WHERE type = '${type}'`)
        },

        update_number: async (number:number,type:string)=>{
            connection.query(`UPDATE settings SET number = '${number}' WHERE type = '${type}'`)
        }

    },
    groups:{

        select_all: async ():Promise<Group[]>=>{
            return new Promise(async function (resolve,reject) {
                connection.query('SELECT * FROM groups', (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        },

        select_schedule: async (groupName:string):Promise<Group>=>{
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM groups WHERE name = '${groupName}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result[0]);
                })
            })
        },

        update_schedule: async (groupName:string,schedule:string)=>{
            connection.query(`UPDATE groups SET schedule = '${schedule}' WHERE name = '${groupName}'`)
        }

    },
    referral:{

        insert: async (agentId:number,userId:number,refKey:string)=>{
            connection.query(`INSERT INTO referrals (agentId,userId,refKey) VALUES('${agentId}','${userId}','${refKey}')`)
        },

        select_by_user: async (userId:number):Promise<Referral>=>{
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM referrals WHERE userId = '${userId}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result[0]);
                })
            })
        },

        select_by_agent: async (agentId:number):Promise<Referral[]>=>{
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM referrals WHERE agentId = '${agentId}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        },

        update_status: async (userId:number,status:string)=>{
            connection.query(`UPDATE referrals SET status = '${status}' WHERE userId = '${userId}'`)
        }

    },
    replacement: {

        select_by_index: async (index:number):Promise<Replacement>=>{
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM replacements`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result[Number(result.length) - 1 - index]);
                })
            })
        },

        insert: async (link:string,date:number,html:string)=>{
            connection.query(`INSERT INTO replacements (link,date,html) VALUES('${link}','${date}','${html}')`)
        },

    },
    gradients: {

        select_all_gradients: async ():Promise<string[]>=>{
            return new Promise(async function (resolve,reject) {
                connection.query('SELECT * FROM gradients', (err, result:Gradients[]) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result.map(x => x.css));
                })
            })
        },

        select_all_replGradients: async ():Promise<string[]>=>{
            return new Promise(async function (resolve,reject) {
                connection.query('SELECT * FROM replGradients', (err, result:Gradients[]) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result.map(x => x.css));
                })
            })
        },

    },
    duty:{
        select: async (group:string,date:number,lastDate:number):Promise<{group:string,date:number,user:number,name:string}[]> => {
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM duty WHERE \`group\` = '${group}' AND date>${date} AND date<${lastDate}`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        },
        insert: async (group:string,date:number,userId:number,name:string) => {
            connection.query(`INSERT INTO duty (\`group\`,\`date\`,\`user\`,\`name\`) values('${group}','${date}','${userId}','${name}')`)
        },
    }
}