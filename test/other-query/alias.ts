import { CUSTOMER } from '../tables/customer';
import { ORDER } from '../tables/order';
import { sync } from '../utils/utils';
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";

export default (db: QuerySource, log: TestLog) => {

    describe('Column alias', () => {

        it('input and output', sync(async() => {
            await db.table(CUSTOMER).insert({ name: 'xy', email: 'a@b.com', phoneNumber: '1-2-3-4-5' });
            expect(log.sql.startsWith(`INSERT INTO "Customer" ("email", "name", "phone_number") VALUES ('a@b.com', 'xy', '1-2-3-4-5')`)).toBe(true);

            await db.table(ORDER).insert({ customerId: 'xy', bookId: 1, quantity: 1 });

            let consumers = await db.from(CUSTOMER).select();
            expect(JSON.stringify(consumers[0])).toEqual(JSON.stringify({ name: 'xy', email: 'a@b.com', phoneNumber: '1-2-3-4-5' }));

            let consumers2 = await db.from(CUSTOMER).select(CUSTOMER.$all);
            expect(JSON.stringify(consumers2[0])).toEqual(JSON.stringify({ name: 'xy', email: 'a@b.com', phoneNumber: '1-2-3-4-5' }));

            let phoneNumbers = await db.from(CUSTOMER).select(CUSTOMER.phoneNumber);
            expect(log.sql).toEqual(`SELECT "Customer"."phone_number" FROM "Customer"`);
            expect(phoneNumbers[0]).toEqual('1-2-3-4-5');

            let columns = await db.from(CUSTOMER).select(CUSTOMER.name, CUSTOMER.phoneNumber);
            expect(log.sql).toEqual(`SELECT "Customer"."name", "Customer"."phone_number" FROM "Customer"`);
            expect(JSON.stringify(columns[0])).toEqual(JSON.stringify({ name: 'xy', phoneNumber: '1-2-3-4-5' }));

            let renamed = await db.from(CUSTOMER).select(CUSTOMER.name.as('id'), CUSTOMER.phoneNumber.as('phone'));
            expect(JSON.stringify(renamed[0])).toEqual(JSON.stringify({ id: 'xy', phone: '1-2-3-4-5' }));

            let merged = await db.from(CUSTOMER, ORDER).select();
            expect(JSON.stringify(merged[0])).toEqual(JSON.stringify({ name: 'xy', email: 'a@b.com', bookId: 1, customerId: 'xy', quantity: 1, phoneNumber: '1-2-3-4-5' }));

            let joined = await db.from(CUSTOMER.innerJoin(ORDER).on(CUSTOMER.name.eq(ORDER.customerId))).select();
            expect(JSON.stringify(joined[0])).toEqual(JSON.stringify({ name: 'xy', email: 'a@b.com', bookId: 1, customerId: 'xy', quantity: 1, phoneNumber: '1-2-3-4-5' }));

            await db.table(CUSTOMER).update('xy', { email: 'a@c.com', phoneNumber: '6-7-8-9-0' });

            let consumer = await db.table(CUSTOMER).get('xy');
            expect(JSON.stringify(consumer)).toEqual(JSON.stringify({ name: 'xy', email: 'a@c.com', phoneNumber: '6-7-8-9-0' }));
        }));
    });
}
