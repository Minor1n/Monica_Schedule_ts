import {Scenes,Context} from "telegraf";

export default interface IContext<ISceneSession extends Scenes.SceneSession> extends Context {
    session: ISceneSession;
    scene: Scenes.SceneContextScene<IContext<ISceneSession>>;
}