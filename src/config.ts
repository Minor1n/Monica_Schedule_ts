import dotenv from "dotenv";

dotenv.config();

const {TOKEN, PASSWORD, SQLHOST, SQLUSER, SQLDATABASE, SQLPASSWORD, HTMLSTART1, HTMLSTART2, HTMLEND} = process.env;

if (!TOKEN||!PASSWORD||!SQLHOST||!SQLUSER||!SQLDATABASE||!SQLPASSWORD||!HTMLSTART1||!HTMLSTART2||!HTMLEND) {
    throw new Error("Missing environment variables");
}

let payment:Map<number,string> = new Map()
    .set(-1,'free')
    .set(0,'Не оплачен, функционал не доступен')
    .set(1,'Не оплачен, функционал частично доступен')
    .set(2,'Оплачен на 1 месяц')
    .set(3,'Оплачен на 2 месяца')
    .set(4,'Оплачен на 3 месяца')
    .set(5,'Оплачен на 4 месяца')
    .set(6,'Оплачен на 5 месяцев')
    .set(7,'Оплачен на 6 месяцев')
    .set(8,'Оплачен на 7 месяцев')
    .set(9,'Оплачен на 8 месяцев')
    .set(10,'Оплачен на 9 месяцев')
const puppeteer = { args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--headless', '--no-zygote', '--disable-gpu' ], headless: true, ignoreHTTPSErrors: true }

const paymentMessages ={
    refBonus:(id:number,agentsApprove:number):number=>{
        return id === 1177837026 || id === 6018898378 ? 40 * agentsApprove : agentsApprove>10 ? 100 : 10 * agentsApprove
    },
    cost:(id:number,price:number,agentsApprove:number):number=>{
        return price-((price/100)*(paymentMessages.refBonus(id,agentsApprove)))
    },
    standard:(cost:number,price:number):string=> {
        let arr = [
            `Оплатите подписку <b>${Math.round(cost)}р</b>`,
            `Вы также можете оплатить подписку на несколько месяцев(${Math.round(cost + price)}р, ${Math.round(cost + (price * 2))}р, ${Math.round(cost + (price * 3))}р, ${Math.round(cost + (price * 4))}р, ${Math.round(cost + (price * 5))}р)`,
            `При оплате, в комментарии указывайте ваш id (id можно узнать введя команду /profile)`,
            `После оплаты пропишите /paid для оповещения администрации об оплате`,
            `<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>`,
            ``,
            `При оплате за июнь вы получаете статус Оплачен на 3 месяца`
        ]
        return arr.join('\n')
    },
    ban:(price:number):string=>{
        let arr = [
            `Вы заблокированы за неуплату(обратитесь к администратору или оплатите подписку <b>${Math.round(price*2)}р</b>)`,
            `🔗<a href="https://www.tinkoff.ru/rm/korop.aleksandr4/KHtiD43274">ссылка для оплаты</a>`
        ]
        return arr.join('\n')
    },
    changeStatus:(status:number):string=>{
        return `Ваш статус изменен на ${payment.get(status)}`
    }
}

const fetchUrl = 'http://rgkript.ru/raspisanie-zanyatiy/'

export const config = {
    TOKEN, PASSWORD, SQLHOST, SQLUSER, SQLDATABASE, SQLPASSWORD, HTMLSTART1, HTMLSTART2, HTMLEND,
    puppeteer,
    payment,
    paymentMessages,
    fetchUrl
};