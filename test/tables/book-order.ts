import { QueryTable, NumberColumn } from "../../dist";

export interface BookOrder {
    bookId: number,
    orderId: number,
    count: number
}

export interface BookOrderId {
    bookId: number,
    orderId: number
}

export class BookOrderTable extends QueryTable<BookOrder, BookOrderId> {
    $name = 'BookOrder';

    bookId = new NumberColumn(this, 'bookId');
    orderId = new NumberColumn(this, 'orderId');
    count = new NumberColumn(this, 'count');

    $id = {
        bookId: this.bookId,
        orderId: this.orderId
    };
}

export const BOOK_ORDER = new BookOrderTable();

export default BOOK_ORDER;
