import {BOOK, Book} from '../tables/book';
import { AUTHOR } from '../tables/author';
import { BOOK_ORDER } from '../tables/book-order';
import { BOOK_TYPE } from '../tables/book-type';
import { TestQuerySource } from '../utils';
import { DefaultQueryProcessor } from "../../dist";

let db = new TestQuerySource(new DefaultQueryProcessor({ parameterized: true }));

describe('Parameterized queries', () => {

    it('basic query', () => {
        db.from(BOOK)
            .where(BOOK.author.eq('xy'), BOOK.title.eq('asd'))
            .offset(10)
            .limit(2)
            .orderBy(BOOK.title.asc())
            .select(BOOK.id, BOOK.title.lower());

        let s = `SELECT "Book"."id", LOWER("Book"."title") FROM "Book" WHERE "Book"."author" = $1 AND "Book"."title" = $2 ORDER BY "Book"."title" ASC OFFSET 10 LIMIT 2`;

        expect(db.sql).toEqual(s);
        expect(db.params).toEqual(['xy', 'asd']);
    });

    it('nested conditions', () => {
        db.from(BOOK).where(BOOK.id.gt(150).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200))))).select();
        let s = `SELECT * FROM "Book" WHERE "Book"."id" > $1 OR ( "Book"."id" <= $2 AND ( "Book"."price" < $3 OR "Book"."price" > $4 ) )`;

        expect(db.sql).toEqual(s);
        expect(db.params).toEqual([150, 50, 100, 200]);

        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).$().not().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        let s2 = `SELECT * FROM "Book" WHERE NOT ( "Book"."id" > $1 OR "Book"."id" <= $2 ) AND ( "Book"."price" < $3 OR "Book"."price" > $4 )`;
        expect(db.sql).toEqual(s2);
        expect(db.params).toEqual([100, 50, 100, 200]);
    });

    it('"IN" keyword', () => {
        db.from(BOOK).where(BOOK.title.isNotNull(), BOOK.id.in([11, 12, 13])).select();
        let s = `SELECT * FROM "Book" WHERE "Book"."title" IS NOT NULL AND "Book"."id" IN ($1, $2, $3)`;

        expect(db.sql).toEqual(s);
        expect(db.params).toEqual([11, 12, 13]);
    });

    it('INSERT, UPDATE', () => {
        db.table(BOOK).insert({
            author: 'xy',
            available: true,
            data: { x: 2, y: 10 },
            date: new Date('2016-10-23T19:11:25.342Z'),
            price: 10,
            title: 'asd'
        });
        expect(db.sql).toEqual(`INSERT INTO "Book" ("author", "available", "data", "date", "price", "title") VALUES ($1, $2, $3, $4, $5, $6)`);
        expect(db.params).toEqual(['xy', true, { x: 2, y: 10 }, new Date('2016-10-23T19:11:25.342Z'), 10, 'asd']);

        db.table(BOOK).update(12, {
            author: 'xy',
            available: true,
            data: { x: 2, y: 10 },
            date: new Date('2016-10-23T19:11:25.342Z'),
            price: 10,
            title: 'asd'
        });
        expect(db.sql).toEqual(`UPDATE "Book" SET "author" = $1, "available" = $2, "data" = $3, "date" = $4, "price" = $5, "title" = $6 WHERE "Book"."id" = $7`);
        expect(db.params).toEqual(['xy', true, { x: 2, y: 10 }, new Date('2016-10-23T19:11:25.342Z'), 10, 'asd', 12]);
    });

    it('ID types', () => {
        db.table(AUTHOR).get(12345);
        expect(db.sql).toEqual(`SELECT * FROM "Author" WHERE "Author"."id" = $1`);
        expect(db.params).toEqual([12345]);

        db.table(BOOK_TYPE).get('1-1-1-1');
        expect(db.sql).toEqual(`SELECT * FROM "BookType" WHERE "BookType"."name" = $1`);
        expect(db.params).toEqual(['1-1-1-1']);

        db.table(BOOK_ORDER).get({ bookId: 11, orderId: 22 });
        expect(db.sql).toEqual(`SELECT * FROM "BookOrder" WHERE "BookOrder"."bookId" = $1 AND "BookOrder"."orderId" = $2`);
        expect(db.params).toEqual([11, 22]);
    });

    it('INSERT multiple values with different columns', () => {
        let e = { title: 'qwe', author: 'xy' } as Book;
        let e2 = { title: 'asd', price: 10 } as Book;
        db.table(BOOK).insert([e, e2]);
        expect(db.sql).toEqual(`INSERT INTO "Book" ("author", "price", "title") VALUES ($1, NULL, $2), (NULL, $3, $4)`);
        expect(db.params).toEqual(['xy', 'qwe', 10, 'asd']);
    });

    it('UPDATE set to null', () => {
        let e = { title: null } as any as Book;
        db.table(BOOK).updateAll(e);
        expect(db.sql).toEqual(`UPDATE "Book" SET "title" = NULL`);
        expect(db.params).toEqual([]);

        let e2 = { author: undefined } as any as Book;
        db.table(BOOK).updateAll(e2);
        expect(db.sql).toEqual(`UPDATE "Book" SET "author" = NULL`);
        expect(db.params).toEqual([]);
    });
});

