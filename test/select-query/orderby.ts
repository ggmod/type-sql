import { BOOK } from '../tables/book';
import { ORDER } from '../tables/order';
import { getDB } from '../config/db';

let { db, log } = getDB();

describe('ORDER BY', () => {
    it('single column', () => {
        db.from(BOOK).orderBy(BOOK.title).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title"');
        db.from(BOOK).orderBy(BOOK.title.asc()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC');
        db.from(BOOK).orderBy(BOOK.title.desc()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC');
        db.from(BOOK).orderBy(BOOK.title.asc().nullsFirst()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST');
        db.from(BOOK).orderBy(BOOK.title.asc().nullsLast()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS LAST');
        db.from(BOOK).orderBy(BOOK.title.desc().nullsFirst()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC NULLS FIRST');
        db.from(BOOK).orderBy(BOOK.title.desc().nullsLast()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" DESC NULLS LAST');
    });

    it('multiple columns', () => {
        db.from(BOOK).orderBy(BOOK.title, BOOK.author).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title", "Book"."author"');
        db.from(BOOK).orderBy(BOOK.title.asc().nullsFirst(), BOOK.author).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST, "Book"."author"');
        db.from(BOOK).orderBy(BOOK.title, BOOK.author.desc()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title", "Book"."author" DESC');
        db.from(BOOK).orderBy(BOOK.title.asc().nullsFirst(), BOOK.author.desc().nullsLast()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY "Book"."title" ASC NULLS FIRST, "Book"."author" DESC NULLS LAST');
    });

    it('using modified columns', () => {
        db.from(BOOK).orderBy(BOOK.title.lower()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY LOWER("Book"."title")');
        db.from(BOOK).orderBy(BOOK.title.lower().desc().nullsFirst()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY LOWER("Book"."title") DESC NULLS FIRST');
        db.from(BOOK).orderBy(BOOK.title.upper().asc(), BOOK.author).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" ORDER BY UPPER("Book"."title") ASC, "Book"."author"');
    });

    it('multiple tables', () => {
        db.from(BOOK, ORDER).orderBy(BOOK.title, ORDER.quantity).select();
        expect(log.sql).toEqual('SELECT * FROM "Book", "Order" ORDER BY "Book"."title", "Order"."quantity"');
        db.from(BOOK, ORDER).orderBy(BOOK.title, ORDER.quantity.max().asc(), BOOK.id.desc()).select();
        expect(log.sql).toEqual('SELECT * FROM "Book", "Order" ORDER BY "Book"."title", MAX("Order"."quantity") ASC, "Book"."id" DESC');
    });
});
