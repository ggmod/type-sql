import { BOOK, Book } from '../tables/book';
import { sync } from "../utils/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";
import { QueryEngine } from "../utils/types";

export default (db: QuerySource, log: TestLog, type: QueryEngine) => {

    describe('INSERT', () => {

        it('single value', sync(async() => {
            let e = { title: 'qwe' } as Book;
            await db.table(BOOK).insert(e);
            let sql = `INSERT INTO "Book" ("title") VALUES ('qwe')`;
            if (type === 'pg') expect(log.sql).toEqual(sql + ` RETURNING "id"`);
            if (type === 'mysql') expect(log.sql).toEqual(sql);
        }));

        it('multiple values', sync(async () => {
            let e = { title: 'qwe' } as Book;
            let e2 = { title: 'asd' } as Book;
            await db.table(BOOK).insert([e, e2]);
            expect(log.sql).toEqual(`INSERT INTO "Book" ("title") VALUES ('qwe'), ('asd')`);
        }));

        it('multiple values with multiple columns', sync(async () => {
            let e = { title: 'qwe', price: 5 } as Book;
            let e2 = { title: 'asd', price: 6 } as Book;
            await db.table(BOOK).insert([e, e2]);
            expect(log.sql).toEqual(`INSERT INTO "Book" ("price", "title") VALUES (5, 'qwe'), (6, 'asd')`);
        }));

        it('multiple values with different columns', sync(async () => { // TODO better solution for this?
            let e = { title: 'qwe', author: 'xy' } as Book;
            let e2 = { title: 'asd', price: 10 } as Book;
            await db.table(BOOK).insert([e, e2]);
            expect(log.sql).toEqual(`INSERT INTO "Book" ("author", "price", "title") VALUES ('xy', NULL, 'qwe'), (NULL, 10, 'asd')`);
        }));

        it('field types', sync(async () => {
            let e = <Book>{
                title: 'asd',
                price: 10,
                available: true,
                date: new Date('2016-10-23T19:11:25.342Z'),
            };
            await db.table(BOOK).insert(e);
            let sql = `INSERT INTO "Book" ("available", "date", "price", "title") VALUES (TRUE, '2016-10-23T19:11:25.342Z', 10, 'asd')`;
            if (type === 'pg') expect(log.sql).toEqual(sql + ` RETURNING "id"`);
            if (type === 'mysql') expect(log.sql).toEqual(sql);
        }));

        it('json fields', sync(async () => {
            let e = <Book>{
                title: 'abc',
                data: { x: 2, y: 10 }
            };
            await db.table(BOOK).insert(e);
            let sql = `INSERT INTO "Book" ("data", "title") VALUES ('{"x":2,"y":10}', 'abc')`;
            if (type === 'pg') expect(log.sql).toEqual(sql + ` RETURNING "id"`);
            if (type === 'mysql') expect(log.sql).toEqual(sql);
        }));
    });
}
