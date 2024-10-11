import {bot} from "@index";
import {hears} from "@controllers";

export default ()=> {
    hears.forEach(({name,execute})=>{
        bot.hears(name, (ctx) => {
            execute(ctx);
        });
    })
}