import QueryTable from "../query-table";
import QueryJoinCondition from "../condition/query-join-condition";
import JoinedTables from "./joined-tables";
import {JoinType} from "../helpers/internal-types";

export default class JoinedTablesChain<Tables extends QueryTable<any, any>> {

    constructor(
        protected _table: QueryTable<any, any>,
        protected _modifier: JoinType,
        protected _parent: JoinedTables<Tables> | QueryTable<any, any>
    ) {}

    on(condition: QueryJoinCondition<Tables, Tables, any>): JoinedTables<Tables> {
        return new JoinedTables(condition, this);
    }
}
