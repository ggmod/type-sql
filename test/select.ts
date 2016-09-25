import BOOK from './book';
import AUTHOR from './author';
import QuerySource from "../src/builder/query-source";
import DefaultQueryProcessor from "../src/defeault-processor";

let db = new QuerySource(new DefaultQueryProcessor());

describe('SELECT', () => {
    it('single column', () => {
        expect(db.from(BOOK).select().toSQL())
            .toEqual('SELECT * FROM "Book"');
        expect(db.from(BOOK).select(BOOK.$all).toSQL())
            .toEqual('SELECT "Book".* FROM "Book"');
        expect(db.from(BOOK).select(BOOK.title).toSQL())
            .toEqual('SELECT "Book"."title" FROM "Book"');
        expect(db.from(BOOK).select(BOOK.title.lower()).toSQL())
            .toEqual('SELECT LOWER("Book"."title") FROM "Book"');
        expect(db.from(BOOK).select(BOOK.$all.count()).toSQL())
            .toEqual('SELECT COUNT("Book".*) FROM "Book"');
        expect(db.from(BOOK).select(BOOK.price.sum()).toSQL())
            .toEqual('SELECT SUM("Book"."price") FROM "Book"');
    });

    it('multiple columns', () => {
        expect(db.from(BOOK).select(BOOK.title.lower(), BOOK.author, BOOK.price).toSQL())
            .toEqual('SELECT LOWER("Book"."title"), "Book"."author", "Book"."price" FROM "Book"');
        expect(db.from(BOOK).select(BOOK.title, BOOK.$all.count(), BOOK.price.sum()).toSQL())
            .toEqual('SELECT "Book"."title", COUNT("Book".*), SUM("Book"."price") FROM "Book"');
    });

    it('multiple tables', () => {
        expect(db.from(BOOK, AUTHOR).select(BOOK.title.lower(), AUTHOR.name, BOOK.price).toSQL())
            .toEqual('SELECT LOWER("Book"."title"), "Author"."name", "Book"."price" FROM "Book", "Author"');
        expect(db.from(BOOK, AUTHOR).select(AUTHOR.name.upper(), BOOK.$all.count(), BOOK.price.sum()).toSQL())
            .toEqual('SELECT UPPER("Author"."name"), COUNT("Book".*), SUM("Book"."price") FROM "Book", "Author"');
    })
});
