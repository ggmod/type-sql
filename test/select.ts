import Book from './book';
import Author from './author';
import QuerySource from "../src/builder/query-source";
import DefaultQueryProcessor from "../src/defeault-processor";

let db = new QuerySource(new DefaultQueryProcessor());

describe('SELECT', () => {
    it('single column', () => {
        expect(db.from(Book).select().toSQL())
            .toEqual('SELECT * FROM "Book"');
        expect(db.from(Book).select(Book.$all).toSQL())
            .toEqual('SELECT "Book".* FROM "Book"');
        expect(db.from(Book).select(Book.title).toSQL())
            .toEqual('SELECT "Book"."title" FROM "Book"');
        expect(db.from(Book).select(Book.title.lower()).toSQL())
            .toEqual('SELECT LOWER("Book"."title") FROM "Book"');
        expect(db.from(Book).select(Book.$all.count()).toSQL())
            .toEqual('SELECT COUNT("Book".*) FROM "Book"');
        expect(db.from(Book).select(Book.price.sum()).toSQL())
            .toEqual('SELECT SUM("Book"."price") FROM "Book"');
    });

    it('multiple columns', () => {
        expect(db.from(Book).select(Book.title.lower(), Book.author, Book.price).toSQL())
            .toEqual('SELECT LOWER("Book"."title"), "Book"."author", "Book"."price" FROM "Book"');
        expect(db.from(Book).select(Book.title, Book.$all.count(), Book.price.sum()).toSQL())
            .toEqual('SELECT "Book"."title", COUNT("Book".*), SUM("Book"."price") FROM "Book"');
    });

    it('multiple tables', () => {
        expect(db.from(Book, Author).select(Book.title.lower(), Author.name, Book.price).toSQL())
            .toEqual('SELECT LOWER("Book"."title"), "Author"."name", "Book"."price" FROM "Book", "Author"');
        expect(db.from(Book, Author).select(Author.name.upper(), Book.$all.count(), Book.price.sum()).toSQL())
            .toEqual('SELECT UPPER("Author"."name"), COUNT("Book".*), SUM("Book"."price") FROM "Book", "Author"');
    })
});
