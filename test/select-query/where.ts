import { BOOK } from '../tables/book';
import { ORDER } from '../tables/order';
import { getDB } from '../config/db';
import { sync } from "../config/utils";

let { db, log } = getDB();

describe('WHERE', () => {

    it('single condition', sync(async () => {
        await db.from(BOOK).where(BOOK.title.eq('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd'`);
        await db.from(BOOK).where(BOOK.title.lower().eq('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE LOWER("Book"."title") = 'asd'`);
        await db.from(BOOK).where(BOOK.title.isNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IS NULL`);
        await db.from(BOOK).where(BOOK.title.isNotNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IS NOT NULL`);

        await db.from(BOOK).where(BOOK.title.like('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE 'asd'`);
        await db.from(BOOK).where(BOOK.title.contains('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%asd%'`);
        await db.from(BOOK).where(BOOK.title.startsWith('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE 'asd%'`);
        await db.from(BOOK).where(BOOK.title.endsWith('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%asd'`);
        await db.from(BOOK).where(BOOK.title.notLike('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" NOT LIKE 'asd'`);
        await db.from(BOOK).where(BOOK.title.lower().like('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE LOWER("Book"."title") LIKE 'asd'`);

        await db.from(BOOK).where(BOOK.title.lt('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" < 'asd'`);
        await db.from(BOOK).where(BOOK.title.gt('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" > 'asd'`);
        await db.from(BOOK).where(BOOK.title.lte('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <= 'asd'`);
        await db.from(BOOK).where(BOOK.title.gte('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" >= 'asd'`);
        await db.from(BOOK).where(BOOK.title.ne('asd')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <> 'asd'`);

        await db.from(BOOK).where(BOOK.price.lt(100)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" < 100`);
        await db.from(BOOK).where(BOOK.price.gt(100)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" > 100`);
        await db.from(BOOK).where(BOOK.price.lte(100)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" <= 100`);
        await db.from(BOOK).where(BOOK.price.gte(100)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" >= 100`);
        await db.from(BOOK).where(BOOK.price.eq(100)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" = 100`);
        await db.from(BOOK).where(BOOK.price.ne(100)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" <> 100`);
        await db.from(BOOK).where(BOOK.price.isNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" IS NULL`);
        await db.from(BOOK).where(BOOK.price.isNotNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" IS NOT NULL`);

        await db.from(BOOK).where(BOOK.title.in(['ab', 'cd', 'ef'])).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IN ('ab', 'cd', 'ef')`);
        await db.from(BOOK).where(BOOK.title.notIn(['ab', 'cd', 'ef'])).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" NOT IN ('ab', 'cd', 'ef')`);
        await db.from(BOOK).where(BOOK.id.in([1, 2, 3])).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" IN (1, 2, 3)`);
        await db.from(BOOK).where(BOOK.id.notIn([1, 2, 3])).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" NOT IN (1, 2, 3)`);

        await db.from(BOOK).where(BOOK.title.between('a', 'c')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" BETWEEN 'a' AND 'c'`);
        await db.from(BOOK).where(BOOK.title.notBetween('a', 'c')).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" NOT BETWEEN 'a' AND 'c'`);
        await db.from(BOOK).where(BOOK.id.between(1, 3)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" BETWEEN 1 AND 3`);
        await db.from(BOOK).where(BOOK.id.notBetween(1, 3)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" NOT BETWEEN 1 AND 3`);

        await db.from(BOOK).where(BOOK.available.eq(true)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" = TRUE`);
        await db.from(BOOK).where(BOOK.available.ne(false)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" <> FALSE`);
        await db.from(BOOK).where(BOOK.available.isNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" IS NULL`);
        await db.from(BOOK).where(BOOK.available.isNotNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" IS NOT NULL`);

        await db.from(BOOK).where(BOOK.data.isNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."data" IS NULL`);
        await db.from(BOOK).where(BOOK.data.isNotNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."data" IS NOT NULL`);

        let date = new Date('2016-10-23T19:11:25.342Z');
        let date2 = new Date('2016-10-24T20:10:10.100Z');

        await db.from(BOOK).where(BOOK.date.eq(date)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" = '2016-10-23T19:11:25.342Z'`);
        await db.from(BOOK).where(BOOK.date.ne(date)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" <> '2016-10-23T19:11:25.342Z'`);
        await db.from(BOOK).where(BOOK.date.isNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" IS NULL`);
        await db.from(BOOK).where(BOOK.date.isNotNull()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" IS NOT NULL`);
        await db.from(BOOK).where(BOOK.date.lt(date)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" < '2016-10-23T19:11:25.342Z'`);
        await db.from(BOOK).where(BOOK.date.gt(date)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" > '2016-10-23T19:11:25.342Z'`);
        await db.from(BOOK).where(BOOK.date.lte(date)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" <= '2016-10-23T19:11:25.342Z'`);
        await db.from(BOOK).where(BOOK.date.gte(date)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" >= '2016-10-23T19:11:25.342Z'`);
        await db.from(BOOK).where(BOOK.date.between(date, date2)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" BETWEEN '2016-10-23T19:11:25.342Z' AND '2016-10-24T20:10:10.100Z'`);
        await db.from(BOOK).where(BOOK.date.notBetween(date, date2)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" NOT BETWEEN '2016-10-23T19:11:25.342Z' AND '2016-10-24T20:10:10.100Z'`);
    }));

    it('multiple conditions', sync(async () => {
        await db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        await db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100), BOOK.price.gt(50)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 AND "Book"."price" > 50`);
    }));

    it('chained conditions', sync(async () => {
        await db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        await db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100)).and(BOOK.price.gt(50))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 AND "Book"."price" > 50`);
        await db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100)).or(BOOK.price.gt(50))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 OR "Book"."price" > 50`);
    }));

    it('nested conditions', sync(async () => {
        await db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).$().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    }));

    it('multiple nested conditions', sync(async () => {
        await db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100).or(BOOK.price.gt(200))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)), BOOK.price.lt(100).or(BOOK.price.gt(200))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    }));

    it('multiple tables', sync(async () => {
        await db.from(BOOK, ORDER).where(BOOK.price.lt(300), ORDER.quantity.eq(2)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book", "Order" WHERE "Book"."price" < 300 AND "Order"."quantity" = 2`);
        await db.from(BOOK, ORDER).where(BOOK.price.lt(300).and(ORDER.quantity.eq(2))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book", "Order" WHERE "Book"."price" < 300 AND "Order"."quantity" = 2`);
    }));

    it('multi-level nesting', sync(async () => {
        await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200))))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" > 100 OR ( "Book"."id" <= 50 AND ( "Book"."price" < 100 OR "Book"."price" > 200 ) )`);
    }));

    it('join condition', sync(async () => {
        await db.from(BOOK, ORDER).where(BOOK.id.eq(ORDER.bookId)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book", "Order" WHERE "Book"."id" = "Order"."bookId"`);
        await db.from(BOOK, ORDER).where(ORDER.bookId.eq(BOOK.id)).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book", "Order" WHERE "Order"."bookId" = "Book"."id"`);
    }));

    it('negation operator', sync(async () => {
        await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).not()).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE NOT ( "Book"."id" > 100 OR "Book"."id" <= 50 )`);
        await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200)).not()).not())).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" > 100 OR NOT ( "Book"."id" <= 50 AND NOT ( "Book"."price" < 100 OR "Book"."price" > 200 ) )`);
        await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).$().not().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE NOT ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).not().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE NOT ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    }));
});
