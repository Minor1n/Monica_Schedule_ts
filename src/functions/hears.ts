// import {Context} from "telegraf";
// import {SQL} from "../sql";
// import {bot} from "../index";
//
//
// export async function duty(ctx:Context){
//     if(ctx.chat?.id){
//         let author = await SQL.users.select(ctx.chat.id)
//         let date = new Date().getTime()
//         let day = new Date().getDay()
//         if(day !== 0 && author.payment !== "ban" && author.dutyDate + 43200000 <= date){
//             let duty = await SQL.duty.select(day)
//             let arr = [
//                 {num:1,user: duty[0].user1 === "null" ? author.name : duty[0].user1},
//                 {num:2,user: duty[0].user2 === "null" && duty[0].user1 !== "null" ? author.name : duty[0].user2},
//                 {num:3,user: duty[0].user3 === "null" && duty[0].user2 !== "null" ? author.name : duty[0].user3},
//                 {num:4,user: duty[0].user4 === "null" && duty[0].user3 !== "null" ? author.name : duty[0].user4},
//                 {num:5,user: duty[0].user5 === "null" && duty[0].user4 !== "null" ? author.name : duty[0].user5}
//             ]
//             let users = await SQL.users.select_all()
//             for(let i of arr) {
//                 await SQL.duty.update_user(day,i.user, i.num)
//             }
//             await SQL.users.update_duty(author.userId,author.duty+1)
//             await SQL.users.update_dutyDate(author.userId, date)
//             for(let user of users){
//                 if(user.role === "admin"||user.scheduleDate === duty[0].date){
//                     await bot.telegram.sendMessage(user.userId,`${author.name} отдежурил, если нет обратитесь к администратору`).catch(e=>{console.log(e)})
//                 }
//             }
//         }else{await bot.telegram.sendMessage(ctx.chat.id, 'Сегодня воскресенье, вы уже отдежурили или заблокированы').catch(e=>{console.log(e)});}
//     }
// }