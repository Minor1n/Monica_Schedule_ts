import type ICommand from "@interfaces/ICommand";
import type IContext from "@interfaces/IContext";
import type ISceneSessionSetReferralKey from "@interfaces/scenes/ISceneSessionSetReferralKey";

export default {
    name: "referral",
    execute: async function(ctx:IContext<ISceneSessionSetReferralKey>){
        if(!ctx.from?.id)return
        ctx.session.userId = ctx.from.id;
        await ctx.scene.enter("setReferralKey")
    }
} satisfies ICommand;