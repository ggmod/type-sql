import BOOK from '../tables/book';
import AUTHOR from '../tables/author';
import { db } from '../utils';

describe('GROUP BY', () => {
    it('basics', () => {
        expect(db.from(BOOK).groupBy(BOOK.id).select().toSQL())
            .toEqual('SELECT * FROM "Book" GROUP BY "Book"."id"');
        expect(db.from(BOOK).groupBy(BOOK.author).select(BOOK.author).toSQL())
            .toEqual('SELECT "Book"."author" FROM "Book" GROUP BY "Book"."author"');
        expect(db.from(BOOK).groupBy(BOOK.author).select(BOOK.author, BOOK.$all.count()).toSQL())
            .toEqual('SELECT "Book"."author", COUNT("Book".*) FROM "Book" GROUP BY "Book"."author"');
        expect(db.from(BOOK).groupBy(BOOK.author, BOOK.available).select(BOOK.author, BOOK.$all.count()).toSQL())
            .toEqual('SELECT "Book"."author", COUNT("Book".*) FROM "Book" GROUP BY "Book"."author", "Book"."available"');
    });
});
