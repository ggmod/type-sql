import { BOOK } from '../tables/book';
import { createDb } from '../config/db';
import { sync } from '../config/utils';

let { db, log } = createDb({ lineBreaks: true, parameterized: false });

let q1 = db.from(BOOK)
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
OFFSET 10
LIMIT 2`;

describe('Formatting', () => {
    it('examples', sync(async() => {
        await q1;
        expect(log.sql).toEqual(s1);
    }));
});

