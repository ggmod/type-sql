import { BOOK } from '../tables/book';
import { db } from '../utils';


describe('Random examples', () => {
    it('basic queries', () => {

        db.from(BOOK)
            .where(BOOK.author.eq('xy'))
            .offset(10)
            .limit(2)
            .orderBy(BOOK.title.asc())
            .select(BOOK.id, BOOK.title.lower());

        let s1 = `SELECT "Book"."id", LOWER("Book"."title") FROM "Book" WHERE "Book"."author" = 'xy' ORDER BY "Book"."title" ASC OFFSET 10 LIMIT 2`;

        expect(db.sql).toEqual(s1);
    });
});

