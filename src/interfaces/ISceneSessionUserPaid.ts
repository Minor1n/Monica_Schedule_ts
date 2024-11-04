import {Scenes} from "telegraf";

export default interface ISceneSessionUserPaid extends Scenes.SceneSession {
    userId: number;
    adminId: number;
    userName: string;
    status: number;
    messageId: number;
}