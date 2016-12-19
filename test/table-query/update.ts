import { BOOK, Book } from '../tables/book';
import { getDB } from '../config/db';
import { sync } from "../config/utils";

let { db, log } = getDB();

describe('UPDATE', () => {

    it('conditions', sync(async () => {
        let e = { title: 'qwe' };

        await db.table(BOOK).where(BOOK.title.eq('asd')).update(e);
        expect(log.sql).toEqual(`UPDATE "Book" SET "title" = 'qwe' WHERE "Book"."title" = 'asd'`);

        await db.table(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).update(e);
        expect(log.sql).toEqual(`UPDATE "Book" SET "title" = 'qwe' WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);

        await db.table(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).update(e);
        expect(log.sql).toEqual(`UPDATE "Book" SET "title" = 'qwe' WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
    }));

    it('all', sync(async () => {
        let e = { title: 'qwe' };
        await db.table(BOOK).updateAll(e);
        expect(log.sql).toEqual(`UPDATE "Book" SET "title" = 'qwe'`);
    }));

    it('multiple field types', sync(async () => {
        let e = {
            title: 'asd',
            price: 10,
            available: true,
            date: new Date('2016-10-23T19:11:25.342Z'),
        };
        await db.table(BOOK).updateAll(e);
        expect(log.sql).toEqual(`UPDATE "Book" SET "available" = TRUE, "date" = '2016-10-23T19:11:25.342Z', "price" = 10, "title" = 'asd'`);
    }));

    it('set to null', sync(async () => {
        let e = { title: null } as any as Book;
        await db.table(BOOK).updateAll(e);
        expect(log.sql).toEqual(`UPDATE "Book" SET "title" = NULL`);

        let e2 = { author: undefined } as any as Book;
        await db.table(BOOK).updateAll(e2);
        expect(log.sql).toEqual(`UPDATE "Book" SET "author" = NULL`);
    }));

    it('json fields', sync(async () => {
        let e = {
            data: { x: 2, y: 10 }
        };
        await db.table(BOOK).updateAll(e);
        expect(log.sql).toEqual(`UPDATE "Book" SET "data" = '{"x":2,"y":10}'`);
    }));
});
