import IUserReferralQuery from "@interfaces/IUserReferralQuery";

export default interface IUserReferral{
    id:number;
    key:string;
    agents:Map<number,IUserReferralQuery>;
    agentsApprove:number;
    user:IUserReferralQuery;
}