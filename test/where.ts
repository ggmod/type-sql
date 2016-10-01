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
});
