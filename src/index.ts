import {Bot} from "./classes";

const app = new Bot()
export const {bot,connection} = app
export let {gradients}=app
app.addGradients().then(gr=>{gradients = gr})

import {CommandsHandler, CronHandler, FunctionsHandler, WebHandler} from "./handlers";

WebHandler(__dirname)
CommandsHandler()
FunctionsHandler()
CronHandler()