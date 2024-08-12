import dotenv from "dotenv";

dotenv.config();

const {TOKEN, PASSWORD, SQLHOST, SQLUSER, SQLDATABASE, SQLPASSWORD, HTMLSTART1, HTMLSTART2, HTMLEND, PUPPETEER} = process.env;

if (!TOKEN||!PASSWORD||!SQLHOST||!SQLUSER||!SQLDATABASE||!SQLPASSWORD||!HTMLSTART1||!HTMLSTART2||!HTMLEND||!PUPPETEER) {
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

export const config = {
    TOKEN, PASSWORD, SQLHOST, SQLUSER, SQLDATABASE, SQLPASSWORD, HTMLSTART1, HTMLSTART2, HTMLEND,
    PUPPETEER: eval(`(${PUPPETEER})`),
    payment
};