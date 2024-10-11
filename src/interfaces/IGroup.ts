import GroupSchedule from "@classes/groups/GroupSchedule";
import GroupReplacement from "@classes/groups/GroupReplacement";
import User from "@classes/users/User";
import GroupDuty from "@classes/groups/GroupDuty";

export default interface IGroup{
    name: string
    schedule: GroupSchedule
    replacement: GroupReplacement
    users:User[]
    duty:GroupDuty
}