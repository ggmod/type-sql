import BOOK, { Book } from '../tables/book';
import { db } from '../utils';

describe('UPDATE', () => {

    it('conditions', () => {
        let e = { title: 'qwe' } as Book; // TODO no assertion needed for Partial<Entity>

        db.table(BOOK).where(BOOK.title.eq('asd')).update(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."title" = 'qwe' WHERE "Book"."title" = 'asd'`);

        db.table(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).update(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."title" = 'qwe' WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);

        db.table(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).update(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."title" = 'qwe' WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
    });

    it('all', () => {
        let e = { title: 'qwe' } as Book;
        db.table(BOOK).updateAll(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."title" = 'qwe'`);
    });

    it('multiple field types', () => {
        let e = <Book>{
            title: 'asd',
            price: 10,
            available: true,
            date: new Date('2016-10-23T19:11:25.342Z'),
        };
        db.table(BOOK).updateAll(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."available" = TRUE, "Book"."date" = '2016-10-23T19:11:25.342Z', "Book"."price" = 10, "Book"."title" = 'asd'`);
    });

    it('set to null', () => {
        let e = { title: null } as Book;
        db.table(BOOK).updateAll(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."title" = NULL`);

        let e2 = { author: undefined } as Book;
        db.table(BOOK).updateAll(e2);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."author" = NULL`);
    });

    it('json fields', () => {
        let e = <Book>{
            data: { x: 2, y: 10 }
        };
        db.table(BOOK).updateAll(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."data" = '{"x":2,"y":10}'`);
    });
});
