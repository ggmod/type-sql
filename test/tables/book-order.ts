import { QueryTable, NumberColumn } from "../../dist";

export interface BookOrder {
    bookId: number,
    orderId: number,
    count: number
}

export type BookOrderId = Pick<BookOrder, 'bookId' | 'orderId'>;

export class BookOrderTable extends QueryTable<BookOrder, BookOrderId> {
    bookId = new NumberColumn(this, 'bookId');
    orderId = new NumberColumn(this, 'orderId');
    count = new NumberColumn(this, 'count');

    $id = {
        bookId: this.bookId,
        orderId: this.orderId
    };
}

export const BOOK_ORDER = new BookOrderTable('BookOrder');
