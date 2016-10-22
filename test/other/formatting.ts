import QuerySource from "../../src/builder/query-source";
import DefaultQueryProcessor from "../../src/defeault-processor";
import BOOK from '../tables/book';
import AUTHOR from '../tables/author';

let db = new QuerySource(new DefaultQueryProcessor({ lineBreaks: true }));

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
    it('examples', () => {
        expect(q1.toSQL()).toEqual(s1);
    });
});

