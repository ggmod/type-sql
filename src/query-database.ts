import QueryTable from './query-table';
import Query from './query';


export default class QueryDatabase {

    from<Table extends QueryTable>(table: Table) {
        return new Query<Table>(table);
    }
}
