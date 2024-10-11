import {bot} from "@index";
import {commands} from "@controllers";

export default () => {
    commands.forEach(({name, execute})=>{
        bot.command(name, async (ctx) => {
            execute(ctx);
        });
    })
};