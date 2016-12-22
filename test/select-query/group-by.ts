import { BOOK } from '../tables/book';
import { sync } from '../config/utils';
import { QuerySource } from "../../dist";
import { TestLog } from "../config/db";

export default (db: QuerySource, log: TestLog) => {

    describe('GROUP BY', () => {
        it('basics', sync(async () => {
            await db.from(BOOK).groupBy(BOOK.id).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" GROUP BY "Book"."id"');
            await db.from(BOOK).groupBy(BOOK.author).select(BOOK.author);
            expect(log.sql).toEqual('SELECT "Book"."author" FROM "Book" GROUP BY "Book"."author"');
            await db.from(BOOK).groupBy(BOOK.author).select(BOOK.author, BOOK.$all.count());
            expect(log.sql).toEqual('SELECT "Book"."author", COUNT(*) FROM "Book" GROUP BY "Book"."author"');
            await db.from(BOOK).groupBy(BOOK.author, BOOK.available).select(BOOK.author, BOOK.$all.count());
            expect(log.sql).toEqual('SELECT "Book"."author", COUNT(*) FROM "Book" GROUP BY "Book"."author", "Book"."available"');
        }));

        it('having conditions', sync(async () => {
            await db.from(BOOK).groupBy(BOOK.author).having(BOOK.id.count().gt(10)).select(BOOK.id.count(), BOOK.author);
            expect(log.sql).toEqual('SELECT COUNT("Book"."id"), "Book"."author" FROM "Book" GROUP BY "Book"."author" HAVING COUNT("Book"."id") > 10');

            await db.from(BOOK)
                .where(BOOK.author.ne('xy'))
                .groupBy(BOOK.author)
                .having(BOOK.id.count().gte(0))
                .orderBy(BOOK.id.count().desc())
                .select(BOOK.id.count(), BOOK.author);
            let s1 = `SELECT COUNT("Book"."id"), "Book"."author" FROM "Book" WHERE "Book"."author" <> 'xy' GROUP BY "Book"."author" HAVING COUNT("Book"."id") >= 0 ORDER BY COUNT("Book"."id") DESC`;
            expect(log.sql).toEqual(s1);

            await db.from(BOOK)
                .groupBy(BOOK.author)
                .having(BOOK.author.like('%y').and(BOOK.id.count().lt(100).or(BOOK.id.count().gt(200))))
                .select(BOOK.id.count());
            let s2 = `SELECT COUNT("Book"."id") FROM "Book" GROUP BY "Book"."author" HAVING "Book"."author" LIKE '%y' AND ( COUNT("Book"."id") < 100 OR COUNT("Book"."id") > 200 )`;
            expect(log.sql).toEqual(s2);
        }));
    });
}
