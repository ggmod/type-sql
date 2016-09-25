import BOOK from './book';
import AUTHOR from './author';
import QuerySource from "../src/builder/query-source";
import DefaultQueryProcessor from "../src/defeault-processor";

let db = new QuerySource(new DefaultQueryProcessor());

describe('ORDER BY', () => {
    it('single column', () => {
        expect(db.from(BOOK).orderBy(BOOK.title).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title"');
        expect(db.from(BOOK).orderBy(BOOK.title.asc()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC');
        expect(db.from(BOOK).orderBy(BOOK.title.desc()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC');
        expect(db.from(BOOK).orderBy(BOOK.title.asc().nullsFirst()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST');
        expect(db.from(BOOK).orderBy(BOOK.title.asc().nullsLast()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS LAST');
        expect(db.from(BOOK).orderBy(BOOK.title.desc().nullsFirst()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC NULLS FIRST');
        expect(db.from(BOOK).orderBy(BOOK.title.desc().nullsLast()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC NULLS LAST');
    });

    it('multiple columns', () => {
        expect(db.from(BOOK).orderBy(BOOK.title, BOOK.author).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title", "Book"."author"');
        expect(db.from(BOOK).orderBy(BOOK.title.asc().nullsFirst(), BOOK.author).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST, "Book"."author"');
        expect(db.from(BOOK).orderBy(BOOK.title, BOOK.author.desc()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title", "Book"."author" DESC');
        expect(db.from(BOOK).orderBy(BOOK.title.asc().nullsFirst(), BOOK.author.desc().nullsLast()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST, "Book"."author" DESC NULLS LAST');
    });

    it('using modified columns', () => {
        expect(db.from(BOOK).orderBy(BOOK.title.lower()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY LOWER("Book"."title")');
        expect(db.from(BOOK).orderBy(BOOK.title.lower().desc().nullsFirst()).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY LOWER("Book"."title") DESC NULLS FIRST');
        expect(db.from(BOOK).orderBy(BOOK.title.upper().asc(), BOOK.author).select().toSQL())
            .toEqual('SELECT * FROM "Book" ORDER BY UPPER("Book"."title") ASC, "Book"."author"');
    });

    it('multiple tables', () => {
        expect(db.from(BOOK, AUTHOR).orderBy(BOOK.title, AUTHOR.name).select().toSQL())
            .toEqual('SELECT * FROM "Book", "Author" ORDER BY "Book"."title", "Author"."name"');
        expect(db.from(BOOK, AUTHOR).orderBy(BOOK.title, AUTHOR.name.lower().asc(), BOOK.id.desc()).select().toSQL())
            .toEqual('SELECT * FROM "Book", "Author" ORDER BY "Book"."title", LOWER("Author"."name") ASC, "Book"."id" DESC');
    });
});
