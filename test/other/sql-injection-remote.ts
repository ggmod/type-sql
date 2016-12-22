import { BOOK } from '../tables/book';
import { CUSTOMER } from "../tables/customer";
import { sync } from '../config/utils';
import { QuerySource } from "../../dist";
import { TestLog } from "../config/db";

export default (db: QuerySource, log: TestLog) => {

    describe('SQL injection - remote escaping of string parameters', () => {

        it('condition string parameter', sync(async () => {
            await db.from(BOOK).where(BOOK.title.eq(`asdf' OR '1'='1'`)).select();
            expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = $1`);
            expect(log.params).toEqual([`asdf' OR '1'='1'`]);
            await db.from(BOOK).where(BOOK.title.ne(`'; DELETE FROM users;`)).select();
            expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <> $1`);
            expect(log.params).toEqual([`'; DELETE FROM users;`]);
            await db.from(BOOK).where(BOOK.title.like(`%x%'; DELETE FROM users;`)).select();
            expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE $1`);
            expect(log.params).toEqual([`%x%'; DELETE FROM users;`]);
            await db.from(BOOK).where(BOOK.title.in(['xy', 'abc', `'; DELETE FROM users;`])).select();
            expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IN ($1, $2, $3)`);
            expect(log.params).toEqual(['xy', 'abc', `'; DELETE FROM users;`]);
        }));

        it('table queries', sync(async () => {
            await db.table(BOOK).insert({ title: `');DROP_TABLE users` } as any);
            expect(log.sql).toEqual(`INSERT INTO "Book" ("title") VALUES ($1)`);
            expect(log.params).toEqual([`');DROP_TABLE users`]);

            await db.table(BOOK).update(14, { title: `';DROP_TABLE users` } as any);
            expect(log.sql).toEqual(`UPDATE "Book" SET "title" = $1 WHERE "Book"."id" = $2`);
            expect(log.params).toEqual([`';DROP_TABLE users`, 14]);

            await db.table(CUSTOMER).delete(`';DROP_TABLE users`);
            expect(log.sql).toEqual(`DELETE FROM "Customer" WHERE "Customer"."name" = $1`);
            expect(log.params).toEqual([`';DROP_TABLE users`]);

            // the same ID logic is used for 'get' and 'update'
        }));
    });
}
