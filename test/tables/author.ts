import NumberColumn from "../../src/builder/number-column";
import StringColumn from "../../src/builder/string-column";
import QueryTable from '../../src/builder/query-table';

export interface Author {
    name: string
}

export class AuthorTable extends QueryTable<Author> {
    $name = "Author";

    id = new NumberColumn(this, {
        name: 'id'
    });

    name = new StringColumn(this, {
        name: 'name'
    });
}

export const AUTHOR = new AuthorTable();

export default AUTHOR;
