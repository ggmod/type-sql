import { BOOK } from '../tables/book';
import { CUSTOMER } from "../tables/customer";
import { ORDER } from "../tables/order";
import { getDB } from '../config/db';
import { sync } from '../config/utils';

let { db, log } = getDB();

describe('SQL injection', () => {

    it('offset/limit', () => {
        expect(() => db.from(BOOK).offset(<any>'1;DROP TABLE users').select()).toThrow();
        expect(() => db.from(BOOK).limit(<any>'1;DROP TABLE users').select()).toThrow();
    });

    it('numeric condition parameters', () => {
        expect(() => db.from(BOOK).where(BOOK.price.eq(<any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).where(BOOK.price.lte(<any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).where(BOOK.price.ne(<any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).where(BOOK.price.between(0, <any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).where(BOOK.price.in([0, 2, <any>'1;DROP TABLE users'])).select()).toThrow();

        expect(() => db.from(BOOK).where(BOOK.available.eq(<any>'TRUE;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).where(BOOK.date.eq(<any>'\'2016-10-23T19:11:25.342Z\';DROP TABLE users')).select()).toThrow();
    });

    it('numeric condition parameters - having', () => {
        expect(() => db.from(BOOK).having(BOOK.price.eq(<any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).having(BOOK.price.lte(<any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).having(BOOK.price.ne(<any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).having(BOOK.price.between(0, <any>'1;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).having(BOOK.price.in([0, 2, <any>'1;DROP TABLE users'])).select()).toThrow();

        expect(() => db.from(BOOK).having(BOOK.available.eq(<any>'TRUE;DROP TABLE users')).select()).toThrow();
        expect(() => db.from(BOOK).having(BOOK.date.eq(<any>'\'2016-10-23T19:11:25.342Z\';DROP TABLE users')).select()).toThrow();
    });

    it('string parameter', sync(async () => {
        db.from(BOOK).where(BOOK.title.eq(`asdf' OR '1'='1'`)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asdf'' OR ''1''=''1'''`);
        db.from(BOOK).where(BOOK.title.ne(`'; DELETE FROM users;`)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <> '''; DELETE FROM users;'`);
        db.from(BOOK).where(BOOK.title.like(`%x%'; DELETE FROM users;`)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%x%''; DELETE FROM users;'`);
        db.from(BOOK).where(BOOK.title.in(['xy', 'abc', `'; DELETE FROM users;`])).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IN ('xy', 'abc', '''; DELETE FROM users;')`);
    }));

    it('string parameter - having', sync(async () => {
        db.from(BOOK).having(BOOK.title.eq(`asdf' OR '1'='1'`)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" HAVING "Book"."title" = 'asdf'' OR ''1''=''1'''`);
        db.from(BOOK).having(BOOK.title.ne(`'; DELETE FROM users;`)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" HAVING "Book"."title" <> '''; DELETE FROM users;'`);
        db.from(BOOK).having(BOOK.title.like(`%x%'; DELETE FROM users;`)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" HAVING "Book"."title" LIKE '%x%''; DELETE FROM users;'`);
        db.from(BOOK).having(BOOK.title.in(['xy', 'abc', `'; DELETE FROM users;`])).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" HAVING "Book"."title" IN ('xy', 'abc', '''; DELETE FROM users;')`);
    }));

    it('join parameters', sync(async () => {
        expect(() => db.from(BOOK.innerJoin(ORDER).on(<any>BOOK.id.eq(<any>`asdf' OR '1'='1'`))).select()).toThrow();
        expect(() => db.from(BOOK.innerJoin(ORDER).on(<any>BOOK.title.eq(`asdf' OR '1'='1'`))).select()).toThrow();
    }));

    it('insert', sync(async () => {
        expect(() => db.table(BOOK).insert(';DROP TABLE users' as any)).toThrow();

        expect(() => db.table(BOOK).insert({ price: `);DROP_TABLE users` } as any)).toThrow();

        await db.table(BOOK).insert({ title: `');DROP_TABLE users` } as any);
        expect(log.sql).toEqual(`INSERT INTO "Book" ("title") VALUES (''');DROP_TABLE users')`);

        await db.table(BOOK).insert({ data: `');DROP_TABLE users` } as any);
        expect(log.sql).toEqual(`INSERT INTO "Book" ("data") VALUES (''');DROP_TABLE users')`);
    }));

    it('update', sync(async () => {
        expect(() => db.table(BOOK).update(12, ';DROP TABLE users' as any)).toThrow();

        expect(() => db.table(BOOK).update(13, { price: `);DROP_TABLE users` } as any)).toThrow();

        await db.table(BOOK).update(14, { title: `';DROP_TABLE users` } as any);
        expect(log.sql).toEqual(`UPDATE "Book" SET "title" = ''';DROP_TABLE users' WHERE "Book"."id" = 14`);

        await db.table(BOOK).update(15, { data: `';DROP_TABLE users` } as any);
        expect(log.sql).toEqual(`UPDATE "Book" SET "data" = ''';DROP_TABLE users' WHERE "Book"."id" = 15`);
    }));

    it('ID', sync(async () => { // the same ID logic is used for 'get' and 'update'
        expect(() => db.table(BOOK).delete(`11';DROP_TABLE users` as any)).toThrow();

        await db.table(CUSTOMER).delete(`';DROP_TABLE users`);
        expect(log.sql).toEqual(`DELETE FROM "Customer" WHERE "Customer"."name" = ''';DROP_TABLE users'`);
    }));
});
