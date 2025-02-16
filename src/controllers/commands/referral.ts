import ICommand from "@interfaces/ICommand";
import IContext from "@interfaces/IContext";
import ISceneSessionSetReferralKey from "@interfaces/scenes/ISceneSessionSetReferralKey";

export default {
    name: "referral",
    execute: async function(ctx:IContext<ISceneSessionSetReferralKey>){
        if(!ctx.from?.id)return
        ctx.session.userId = ctx.from.id;
        await ctx.scene.enter("setReferralKey")
    }
} satisfies ICommand;