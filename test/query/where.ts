import BOOK from '../tables/book';
import AUTHOR from '../tables/author';
import { db } from '../utils';

describe('WHERE', () => {

    it('single condition', () => {
        db.from(BOOK).where(BOOK.title.eq('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd'`);
        db.from(BOOK).where(BOOK.title.lower().eq('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE LOWER("Book"."title") = 'asd'`);
        db.from(BOOK).where(BOOK.title.isNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IS NULL`);
        db.from(BOOK).where(BOOK.title.isNotNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IS NOT NULL`);

        db.from(BOOK).where(BOOK.title.like('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE 'asd'`);
        db.from(BOOK).where(BOOK.title.contains('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%asd%'`);
        db.from(BOOK).where(BOOK.title.startsWith('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE 'asd%'`);
        db.from(BOOK).where(BOOK.title.endsWith('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE '%asd'`);
        db.from(BOOK).where(BOOK.title.notLike('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" NOT LIKE 'asd'`);
        db.from(BOOK).where(BOOK.title.lower().like('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE LOWER("Book"."title") LIKE 'asd'`);

        db.from(BOOK).where(BOOK.title.lt('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" < 'asd'`);
        db.from(BOOK).where(BOOK.title.gt('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" > 'asd'`);
        db.from(BOOK).where(BOOK.title.lte('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <= 'asd'`);
        db.from(BOOK).where(BOOK.title.gte('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" >= 'asd'`);
        db.from(BOOK).where(BOOK.title.ne('asd')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" <> 'asd'`);

        db.from(BOOK).where(BOOK.price.lt(100)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" < 100`);
        db.from(BOOK).where(BOOK.price.gt(100)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" > 100`);
        db.from(BOOK).where(BOOK.price.lte(100)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" <= 100`);
        db.from(BOOK).where(BOOK.price.gte(100)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" >= 100`);
        db.from(BOOK).where(BOOK.price.eq(100)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" = 100`);
        db.from(BOOK).where(BOOK.price.ne(100)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" <> 100`);
        db.from(BOOK).where(BOOK.price.isNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" IS NULL`);
        db.from(BOOK).where(BOOK.price.isNotNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."price" IS NOT NULL`);

        db.from(BOOK).where(BOOK.title.in(['ab', 'cd', 'ef'])).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IN ('ab', 'cd', 'ef')`);
        db.from(BOOK).where(BOOK.title.notIn(['ab', 'cd', 'ef'])).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" NOT IN ('ab', 'cd', 'ef')`);
        db.from(BOOK).where(BOOK.id.in([1, 2, 3])).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" IN (1, 2, 3)`);
        db.from(BOOK).where(BOOK.id.notIn([1, 2, 3])).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" NOT IN (1, 2, 3)`);

        db.from(BOOK).where(BOOK.title.between('a', 'c')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" BETWEEN 'a' AND 'c'`);
        db.from(BOOK).where(BOOK.title.notBetween('a', 'c')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" NOT BETWEEN 'a' AND 'c'`);
        db.from(BOOK).where(BOOK.id.between(1, 3)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" BETWEEN 1 AND 3`);
        db.from(BOOK).where(BOOK.id.notBetween(1, 3)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" NOT BETWEEN 1 AND 3`);

        db.from(BOOK).where(BOOK.available.eq(true)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" = TRUE`);
        db.from(BOOK).where(BOOK.available.ne(false)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" <> FALSE`);
        db.from(BOOK).where(BOOK.available.isNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" IS NULL`);
        db.from(BOOK).where(BOOK.available.isNotNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."available" IS NOT NULL`);

        db.from(BOOK).where(BOOK.data.isNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."data" IS NULL`);
        db.from(BOOK).where(BOOK.data.isNotNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."data" IS NOT NULL`);

        let date = new Date('2016-10-23T19:11:25.342Z');
        let date2 = new Date('2016-10-24T20:10:10.100Z');

        db.from(BOOK).where(BOOK.date.eq(date)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" = '2016-10-23T19:11:25.342Z'`);
        db.from(BOOK).where(BOOK.date.ne(date)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" <> '2016-10-23T19:11:25.342Z'`);
        db.from(BOOK).where(BOOK.date.isNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" IS NULL`);
        db.from(BOOK).where(BOOK.date.isNotNull()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" IS NOT NULL`);
        db.from(BOOK).where(BOOK.date.lt(date)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" < '2016-10-23T19:11:25.342Z'`);
        db.from(BOOK).where(BOOK.date.gt(date)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" > '2016-10-23T19:11:25.342Z'`);
        db.from(BOOK).where(BOOK.date.lte(date)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" <= '2016-10-23T19:11:25.342Z'`);
        db.from(BOOK).where(BOOK.date.gte(date)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" >= '2016-10-23T19:11:25.342Z'`);
        db.from(BOOK).where(BOOK.date.between(date, date2)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" BETWEEN '2016-10-23T19:11:25.342Z' AND '2016-10-24T20:10:10.100Z'`);
        db.from(BOOK).where(BOOK.date.notBetween(date, date2)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."date" NOT BETWEEN '2016-10-23T19:11:25.342Z' AND '2016-10-24T20:10:10.100Z'`);
    });

    it('multiple conditions', () => {
        db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100), BOOK.price.gt(50)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 AND "Book"."price" > 50`);
    });

    it('chained conditions', () => {
        db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100)).and(BOOK.price.gt(50))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 AND "Book"."price" > 50`);
        db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100)).or(BOOK.price.gt(50))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100 OR "Book"."price" > 50`);
    });

    it('nested conditions', () => {
        db.from(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).$().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    });

    it('multiple nested conditions', () => {
        db.from(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100).or(BOOK.price.gt(200))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)), BOOK.price.lt(100).or(BOOK.price.gt(200))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    });

    it('multiple tables', () => {
        db.from(BOOK, AUTHOR).where(BOOK.price.lt(300), AUTHOR.name.eq('xy')).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book", "Author" WHERE "Book"."price" < 300 AND "Author"."name" = 'xy'`);
        db.from(BOOK, AUTHOR).where(BOOK.price.lt(300).and(AUTHOR.name.eq('xy'))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book", "Author" WHERE "Book"."price" < 300 AND "Author"."name" = 'xy'`);
    });

    it('multi-level nesting', () => {
        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200))))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" > 100 OR ( "Book"."id" <= 50 AND ( "Book"."price" < 100 OR "Book"."price" > 200 ) )`);
    });

    it('join condition', () => {
        db.from(BOOK, AUTHOR).where(BOOK.authorId.eq(AUTHOR.id)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book", "Author" WHERE "Book"."author_id" = "Author"."id"`);
        db.from(BOOK, AUTHOR).where(AUTHOR.id.eq(BOOK.authorId)).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book", "Author" WHERE "Author"."id" = "Book"."author_id"`);
    });

    it('negation operator', () => {
        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).not()).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE NOT ( "Book"."id" > 100 OR "Book"."id" <= 50 )`);
        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200)).not()).not())).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" > 100 OR NOT ( "Book"."id" <= 50 AND NOT ( "Book"."price" < 100 OR "Book"."price" > 200 ) )`);
        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).$().not().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE NOT ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
        db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).not().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();
        expect(db.sql).toEqual(`SELECT * FROM "Book" WHERE NOT ( "Book"."id" > 100 OR "Book"."id" <= 50 ) AND ( "Book"."price" < 100 OR "Book"."price" > 200 )`);
    });
});
