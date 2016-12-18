import { BOOK } from '../tables/book';
import { createDb } from '../config/db';

let { db, log } = createDb({ lineBreaks: true, parameterized: false });

db.from(BOOK)
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
    it('examples', () => {
        expect(log.sql).toEqual(s1);
    });
});

