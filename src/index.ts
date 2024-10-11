import Bot from "@classes/Bot";
import WebHandler from "@handlers/WebHandler";
import CommandsHandler from "@handlers/CommandsHandler";
import CallbackQueryHandler from "@handlers/CallbackQueryHandler";
import HearsHandler from "@handlers/HearsHandler";
import CronHandler from "@handlers/CronHandler";

export const bot = new Bot()

;(async () => {
    console.log('Дев мод: ',bot.devMode)
    await bot.addGradients();
    await bot.addUsers();
    await bot.addGroups();
    await bot.addReplacements()
    await bot.addMafiaSessions()
    WebHandler()
    CommandsHandler()
    CallbackQueryHandler()
    HearsHandler()
    CronHandler()
    bot.launchBot()
})();


