import QueryTable from "../query-table";
import JoinedTablesChain from "./joined-tables-chain";
import QueryJoinCondition from "../condition/query-join-condition";


export default class JoinedTables<Tables extends QueryTable<any, any>> {

    constructor(
        protected _condition: QueryJoinCondition<Tables, Tables, any>,
        protected _parent: JoinedTablesChain<Tables>
    ) {}

    innerJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<Tables | JoinTable> {
        return new JoinedTablesChain(table, 'inner', this);
    }

    leftJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<Tables | JoinTable> {
        return new JoinedTablesChain(table, 'left', this);
    }

    rightJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<Tables | JoinTable> {
        return new JoinedTablesChain(table, 'right', this);
    }

    fullJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<Tables | JoinTable> {
        return new JoinedTablesChain(table, 'full', this);
    }
}
