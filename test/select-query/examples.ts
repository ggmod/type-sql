import { BOOK } from '../tables/book';
import { sync } from "../config/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../config/db";

export default (db: QuerySource, log: TestLog) => {

    describe('Random examples', () => {
        it('basic queries', sync(async () => {

            await db.from(BOOK)
                .where(BOOK.author.eq('xy'))
                .offset(10)
                .limit(2)
                .orderBy(BOOK.title.asc().nullsLast())
                .select(BOOK.id, BOOK.title.lower());

            let s1 = `SELECT "Book"."id", LOWER("Book"."title") FROM "Book" WHERE "Book"."author" = 'xy' ORDER BY "Book"."title" IS NULL ASC, "Book"."title" ASC LIMIT 2 OFFSET 10`;
            expect(log.sql).toEqual(s1);

            await db.from(BOOK)
                .where(BOOK.price.gt(100))
                .groupBy(BOOK.author)
                .having(BOOK.$all.count().gt(10).or(BOOK.author.startsWith('X')))
                .orderBy(BOOK.$all.count().desc(), BOOK.author.asc())
                .select(BOOK.$all.count(), BOOK.author);

            let s2 = `SELECT COUNT(*), "Book"."author" FROM "Book" WHERE "Book"."price" > 100 GROUP BY "Book"."author" HAVING COUNT(*) > 10 OR "Book"."author" LIKE 'X%' ORDER BY COUNT(*) DESC, "Book"."author" ASC`;
            expect(log.sql).toEqual(s2);
        }));

        it('condition field types', sync(async () => {
            await db.from(BOOK).where(
                BOOK.title.eq('asd'),
                BOOK.price.eq(10),
                BOOK.available.eq(true),
                BOOK.date.eq(new Date('2016-10-23T19:11:25.342Z'))
            ).select();

            let s1 = `SELECT * FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" = 10 AND "Book"."available" = TRUE AND "Book"."date" = '2016-10-23T19:11:25.342Z'`;
            expect(log.sql).toEqual(s1);
        }));
    });
}
