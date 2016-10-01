import BOOK from './book';
import AUTHOR from './author';
import { db } from './utils';

describe('WHERE', () => {

    it('single condition', () => {
        expect(db.from(BOOK).where(BOOK.title.eq('asd')).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd'`);
        expect(db.from(BOOK).where(BOOK.title.lower().eq('asd')).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE LOWER("Book"."title") = 'asd'`);
        expect(db.from(BOOK).where(BOOK.title.isNull()).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IS NULL`);
        expect(db.from(BOOK).where(BOOK.title.isNotNull()).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IS NOT NULL`);

        expect(db.from(BOOK).where(BOOK.title.like('asd')).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE 'asd'`);
        expect(db.from(BOOK).where(BOOK.title.contains('asd')).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%asd%'`);
        expect(db.from(BOOK).where(BOOK.title.startsWith('asd')).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE 'asd%'`);
        expect(db.from(BOOK).where(BOOK.title.endsWith('asd')).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%asd'`);
        expect(db.from(BOOK).where(BOOK.title.lower().like('asd')).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE LOWER("Book"."title") LIKE 'asd'`);

        expect(db.from(BOOK).where(BOOK.price.lt(100)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" < 100`);
        expect(db.from(BOOK).where(BOOK.price.gt(100)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" > 100`);
        expect(db.from(BOOK).where(BOOK.price.lte(100)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" <= 100`);
        expect(db.from(BOOK).where(BOOK.price.gte(100)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" >= 100`);
        expect(db.from(BOOK).where(BOOK.price.eq(100)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" = 100`);
        expect(db.from(BOOK).where(BOOK.price.ne(100)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" <> 100`);
        expect(db.from(BOOK).where(BOOK.price.isNull()).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" IS NULL`);
        expect(db.from(BOOK).where(BOOK.price.isNotNull()).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."price" IS NOT NULL`);
    });

    it('multiple conditions', () => {
        expect(db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        expect(db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100), BOOK.price.gt(50)).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 AND "Book"."price" > 50`);
    });

    it('chained conditions', () => {
        expect(db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        expect(db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100)).and(BOOK.price.gt(50))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 AND "Book"."price" > 50`);
        expect(db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100)).or(BOOK.price.gt(50))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 OR "Book"."price" > 50`);
    });

    it('nested conditions', () => {
        expect(db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        expect(db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).$().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    });

    it('multiple nested conditions', () => {
        expect(db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100).or(BOOK.price.gt(200))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        expect(db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)), BOOK.price.lt(100).or(BOOK.price.gt(200))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    });

    it('multiple tables', () => {
        expect(db.from(BOOK, AUTHOR).where(BOOK.price.lt(300), AUTHOR.name.eq('xy')).select().toSQL())
            .toEqual(`SELECT * FROM "Book", "Author" WHERE "Book"."price" < 300 AND "Author"."name" = 'xy'`);
        expect(db.from(BOOK, AUTHOR).where(BOOK.price.lt(300).and(AUTHOR.name.eq('xy'))).select().toSQL())
            .toEqual(`SELECT * FROM "Book", "Author" WHERE "Book"."price" < 300 AND "Author"."name" = 'xy'`);
    });

    it('multi-level nesting', () => {
        expect(db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200))))).select().toSQL())
            .toEqual(`SELECT * FROM "Book" WHERE "Book"."id" > 100 OR ( "Book"."id" <= 50 AND ( "Book"."price" < 100 OR "Book"."price" > 200 ) )`);
    });
});
