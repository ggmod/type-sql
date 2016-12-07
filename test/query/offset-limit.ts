import { BOOK } from '../tables/book';
import { db } from '../utils';

describe('OFFSET, LIMIT', () => {
    it('basic usage', () => {
        db.from(BOOK).offset(10).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" OFFSET 10');
        db.from(BOOK).limit(20).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" LIMIT 20');
        db.from(BOOK).offset(50).limit(200).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" OFFSET 50 LIMIT 200');
    });
});
