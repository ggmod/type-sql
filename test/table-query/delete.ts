import BOOK from '../tables/book';
import { db } from '../utils';

describe('DELETE', () => {

    it('conditions', () => {
        db.table(BOOK).where(BOOK.title.eq('asd')).delete();
        expect(db.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."title" = 'asd'`);

        db.table(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).delete();
        expect(db.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);

        db.table(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).delete();
        expect(db.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
    });

    it('all', () => {
        db.table(BOOK).deleteAll();
        expect(db.sql).toEqual('DELETE FROM "Book"');
    });
});
