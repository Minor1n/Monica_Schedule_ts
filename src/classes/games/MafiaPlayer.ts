import {TrueFalseType} from "@types";

export default class MafiaPlayer {
    id: number;
    private _socketId!: string;
    private _role: string;
    private _isDeath: TrueFalseType;

    constructor(id: number, role: string, isDeath: TrueFalseType, socketId: string) {
        this.id = id;
        this._role = role;
        this._isDeath = isDeath;
        this._socketId = socketId;
    }

    set role(roleName: string) {
        this._role = roleName;
    }

    set isDeath(status: TrueFalseType) {
        this._isDeath = status;
    }

    get role() {
        return this._role;
    }

    get isDeath() {
        return this._isDeath;
    }

}