import BOOK from '../tables/book';
import AUTHOR from '../tables/author';
import { db } from '../utils';


describe('Parameterized queries', () => {
    it('basic query', () => {
        let q = db.from(BOOK)
            .where(BOOK.author.eq('xy'), BOOK.title.eq('asd'))
            .offset(10)
            .limit(2)
            .orderBy(BOOK.title.asc())
            .select(BOOK.id, BOOK.title.lower())
            .toParameterizedSQL();

        let s = `SELECT "Book"."id", LOWER("Book"."title") FROM "Book" WHERE "Book"."author" = $1 AND "Book"."title" = $2 ORDER BY "Book"."title" ASC OFFSET 10 LIMIT 2`;

        expect(q.sql).toEqual(s);
        expect(q.params).toEqual(['xy', 'asd']);
    });

    it('nested conditions', () => {
        // the parameters are in reverse order because of how the query is parsed TODO fix this?

        let q = db.from(BOOK).where(BOOK.id.gt(150).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200))))).select().toParameterizedSQL();
        let s = `SELECT * FROM "Book" WHERE "Book"."id" > $4 OR ( "Book"."id" <= $3 AND ( "Book"."price" < $2 OR "Book"."price" > $1 ) )`;

        expect(q.sql).toEqual(s);
        expect(q.params).toEqual([200, 100, 50, 150]);
    });

    it('"IN" keyword', () => {
        let q = db.from(BOOK).where(BOOK.title.isNotNull(), BOOK.id.in([11, 12, 13])).select().toParameterizedSQL();
        let s = `SELECT * FROM "Book" WHERE "Book"."title" IS NOT NULL AND "Book"."id" IN ($1, $2, $3)`;

        expect(q.sql).toEqual(s);
        expect(q.params).toEqual([11, 12, 13]);
    });
});

