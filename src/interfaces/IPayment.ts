import {UserReferral} from "../classes";

export interface IPayment{
    id:number;
    status:number;
    price:number;
    paid:'true'|'false'
    referral:UserReferral
}