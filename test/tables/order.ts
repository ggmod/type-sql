import { QueryTable, NumberColumn, StringColumn } from "../../dist";

export interface Order {
    bookId: number,
    customerId: string,
    quantity: number
}

export type OrderId = Pick<Order, 'bookId' | 'customerId'>;

export class OrderTable extends QueryTable<Order, OrderId> {
    bookId = new NumberColumn(this, 'bookId');
    customerId = new StringColumn(this, 'customerId');
    quantity = new NumberColumn(this, 'quantity');

    $id = {
        bookId: this.bookId,
        customerId: this.customerId
    };
}

export const ORDER = new OrderTable('Order');
