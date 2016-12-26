import { BOOK } from '../tables/book';
import { sync } from '../utils/utils';
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";

export default (db: QuerySource, log: TestLog) => {

    describe('Formatting', () => {
        it('examples', sync(async() => {
            await db.from(BOOK)
                .where(BOOK.author.eq('xy'))
                .offset(10)
                .limit(2)
                .orderBy(BOOK.title.asc())
                .select(BOOK.id);

            let s1 =
`SELECT "Book"."id"
FROM "Book"
WHERE "Book"."author" = 'xy'
ORDER BY "Book"."title" ASC
LIMIT 2
OFFSET 10`;
            expect(log.sql).toEqual(s1);
        }));
    });
}
