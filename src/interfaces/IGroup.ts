import {GroupSchedule, User} from "../classes";
import {GroupDuty} from "../classes/GroupDuty";

export interface IGroup{
    name: string
    schedule: GroupSchedule
    users:User[]
    duty:GroupDuty
}