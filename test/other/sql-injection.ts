import BOOK from '../tables/book';
import { db } from '../utils';

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

    it('string parameter', () => {
        db.from(BOOK).where(BOOK.title.eq(`asdf' OR '1'='1'`)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asdf'' OR ''1''=''1'''`);
        db.from(BOOK).where(BOOK.title.ne(`'; DELETE FROM users;`)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <> '''; DELETE FROM users;'`);
        db.from(BOOK).where(BOOK.title.like(`%x%'; DELETE FROM users;`)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%x%''; DELETE FROM users;'`);
        db.from(BOOK).where(BOOK.title.in(['xy', 'abc', `'; DELETE FROM users;`])).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IN ('xy', 'abc', '''; DELETE FROM users;')`);
    });
});
