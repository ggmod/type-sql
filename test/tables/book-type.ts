import { QueryTable, StringColumn } from "../../dist";

export interface BookType {
    name: string,
    description: string
}

export type BookTypeId = string;

export class BookTypeTable extends QueryTable<BookType, BookTypeId> {
    $name = 'BookType';

    name = new StringColumn(this, 'name');
    description = new StringColumn(this, 'description');

    $id = this.name
}

export const BOOK_TYPE = new BookTypeTable();

export default BOOK_TYPE;
