import { QueryTable, StringColumn, NumberColumn, BooleanColumn, DateColumn, BasicColumn } from "../../dist";

// TODO add '| null' to nullable fields?

export interface Book {
    id?: number,
    title: string,
    author: string,
    price?: number,
    available?: boolean,
    date?: Date,
    data?: { x: number, y: number }
}

export class BookTable extends QueryTable<Book, number> {
    id = new NumberColumn(this, 'id');
    title = new StringColumn(this, 'title');
    author = new StringColumn(this,'author');
    price = new NumberColumn(this, 'price');
    date = new DateColumn(this, 'date');
    available = new BooleanColumn(this, 'available');
    data = new BasicColumn<this, any>(this, 'data');

    $id = this.id
}

export const BOOK = new BookTable('Book');
