import groupTable from "@web/home/replacement/groupTable";
import tableReplacement from "@web/home/replacement/table";
import select from "@web/home/schedule/select";
import update from "@web/home/schedule/update";
import tableSchedule from "@web/home/schedule/table";


export default {
    replacement:{
        groupTable,
        table: tableReplacement,
    },
    schedule:{
        select,
        update,
        table: tableSchedule,
    }
}