import { BOOK } from '../tables/book';
import { CUSTOMER } from '../tables/customer';
import { ORDER } from '../tables/order';
import { getDB } from '../config/db';
import { sync } from "../config/utils";

let { db, log } = getDB();

describe('Shortcuts for query by ID', () => {

    it('Get', sync(async () => {
        await db.table(BOOK).get(123);
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" = 123`);

        await db.table(CUSTOMER).get('abcdef');
        expect(log.sql).toEqual(`SELECT * FROM "Customer" WHERE "Customer"."name" = 'abcdef'`);

        await db.table(ORDER).get({ bookId: 123, customerId: 'ab cd' });
        expect(log.sql).toEqual(`SELECT * FROM "Order" WHERE "Order"."bookId" = 123 AND "Order"."customerId" = 'ab cd'`);
    }));

    it('DELETE', sync(async () => {
        await db.table(BOOK).delete(123);
        expect(log.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."id" = 123`);

        await db.table(CUSTOMER).delete('abcdef');
        expect(log.sql).toEqual(`DELETE FROM "Customer" WHERE "Customer"."name" = 'abcdef'`);

        await db.table(ORDER).delete({ bookId: 123, customerId: 'ab cd' });
        expect(log.sql).toEqual(`DELETE FROM "Order" WHERE "Order"."bookId" = 123 AND "Order"."customerId" = 'ab cd'`);
    }));

    it('UPDATE',  sync(async () => {
        await db.table(BOOK).update(123, { title: 'qwe'});
        expect(log.sql).toEqual(`UPDATE "Book" SET "title" = 'qwe' WHERE "Book"."id" = 123`);

        await db.table(CUSTOMER).update('abc', { email:  'a@b.com'});
        expect(log.sql).toEqual(`UPDATE "Customer" SET "email" = 'a@b.com' WHERE "Customer"."name" = 'abc'`);

        await db.table(ORDER).update({ bookId: 123, customerId: 'ab cd' }, { quantity: 9});
        expect(log.sql).toEqual(`UPDATE "Order" SET "quantity" = 9 WHERE "Order"."bookId" = 123 AND "Order"."customerId" = 'ab cd'`);
    }));
});
