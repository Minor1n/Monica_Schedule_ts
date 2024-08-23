import {Bot} from "./classes";
import handlers from "./handlers";

export const bot = new Bot()

;(async () => {
    console.log('Дев мод: ',bot.devMode)
    await bot.addGradients();
    await bot.addUsers();
    await bot.addGroups();
    await bot.addReplacements()
    handlers.WebHandler(bot.devMode?__dirname.slice(0,-4):__dirname.slice(0,-5))
    handlers.CommandsHandler()
    handlers.CallbackQueryHandler()
    handlers.HearsHandler()
    handlers.CronHandler()
    bot.launchBot()
})();


