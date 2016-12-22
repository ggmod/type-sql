import { BOOK } from '../tables/book';
import { ORDER } from '../tables/order';
import { CUSTOMER } from '../tables/customer';
import { sync } from "../config/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../config/db";

export default (db: QuerySource, log: TestLog) => {

    describe('JOIN', () => {

        it('two tables', sync(async () => {
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId"');
        }));

        it('modifiers', sync(async () => {
            await db.from(BOOK.leftJoin(ORDER).on(BOOK.id.eq(ORDER.bookId))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" LEFT JOIN "Order" ON "Book"."id" = "Order"."bookId"');
            await db.from(BOOK.rightJoin(ORDER).on(BOOK.id.eq(ORDER.bookId))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" RIGHT JOIN "Order" ON "Book"."id" = "Order"."bookId"');
            await db.from(BOOK.fullJoin(ORDER).on(BOOK.id.eq(ORDER.bookId))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" FULL JOIN "Order" ON "Book"."id" = "Order"."bookId"');
        }));

        it('three tables', sync(async () => {
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).innerJoin(CUSTOMER).on(ORDER.customerId.eq(CUSTOMER.name))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" INNER JOIN "Customer" ON "Order"."customerId" = "Customer"."name"');
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).leftJoin(CUSTOMER).on(ORDER.customerId.eq(CUSTOMER.name))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" LEFT JOIN "Customer" ON "Order"."customerId" = "Customer"."name"');
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).rightJoin(CUSTOMER).on(ORDER.customerId.eq(CUSTOMER.name))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" RIGHT JOIN "Customer" ON "Order"."customerId" = "Customer"."name"');
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).fullJoin(CUSTOMER).on(ORDER.customerId.eq(CUSTOMER.name))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" FULL JOIN "Customer" ON "Order"."customerId" = "Customer"."name"');
        }));

    });
}
