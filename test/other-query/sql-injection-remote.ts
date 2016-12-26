import { BOOK } from '../tables/book';
import { CUSTOMER } from "../tables/customer";
import { sync } from '../utils/utils';
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";
import { QueryEngine } from "../utils/types";

export default (db: QuerySource, log: TestLog, type: QueryEngine) => {

    describe('SQL injection - remote escaping of string parameters', () => {

        it('condition string parameter', sync(async () => {
            await db.from(BOOK).where(BOOK.title.eq(`asdf' OR '1'='1'`)).select();
            if (type === 'pg' ) expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = $1`);
            if (type === 'mysql' ) expect(log.sql).toEqual("SELECT * FROM `Book` WHERE `Book`.`title` = ?");
            expect(log.params).toEqual([`asdf' OR '1'='1'`]);

            await db.from(BOOK).where(BOOK.title.ne(`'; DELETE FROM users;`)).select();
            if (type === 'pg' ) expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <> $1`);
            if (type === 'mysql' ) expect(log.sql).toEqual("SELECT * FROM `Book` WHERE `Book`.`title` <> ?");
            expect(log.params).toEqual([`'; DELETE FROM users;`]);

            await db.from(BOOK).where(BOOK.title.like(`%x%'; DELETE FROM users;`)).select();
            if (type === 'pg' ) expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE $1`);
            if (type === 'mysql' ) expect(log.sql).toEqual("SELECT * FROM `Book` WHERE `Book`.`title` LIKE ?");
            expect(log.params).toEqual([`%x%'; DELETE FROM users;`]);

            await db.from(BOOK).where(BOOK.title.in(['xy', 'abc', `'; DELETE FROM users;`])).select();
            if (type === 'pg' ) expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IN ($1, $2, $3)`);
            if (type === 'mysql' ) expect(log.sql).toEqual("SELECT * FROM `Book` WHERE `Book`.`title` IN (?, ?, ?)");
            expect(log.params).toEqual(['xy', 'abc', `'; DELETE FROM users;`]);
        }));

        it('table queries', sync(async () => {
            await db.table(BOOK).insert({ title: `');DROP_TABLE users` } as any);
            if (type === 'pg' ) expect(log.sql).toEqual(`INSERT INTO "Book" ("title") VALUES ($1) RETURNING "id"`);
            if (type === 'mysql' ) expect(log.sql).toEqual("INSERT INTO `Book` (`title`) VALUES (?)");
            expect(log.params).toEqual([`');DROP_TABLE users`]);

            await db.table(BOOK).update(14, { title: `';DROP_TABLE users` } as any);
            if (type === 'pg' ) expect(log.sql).toEqual(`UPDATE "Book" SET "title" = $1 WHERE "Book"."id" = $2`);
            if (type === 'mysql' ) expect(log.sql).toEqual("UPDATE `Book` SET `title` = ? WHERE `Book`.`id` = ?");
            expect(log.params).toEqual([`';DROP_TABLE users`, 14]);

            await db.table(CUSTOMER).delete(`';DROP_TABLE users`);
            if (type === 'pg' ) expect(log.sql).toEqual(`DELETE FROM "Customer" WHERE "Customer"."name" = $1`);
            if (type === 'mysql' ) expect(log.sql).toEqual("DELETE FROM `Customer` WHERE `Customer`.`name` = ?");
            expect(log.params).toEqual([`';DROP_TABLE users`]);

            // the same ID logic is used for 'get' and 'update'
        }));
    });
}
