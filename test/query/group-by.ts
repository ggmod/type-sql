import BOOK from '../tables/book';
import { db } from '../utils';

describe('GROUP BY', () => {

    it('basics', () => {
        expect(db.from(BOOK).groupBy(BOOK.id).select().toSQL())
            .toEqual('SELECT * FROM "Book" GROUP BY "Book"."id"');
        expect(db.from(BOOK).groupBy(BOOK.author).select(BOOK.author).toSQL())
            .toEqual('SELECT "Book"."author" FROM "Book" GROUP BY "Book"."author"');
        expect(db.from(BOOK).groupBy(BOOK.author).select(BOOK.author, BOOK.$all.count()).toSQL())
            .toEqual('SELECT "Book"."author", COUNT("Book".*) FROM "Book" GROUP BY "Book"."author"');
        expect(db.from(BOOK).groupBy(BOOK.author, BOOK.available).select(BOOK.author, BOOK.$all.count()).toSQL())
            .toEqual('SELECT "Book"."author", COUNT("Book".*) FROM "Book" GROUP BY "Book"."author", "Book"."available"');
    });

    it('having conditions', () => {
        expect(db.from(BOOK).groupBy(BOOK.author).having(BOOK.id.count().gt(10)).select(BOOK.id.count(), BOOK.author).toSQL())
            .toEqual('SELECT COUNT("Book"."id"), "Book"."author" FROM "Book" GROUP BY "Book"."author" HAVING COUNT("Book"."id") > 10');

        let q1 = db.from(BOOK)
            .where(BOOK.author.ne('xy'))
            .groupBy(BOOK.author)
            .having(BOOK.id.count().gte(0))
            .orderBy(BOOK.id.count().desc())
            .select(BOOK.id.count(), BOOK.author);
        let s1 = `SELECT COUNT("Book"."id"), "Book"."author" FROM "Book" WHERE "Book"."author" <> 'xy' GROUP BY "Book"."author" HAVING COUNT("Book"."id") >= 0 ORDER BY COUNT("Book"."id") DESC`;
        expect(q1.toSQL()).toEqual(s1);

        let q2 = db.from(BOOK)
            .groupBy(BOOK.author)
            .having(BOOK.author.like('%y').and(BOOK.id.count().lt(100).or(BOOK.id.count().gt(200))))
            .select(BOOK.id.count());
        let s2 = `SELECT COUNT("Book"."id") FROM "Book" GROUP BY "Book"."author" HAVING "Book"."author" LIKE '%y' AND ( COUNT("Book"."id") < 100 OR COUNT("Book"."id") > 200 )`;
        expect(q2.toSQL()).toEqual(s2);
   });
});
