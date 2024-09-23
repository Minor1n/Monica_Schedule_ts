import {Bot} from "./classes";
import handlers from "./handlers";

export const bot = new Bot()

;(async () => {
    console.log('Дев мод: ',bot.devMode)
    await bot.addGradients();
    await bot.addUsers();
    await bot.addGroups();
    await bot.addReplacements()
    await bot.addMafiaSessions()
    handlers.WebHandler()
    handlers.CommandsHandler()
    handlers.CallbackQueryHandler()
    handlers.HearsHandler()
    handlers.CronHandler()
    bot.launchBot()
})();


