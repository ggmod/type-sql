import { BOOK, Book } from '../tables/book';
import { db } from '../utils';

describe('INSERT', () => {

    it('single value', () => {
        let e = { title: 'qwe' } as Book;
        db.table(BOOK).insert(e);
        expect(db.sql).toEqual(`INSERT INTO "Book" ("title") VALUES ('qwe')`);
    });

    it('multiple values', () => {
        let e = { title: 'qwe' } as Book;
        let e2 = { title: 'asd' } as Book;
        db.table(BOOK).insert([e, e2]);
        expect(db.sql).toEqual(`INSERT INTO "Book" ("title") VALUES ('qwe'), ('asd')`);
    });

    it('multiple values with multiple columns', () => {
        let e = { title: 'qwe', price: 5 } as Book;
        let e2 = { title: 'asd', price: 6 } as Book;
        db.table(BOOK).insert([e, e2]);
        expect(db.sql).toEqual(`INSERT INTO "Book" ("price", "title") VALUES (5, 'qwe'), (6, 'asd')`);
    });

    it('multiple values with different columns', () => { // TODO better solution for this?
        let e = { title: 'qwe', author: 'xy' } as Book;
        let e2 = { title: 'asd', price: 10 } as Book;
        db.table(BOOK).insert([e, e2]);
        expect(db.sql).toEqual(`INSERT INTO "Book" ("author", "price", "title") VALUES ('xy', NULL, 'qwe'), (NULL, 10, 'asd')`);
    });

    it('field types', () => {
        let e = <Book>{
            title: 'asd',
            price: 10,
            available: true,
            date: new Date('2016-10-23T19:11:25.342Z'),
        };
        db.table(BOOK).insert(e);
        expect(db.sql).toEqual(`INSERT INTO "Book" ("available", "date", "price", "title") VALUES (TRUE, '2016-10-23T19:11:25.342Z', 10, 'asd')`);
    });

    it('json fields', () => {
        let e = <Book>{
            data: { x: 2, y: 10 }
        };
        db.table(BOOK).insert(e);
        expect(db.sql).toEqual(`INSERT INTO "Book" ("data") VALUES ('{"x":2,"y":10}')`);
    });
});
