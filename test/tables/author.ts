import { QueryTable, NumberColumn, StringColumn } from "../../dist";

export interface Author {
    id: number,
    name: string
}

export class AuthorTable extends QueryTable<Author, number> {
    id = new NumberColumn(this, 'id');
    name = new StringColumn(this, 'name');

    $id = this.id
}

export const AUTHOR = new AuthorTable('Author');
