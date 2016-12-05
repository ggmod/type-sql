import { QueryTable, NumberColumn, StringColumn } from "../../dist";

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
