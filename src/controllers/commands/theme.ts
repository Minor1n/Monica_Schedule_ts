import type ICommand from "@interfaces/ICommand";
import type IContext from "@interfaces/IContext";
import type ISceneSessionSetTheme from "@interfaces/scenes/ISceneSessionSetTheme";

export default {
    name: "theme",
    execute: async function(ctx:IContext<ISceneSessionSetTheme>) {
        if (!ctx.from?.id) return;
        ctx.session.userId = ctx.from.id;
        await ctx.scene.enter("setTheme")
    }
} satisfies ICommand;