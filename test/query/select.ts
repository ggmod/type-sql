import BOOK from '../tables/book';
import AUTHOR from '../tables/author';
import { db } from '../utils';

describe('SELECT', () => {
    it('single column', () => {
        db.from(BOOK).select();
        expect(db.sql).toEqual('SELECT * FROM "Book"');
        db.from(BOOK).select(BOOK.$all);
        expect(db.sql).toEqual('SELECT "Book".* FROM "Book"');
        db.from(BOOK).select(BOOK.title);
        expect(db.sql).toEqual('SELECT "Book"."title" FROM "Book"');
        db.from(BOOK).select(BOOK.title.lower());
        expect(db.sql).toEqual('SELECT LOWER("Book"."title") FROM "Book"');
        db.from(BOOK).select(BOOK.$all.count());
        expect(db.sql).toEqual('SELECT COUNT("Book".*) FROM "Book"');
        db.from(BOOK).select(BOOK.price.sum());
        expect(db.sql).toEqual('SELECT SUM("Book"."price") FROM "Book"');
    });

    it('multiple columns', () => {
        db.from(BOOK).select(BOOK.title.lower(), BOOK.author, BOOK.price);
        expect(db.sql).toEqual('SELECT LOWER("Book"."title"), "Book"."author", "Book"."price" FROM "Book"');
        db.from(BOOK).select(BOOK.title, BOOK.$all.count(), BOOK.price.sum());
        expect(db.sql).toEqual('SELECT "Book"."title", COUNT("Book".*), SUM("Book"."price") FROM "Book"');
    });

    it('multiple tables', () => {
        db.from(BOOK, AUTHOR).select(BOOK.title.lower(), AUTHOR.name, BOOK.price);
        expect(db.sql).toEqual('SELECT LOWER("Book"."title"), "Author"."name", "Book"."price" FROM "Book", "Author"');
        db.from(BOOK, AUTHOR).select(AUTHOR.name.upper(), BOOK.$all.count(), BOOK.price.sum());
        expect(db.sql).toEqual('SELECT UPPER("Author"."name"), COUNT("Book".*), SUM("Book"."price") FROM "Book", "Author"');
        db.from(BOOK, AUTHOR).select(AUTHOR.name.upper(), BOOK.$all);
        expect(db.sql).toEqual('SELECT UPPER("Author"."name"), "Book".* FROM "Book", "Author"');
    });

    it('"as" keyword', () => {
        db.from(BOOK).select(BOOK.price.sum().as('sum'));
        expect(db.sql).toEqual('SELECT SUM("Book"."price") AS "sum" FROM "Book"');
        db.from(BOOK).select(BOOK.author, BOOK.price.as('pr'));
        expect(db.sql).toEqual('SELECT "Book"."author", "Book"."price" AS "pr" FROM "Book"');
    });

    it('"distinct" keyword', () => {
        db.from(BOOK).distinct().select();
        expect(db.sql).toEqual('SELECT DISTINCT * FROM "Book"');
        db.from(BOOK).distinct().select(BOOK.author);
        expect(db.sql).toEqual('SELECT DISTINCT "Book"."author" FROM "Book"');
    });
});
