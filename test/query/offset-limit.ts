import BOOK from '../tables/book';
import AUTHOR from '../tables/author';
import { db } from '../utils';

describe('OFFSET, LIMIT', () => {
    it('basic usage', () => {
        expect(db.from(BOOK).offset(10).select().toSQL())
            .toEqual('SELECT * FROM "Book" OFFSET 10');
        expect(db.from(BOOK).limit(20).select().toSQL())
            .toEqual('SELECT * FROM "Book" LIMIT 20');
        expect(db.from(BOOK).offset(50).limit(200).select().toSQL())
            .toEqual('SELECT * FROM "Book" OFFSET 50 LIMIT 200');
    });
});
