import QueryTable from "../../src/builder/query-table";
import NumberColumn from "../../src/builder/number-column";

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

    bookId = new NumberColumn(this, {
        name: 'bookId'
    });
    orderId = new NumberColumn(this, {
        name: 'orderId'
    });
    count = new NumberColumn(this, {
        name: 'count'
    });

    $id = {
        bookId: this.bookId,
        orderId: this.orderId
    };
}

export const BOOK_ORDER = new BookOrderTable();

export default BOOK_ORDER;
