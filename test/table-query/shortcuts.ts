import { BOOK, Book } from '../tables/book';
import { BOOK_TYPE, BookType } from '../tables/book-type';
import { BOOK_ORDER, BookOrder } from '../tables/book-order';
import { db } from '../utils';

describe('Shortcuts for query by ID', () => {

    it('Get', () => {
        db.table(BOOK).get(123);
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" = 123`);

        db.table(BOOK_TYPE).get('abcdef');
        expect(db.sql).toEqual(`SELECT * FROM "BookType" WHERE "BookType"."name" = 'abcdef'`);

        db.table(BOOK_ORDER).get({ bookId: 123, orderId: 456 });
        expect(db.sql).toEqual(`SELECT * FROM "BookOrder" WHERE "BookOrder"."bookId" = 123 AND "BookOrder"."orderId" = 456`);
    });

    it('DELETE', () => {
        db.table(BOOK).delete(123);
        expect(db.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."id" = 123`);

        db.table(BOOK_TYPE).delete('abcdef');
        expect(db.sql).toEqual(`DELETE FROM "BookType" WHERE "BookType"."name" = 'abcdef'`);

        db.table(BOOK_ORDER).delete({ bookId: 123, orderId: 456 });
        expect(db.sql).toEqual(`DELETE FROM "BookOrder" WHERE "BookOrder"."bookId" = 123 AND "BookOrder"."orderId" = 456`);
    });

    it('UPDATE',  () => {
        db.table(BOOK).update(123, { title: 'qwe'});
        expect(db.sql).toEqual(`UPDATE "Book" SET "Book"."title" = 'qwe' WHERE "Book"."id" = 123`);

        db.table(BOOK_TYPE).update('123', { description:  'asdf'});
        expect(db.sql).toEqual(`UPDATE "BookType" SET "BookType"."description" = 'asdf' WHERE "BookType"."name" = '123'`);

        db.table(BOOK_ORDER).update({ bookId: 123, orderId: 456 }, { count: 9});
        expect(db.sql).toEqual(`UPDATE "BookOrder" SET "BookOrder"."count" = 9 WHERE "BookOrder"."bookId" = 123 AND "BookOrder"."orderId" = 456`);
    });
});
