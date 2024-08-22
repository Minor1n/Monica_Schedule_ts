import {Bot} from "./classes";
import handlers from "./handlers";

export const bot = new Bot()

;(async () => {
    await bot.addGradients();
    await bot.addUsers();
    await bot.addGroups();
    handlers.WebHandler(__dirname)
    handlers.CommandsHandler()
    handlers.CallbackQueryHandler()
    handlers.HearsHandler()
    handlers.CronHandler()
    bot.launchBot()
})();

