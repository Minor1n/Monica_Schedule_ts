import {Scenes} from "telegraf";

export default interface ISceneSessionSetName extends Scenes.SceneSession {
    userId: number;
}