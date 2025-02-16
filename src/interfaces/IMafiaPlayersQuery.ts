import {TrueFalseType} from "@interfaces/Types";

export default interface IMafiaPlayersQuery {
    session:number;
    id:number;
    role:string;
    isDeath:TrueFalseType;
}