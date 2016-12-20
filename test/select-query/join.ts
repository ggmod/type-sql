import { BOOK } from '../tables/book';
import { ORDER } from '../tables/order';
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
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).innerJoin(ORDER).on(ORDER.bookId.eq(BOOK.id))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" INNER JOIN "Order" ON "Order"."bookId" = "Book"."id"');
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).leftJoin(ORDER).on(ORDER.bookId.eq(BOOK.id))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" LEFT JOIN "Order" ON "Order"."bookId" = "Book"."id"');
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).rightJoin(ORDER).on(ORDER.bookId.eq(BOOK.id))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" RIGHT JOIN "Order" ON "Order"."bookId" = "Book"."id"');
            await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId)).fullJoin(ORDER).on(ORDER.bookId.eq(BOOK.id))).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Order" ON "Book"."id" = "Order"."bookId" FULL JOIN "Order" ON "Order"."bookId" = "Book"."id"');
        }));

    });
}
