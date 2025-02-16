import {bot} from "@index";
import User from "@classes/users/User";
import type IDuty from "@interfaces/IDuty";

export default class GroupDuty{
    private readonly groupName: string
    private _duties: IDuty[]
    private readonly _users: User[]
    constructor(groupName:string,users:User[],duties:IDuty[]) {
        this._duties = duties
        this.groupName = groupName
        this._users = users
    }
    getDuty(start:number,end:number):IDuty[]{
        return this._duties.filter(x=>x.date>start&&x.date<end)
    }
    insertDuty(date:number,userId:number,name:string){
        this._duties.push({group:this.groupName,date:date,user:userId,name:name})
        bot.connection.query(`INSERT INTO duty (\`group\`,\`date\`,\`user\`,\`name\`) values('${this.groupName}','${date}','${userId}','${name}')`)
    }
    generateHTML(page:number):string{
        const users = this._users;
        const scheduleByDay: string[][] = Array(6).fill(null).map(() => []);
        const dutiesByDay: string[][] = Array(6).fill(null).map(() => []);
        const topUsersByDay: string[][] = Array(6).fill(null).map(() => []);

        const resSchedule: string[] = [];
        const resDuty: string[] = [];
        const resTop: string[] = [];

        users.forEach(user => {
            if (user.duty.day !== -1) {
                scheduleByDay[user.duty.day - 1].push(user.info.name);
            }
        });

        users.sort((a, b) => b.duty.count - a.duty.count).forEach(user => {
            if (user.duty.day !== -1) {
                topUsersByDay[user.duty.day - 1].push(`${user.info.name}-${user.duty.count}`);
            }
        });

        const curr = new Date(Date.now() - 604800000 * page);
        const firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay()));
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);

        const duties = this.getDuty(firstDay.getTime(), lastDay.getTime());
        duties.forEach(duty => {
            const day = new Date(duty.date).getDay();
            if (day !== 0) dutiesByDay[day - 1].push(duty.name);
        });

        for (let i = 0; i < 5; i++) {
            const createRow = (array: string[][]) =>
                `<tr>${array.map(col => `<td><b>${col[i] || ''}</b></td>`).join('')}</tr>`;

            resSchedule.push(createRow(scheduleByDay));
            resDuty.push(createRow(dutiesByDay));
            resTop.push(createRow(topUsersByDay));
        }

        const formatDay = (offset: number) => {
            const date = new Date(firstDay.getTime() + 86400000 * offset);
            return `${date.getDate()}.${`0${date.getMonth() + 1}`.slice(-2)}`;
        };

        return `
<tr><td colspan="6"><b>Дежурные по расписанию</b></td></tr>
<tr><td><b>Понедельник</b></td><td><b>Вторник</b></td><td><b>Среда</b></td><td><b>Четверг</b></td><td><b>Пятница</b></td><td><b>Суббота</b></td></tr>
<tr><td colspan="6" class="line"></td></tr>
${resSchedule.join('')}
<tr><td colspan="6" class="line"></td></tr>
<tr><td colspan="6"><b>Отдежурили</b></td></tr>
<tr>
${[1, 2, 3, 4, 5, 6].map(offset => `<td><b>${formatDay(offset)}</b></td>`).join('')}
</tr>
<tr><td colspan="6" class="line"></td></tr>
${resDuty.join('')}
<tr><td colspan="6" class="line"></td></tr>
<tr><td colspan="6"><b>Количество дежурств</b></td></tr>
${resTop.join('')}
`;
    }
}