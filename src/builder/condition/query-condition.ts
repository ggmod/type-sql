import QueryTable from "../query-table";
import QueryConditionChain from "./query-condition-chain";

// TODO I had to copy-paste the method implementations to every child class to avoid circular dependencies

abstract class QueryCondition<Table extends QueryTable<any, any>> {

    abstract and<Table2 extends QueryTable<any, any>>(condition: QueryCondition<Table2>): QueryConditionChain<Table | Table2>;

    abstract or<Table2 extends QueryTable<any, any>>(condition: QueryCondition<Table2>): QueryConditionChain<Table | Table2>;
}

export default QueryCondition;
