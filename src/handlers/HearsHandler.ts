import {bot} from "../index";
import hears from "../hears";

export default ()=> {
    bot.hears("Отдежурил", async (ctx) => {
        await hears.duty(ctx);
    });
}