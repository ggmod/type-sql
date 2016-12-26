import { BOOK } from '../tables/book';
import { CUSTOMER } from '../tables/customer';
import { ORDER } from '../tables/order';
import { sync } from "../utils/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";

export default (db: QuerySource, log: TestLog) => {

    describe('SELECT', () => {

        it('single column', sync(async () => {
            await db.from(BOOK).select();
            expect(log.sql).toEqual('SELECT * FROM "Book"');
            await db.from(BOOK).select(BOOK.$all);
            expect(log.sql).toEqual('SELECT "Book".* FROM "Book"');
            await db.from(BOOK).select(BOOK.title);
            expect(log.sql).toEqual('SELECT "Book"."title" FROM "Book"');
            await db.from(BOOK).select(BOOK.title.lower());
            expect(log.sql).toEqual('SELECT LOWER("Book"."title") FROM "Book"');
            await db.from(BOOK).select(BOOK.$all.count());
            expect(log.sql).toEqual('SELECT COUNT(*) FROM "Book"');
            await db.from(BOOK).select(BOOK.price.sum());
            expect(log.sql).toEqual('SELECT SUM("Book"."price") FROM "Book"');
        }));

        it('multiple columns', sync(async () => {
            await db.from(BOOK).select(BOOK.title.lower(), BOOK.author, BOOK.price);
            expect(log.sql).toEqual('SELECT LOWER("Book"."title"), "Book"."author", "Book"."price" FROM "Book"');
            await db.from(BOOK).select(BOOK.$all.count(), BOOK.price.sum());
            expect(log.sql).toEqual('SELECT COUNT(*), SUM("Book"."price") FROM "Book"');
        }));

        it('multiple tables', sync(async () => {
            await db.from(BOOK, ORDER).select(BOOK.title.lower(), ORDER.quantity, BOOK.price);
            expect(log.sql).toEqual('SELECT LOWER("Book"."title"), "Order"."quantity", "Book"."price" FROM "Book", "Order"');
            await db.from(BOOK, ORDER).select(ORDER.quantity.max(), BOOK.$all.count(), BOOK.price.sum());
            expect(log.sql).toEqual('SELECT MAX("Order"."quantity"), COUNT(*), SUM("Book"."price") FROM "Book", "Order"');
            await db.from(BOOK, ORDER).select(ORDER.$all, BOOK.$all);
            expect(log.sql).toEqual('SELECT "Order".*, "Book".* FROM "Book", "Order"');
        }));

        it('"as" keyword', sync(async () => {
            await db.from(BOOK).select(BOOK.price.sum().as('sum'));
            expect(log.sql).toEqual('SELECT SUM("Book"."price") AS "sum" FROM "Book"');
            await db.from(BOOK).select(BOOK.author, BOOK.price.as('pr'));
            expect(log.sql).toEqual('SELECT "Book"."author", "Book"."price" AS "pr" FROM "Book"');
        }));

        it('"distinct" keyword', sync(async () => {
            await db.from(CUSTOMER).distinct().select();
            expect(log.sql).toEqual('SELECT DISTINCT * FROM "Customer"');
            await db.from(BOOK).distinct().select(BOOK.author);
            expect(log.sql).toEqual('SELECT DISTINCT "Book"."author" FROM "Book"');
        }));
    });
}
