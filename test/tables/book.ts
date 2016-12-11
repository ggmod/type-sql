import { QueryTable, StringColumn, NumberColumn, BooleanColumn, DateColumn, BasicColumn } from "../../dist";

// TODO add '| null' to nullable fields?

export interface Book {
    id?: number,
    title: string,
    author: string,
    authorId?: number,
    price?: number,
    available?: boolean,
    date?: Date,
    data?: any
}

export class BookTable extends QueryTable<Book, number> {
    id = new NumberColumn(this, 'id');
    title = new StringColumn(this, 'title');
    author = new StringColumn(this,'author');
    authorId = new NumberColumn(this, 'author_id');
    price = new NumberColumn(this, 'price');
    date = new DateColumn(this, 'date');
    available = new BooleanColumn(this, 'available');
    data = new BasicColumn<this, any>(this, 'data');

    $id = this.id
}

export const BOOK = new BookTable('Book');
