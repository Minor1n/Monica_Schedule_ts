import {Scenes,Context} from "telegraf";
import type {SceneNames} from "@types";

interface CustomSceneContextScene<TContext extends Context> extends Scenes.SceneContextScene<TContext> {
    enter(scene: SceneNames): Promise<void>;
}

export default interface IContext<ISceneSession extends Scenes.SceneSession> extends Context {
    session: ISceneSession;
    scene: CustomSceneContextScene<IContext<ISceneSession>>;
}