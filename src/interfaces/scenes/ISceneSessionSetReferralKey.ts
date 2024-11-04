import {Scenes} from "telegraf";

export default interface ISceneSessionSetReferralKey extends Scenes.SceneSession {
    userId: number;
}