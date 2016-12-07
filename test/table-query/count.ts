import { BOOK } from '../tables/book';
import { db } from '../utils';

describe('Count', () => {

    it('conditions', () => {
        db.table(BOOK).where(BOOK.title.eq('asd')).count();
        expect(db.sql).toEqual(`SELECT COUNT("Book".*) FROM "Book" WHERE "Book"."title" = 'asd'`);

        db.table(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).count();
        expect(db.sql).toEqual(`SELECT COUNT("Book".*) FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);

        db.table(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).count();
        expect(db.sql).toEqual(`SELECT COUNT("Book".*) FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
    });

    it('all', () => {
        db.table(BOOK).countAll();
        expect(db.sql).toEqual('SELECT COUNT("Book".*) FROM "Book"');
    });
});
