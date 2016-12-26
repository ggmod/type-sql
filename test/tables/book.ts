import { QueryTable, StringColumn, NumberColumn, BooleanColumn, DateColumn, BasicColumn } from "../../dist";

export interface Book {
    id?: number,
    title: string,
    author: string,
    price?: number | null,
    available?: boolean | null,
    date?: Date | null,
    data?: { x: number, y: number } | null
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
