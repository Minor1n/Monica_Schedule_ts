import mysql from 'mysql';
import {config} from "./config";
const data = {
    host: config.SQLHOST,
    user: config.SQLUSER,
    database: config.SQLDATABASE,
    password: config.SQLPASSWORD,
}
console.log(data)
export type User = {
    groupName:string;
    userId:number;
    userName:string;
    payment:string;
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
            const connection = mysql.createConnection(data)
            return new Promise(async function (resolve,reject) {
                connection.query(`SELECT * FROM users WHERE userId = '${userId}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    console.log(result[0])
                    resolve(result[0]);
                })
            })
        },

        select_all: async ():Promise<User[]> => {
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
            connection.query(`INSERT INTO users (userId,userName,payment,name,refKey) values('${userId}','${userName}','${payment}','${name}','${refKey}')`)
        },

        update_payment: async function (id:number,payment:string) {
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET payment = '${payment}' WHERE userId = '${id}'`)
        },

        update_theme: async function (id:number,theme:string) {
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET theme = '${theme}' WHERE userId = '${id}'`)
        },

        update_duty: async function (id:number,duty:number) {
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET duty = '${duty}' WHERE userId = '${id}'`)
        },

        update_dutyDate: async function (id:number,dutyDate:number) {
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET dutyDate = '${dutyDate}' WHERE userId = '${id}'`)
        },

        update_name: async (id:number,name:string)=>{
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET name = '${name}' WHERE userId = '${id}'`)
        },

        update_refAgents: async (id:number,number:number)=>{
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET refAgents = '${number}' WHERE userId = '${id}'`)
        },

        update_group:  async (id:number,group:string)=>{
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET groupName = '${group}' WHERE userId = '${id}'`)
        },

        update_refKeyStatus: async (id:number,status:string)=>{
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET refKeyStatus = '${status}' WHERE userId = '${id}'`)
        },

        update_paidWhenever: async (id:number,status:string)=>{
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE users SET paidWhenever = '${status}' WHERE userId = '${id}'`)
        },

        settings:{

            update_schedule: async function (id:number,status:string) {
                const connection = mysql.createConnection(data)
                connection.query(`UPDATE users SET settingsSchedule = '${status}' WHERE userId = '${id}'`)
            },

            update_replacement: async function (id:number,status:string) {
                const connection = mysql.createConnection(data)
                connection.query(`UPDATE users SET settingsReplacement = '${status}' WHERE userId = '${id}'`)
            },

            update_duty: async function (id:number,status:string) {
                const connection = mysql.createConnection(data)
                connection.query(`UPDATE users SET settingsDuty = '${status}' WHERE userId = '${id}'`)
            },

        }

    },
    settings:{

        select: async (type:string):Promise<Settings> => {
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE settings SET value = '${value}' WHERE type = '${type}'`)
        },

        update_number: async (number:number,type:string)=>{
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE settings SET number = '${number}' WHERE type = '${type}'`)
        }

    },
    groups:{

        select_all: async ():Promise<Group[]>=>{
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE groups SET schedule = '${schedule}' WHERE name = '${groupName}'`)
        }

    },
    referral:{

        insert: async (agentId:number,userId:number,refKey:string)=>{
            const connection = mysql.createConnection(data)
            connection.query(`INSERT INTO referrals (agentId,userId,refKey) VALUES('${agentId}','${userId}','${refKey}')`)
        },

        select_by_user: async (userId:number):Promise<Referral>=>{
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
            connection.query(`UPDATE referrals SET status = '${status}' WHERE userId = '${userId}'`)
        }

    },
    replacement: {

        select_by_index: async (index:number):Promise<Replacement>=>{
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
            connection.query(`INSERT INTO replacements (link,date,html) VALUES('${link}','${date}','${html}')`)
        },

    },
    gradients: {

        select_all_gradients: async ():Promise<string[]>=>{
            const connection = mysql.createConnection(data)
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
            const connection = mysql.createConnection(data)
            return new Promise(async function (resolve,reject) {
                connection.query('SELECT * FROM replGradients', (err, result:Gradients[]) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result.map(x => x.css));
                })
            })
        },

    }
}