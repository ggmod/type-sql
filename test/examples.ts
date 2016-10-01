import BOOK from './book';
import AUTHOR from './author';
import { db } from './utils';


describe('Random examples', () => {
    it('basic queries', () => {

        let q1 = db.from(BOOK)
            .where(BOOK.author.eq('xy'))
            .offset(10)
            .limit(2)
            .orderBy(BOOK.title.asc())
            .select(BOOK.id, BOOK.title.lower());

        let s1 = `SELECT "Book"."id", LOWER("Book"."title") FROM "Book" WHERE "Book"."author" = 'xy' ORDER BY "Book"."title" ASC OFFSET 10 LIMIT 2`;

        expect(q1.toSQL()).toEqual(s1);
    });
});

