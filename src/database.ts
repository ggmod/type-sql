import DatabaseTable from './database-table';
import Query from './query';


export default class Database {

    from<Table extends DatabaseTable>(table: Table) {
        return new Query<Table>(table);
    }
}
