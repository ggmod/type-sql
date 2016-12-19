import { BOOK } from '../tables/book';
import { getDB } from '../config/db';
import { sync } from "../config/utils";

let { db, log } = getDB();

describe('Random examples', () => {
    it('basic queries', sync(async () => {

        await db.from(BOOK)
            .where(BOOK.author.eq('xy'))
            .offset(10)
            .limit(2)
            .orderBy(BOOK.title.asc())
            .select(BOOK.id, BOOK.title.lower());

        let s1 = `SELECT "Book"."id", LOWER("Book"."title") FROM "Book" WHERE "Book"."author" = 'xy' ORDER BY "Book"."title" ASC OFFSET 10 LIMIT 2`;

        expect(log.sql).toEqual(s1);
    }));
});

