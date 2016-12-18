import { BOOK, Book } from '../tables/book';
import { CUSTOMER, Customer } from '../tables/customer';
import { ORDER, Order } from '../tables/order';
import { db } from '../utils';

describe('Shortcuts for query by ID', () => {

    it('Get', () => {
        db.table(BOOK).get(123);
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" = 123`);

        db.table(CUSTOMER).get('abcdef');
        expect(db.sql).toEqual(`SELECT * FROM "Customer" WHERE "Customer"."name" = 'abcdef'`);

        db.table(ORDER).get({ bookId: 123, customerId: 'ab cd' });
        expect(db.sql).toEqual(`SELECT * FROM "Order" WHERE "Order"."bookId" = 123 AND "Order"."customerId" = 'ab cd'`);
    });

    it('DELETE', () => {
        db.table(BOOK).delete(123);
        expect(db.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."id" = 123`);

        db.table(CUSTOMER).delete('abcdef');
        expect(db.sql).toEqual(`DELETE FROM "Customer" WHERE "Customer"."name" = 'abcdef'`);

        db.table(ORDER).delete({ bookId: 123, customerId: 'ab cd' });
        expect(db.sql).toEqual(`DELETE FROM "Order" WHERE "Order"."bookId" = 123 AND "Order"."customerId" = 'ab cd'`);
    });

    it('UPDATE',  () => {
        db.table(BOOK).update(123, { title: 'qwe'});
        expect(db.sql).toEqual(`UPDATE "Book" SET "title" = 'qwe' WHERE "Book"."id" = 123`);

        db.table(CUSTOMER).update('abc', { email:  'a@b.com'});
        expect(db.sql).toEqual(`UPDATE "Customer" SET "email" = 'a@b.com' WHERE "Customer"."name" = 'abc'`);

        db.table(ORDER).update({ bookId: 123, customerId: 'ab cd' }, { quantity: 9});
        expect(db.sql).toEqual(`UPDATE "Order" SET "quantity" = 9 WHERE "Order"."bookId" = 123 AND "Order"."customerId" = 'ab cd'`);
    });
});
