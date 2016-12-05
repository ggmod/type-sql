import NumberColumn from "../../src/builder/column/number-column";
import StringColumn from "../../src/builder/column/string-column";
import QueryTable from '../../src/builder/query-table';

export interface Author {
    id: number,
    name: string
}

export type AuthorId = number;

export class AuthorTable extends QueryTable<Author, AuthorId> {
    $name = "Author";

    id = new NumberColumn(this, 'id');
    name = new StringColumn(this, 'name');

    $id = this.id
}

export const AUTHOR = new AuthorTable();

export default AUTHOR;
