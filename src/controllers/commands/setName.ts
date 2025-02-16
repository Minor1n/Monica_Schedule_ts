import type ICommand from "@interfaces/ICommand";
import type IContext from "@interfaces/IContext";
import type ISceneSessionSetName from "@interfaces/scenes/ISceneSessionSetName";

export default {
    name: "setname",
    execute:  async function(ctx:IContext<ISceneSessionSetName>) {
        if (!ctx.from?.id) return;
        ctx.session.userId = ctx.from.id;
        await ctx.scene.enter('setName')
    }
} satisfies ICommand;