import {TrueFalseType} from "@types";

export default interface IMafiaPlayer{
    userId: number;
    userName: string;
    role: string;
    isDeath: TrueFalseType;
}