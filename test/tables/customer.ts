import { QueryTable, StringColumn } from "../../dist";

export interface Customer {
    name: string,
    email: string,
    phoneNumber?: string | null
}

export class CustomerTable extends QueryTable<Customer, string> {
    name = new StringColumn(this, 'name');
    email = new StringColumn(this, 'email');
    phoneNumber = new StringColumn(this, { name: 'phone_number', alias: 'phoneNumber' });

    $id = this.name
}

export const CUSTOMER = new CustomerTable('Customer');
