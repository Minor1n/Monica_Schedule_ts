import {Bot, Gradients, Groups, Users} from "./classes";
import {CommandsHandler, CronHandler, FunctionsHandler, WebHandler} from "./handlers";

const app = new Bot()
export const {bot,connection} = app
export let gradients:Gradients, users:Users, groups:Groups;

(async () => {
    gradients = await app.addGradients();
    users = await app.addUsers();
    groups = await app.addGroups();
    WebHandler(__dirname)
    CommandsHandler()
    FunctionsHandler()
    CronHandler()
    app.launchBot()
})();

