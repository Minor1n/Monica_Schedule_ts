import {IReferral} from "./IReferral";

export interface IUserReferral{
    id:number;
    key:string;
    agents:Map<number,IReferral>;
    agentsApprove:number;
    user:IReferral;
}