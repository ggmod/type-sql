import Book from './book';
import Author from './author';
import QuerySource from "../src/builder/query-source";
import DefaultQueryProcessor from "../src/defeault-processor";

let db = new QuerySource(new DefaultQueryProcessor());

describe('ORDER BY', () => {
    it('single column', () => {
        expect(db.from(Book).orderBy(Book.title).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title"');
        expect(db.from(Book).orderBy(Book.title.asc()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC');
        expect(db.from(Book).orderBy(Book.title.desc()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC');
        expect(db.from(Book).orderBy(Book.title.asc().nullsFirst()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST');
        expect(db.from(Book).orderBy(Book.title.asc().nullsLast()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS LAST');
        expect(db.from(Book).orderBy(Book.title.desc().nullsFirst()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC NULLS FIRST');
        expect(db.from(Book).orderBy(Book.title.desc().nullsLast()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC NULLS LAST');
    });

    it('multiple columns', () => {
        expect(db.from(Book).orderBy(Book.title, Book.author).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title", "Book"."author"');
        expect(db.from(Book).orderBy(Book.title.asc().nullsFirst(), Book.author).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST, "Book"."author"');
        expect(db.from(Book).orderBy(Book.title, Book.author.desc()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title", "Book"."author" DESC');
        expect(db.from(Book).orderBy(Book.title.asc().nullsFirst(), Book.author.desc().nullsLast()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST, "Book"."author" DESC NULLS LAST');
    });

    it('using modified columns', () => {
        expect(db.from(Book).orderBy(Book.title.lower()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY LOWER("Book"."title")');
        expect(db.from(Book).orderBy(Book.title.lower().desc().nullsFirst()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY LOWER("Book"."title") DESC NULLS FIRST');
        expect(db.from(Book).orderBy(Book.title.upper().asc(), Book.author).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY UPPER("Book"."title") ASC, "Book"."author"');
    });

    it('multiple tables', () => {
        expect(db.from(Book, Author).orderBy(Book.title, Author.name).select().toSQL())
            .toEqual('SELECT * FROM "Book", "Author" ORDER BY "Book"."title", "Author"."name"');
        expect(db.from(Book, Author).orderBy(Book.title, Author.name.lower().asc(), Book.id.desc()).select().toSQL())
            .toEqual('SELECT * FROM "Book", "Author" ORDER BY "Book"."title", LOWER("Author"."name") ASC, "Book"."id" DESC');
    });
});
