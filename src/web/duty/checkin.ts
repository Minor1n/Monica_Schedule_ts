import {bot} from "@index";
import config from "@config";

interface IQuery{
    user:string;
}

interface IResolve{
    alert: string;
}

export default (query:IQuery): IResolve =>{
    const author = bot.users.getUser(Number(query.user));
    if (!author) return {alert:config.notfoundMessagesSite.user}

    const group = bot.groups.getGroup(author.info.groupName);
    if (!group) return {alert:config.notfoundMessagesSite.group}

    const currentDate = Date.now();
    const currentDay = new Date().getDay();

    if (currentDay !== 0 && author.payment.status !== 0 && (author.duty.lastDate + 43200000 <= currentDate)) {
        group.duty.insertDuty(currentDate, author.info.id, author.info.name);
        author.duty.count += 1;
        author.duty.lastDate = currentDate;
        const adminOrDutyUsers = group.users.filter(groupUser => (groupUser.info.role === "admin" || groupUser.duty.day === currentDay) && groupUser.info.groupName === author.info.groupName);
        for (const user of adminOrDutyUsers) {
            if(bot.devMode && user.info.id !== 6018898378)continue;
            user.sendText(`${author.info.name} отдежурил, если нет обратитесь к администратору`);
        }
        return {alert:'Успешно!'}
    } else {
        return  {alert:'Сегодня воскресенье, вы уже отдежурили или заблокированы'}
    }
}