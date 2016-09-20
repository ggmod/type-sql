import QueryTable from './query-table';
import Query from './query';
import QueryProcessor from "../query-processor";


export default class QuerySource {

    constructor(private _queryProcessor: QueryProcessor) {}

    from<Table extends QueryTable>(table: Table) {
        return new Query<Table>(this._queryProcessor, table);
    }
}
