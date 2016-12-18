import { QueryTable, NumberColumn, StringColumn } from "../../dist";

export interface Customer {
    name: string,
    email: string
}

export class CustomerTable extends QueryTable<Customer, string> {
    name = new StringColumn(this, 'name');
    email = new StringColumn(this, 'email');

    $id = this.name
}

export const CUSTOMER = new CustomerTable('Customer');
