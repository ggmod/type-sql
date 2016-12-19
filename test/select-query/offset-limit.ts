import { BOOK } from '../tables/book';
import { getDB } from '../config/db';
import { sync } from "../config/utils";

let { db, log } = getDB();

describe('OFFSET, LIMIT', () => {
    it('basic usage', sync(async () => {
        await db.from(BOOK).offset(10).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" OFFSET 10');
        await db.from(BOOK).limit(20).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" LIMIT 20');
        await db.from(BOOK).offset(50).limit(200).select();
        expect(log.sql).toEqual('SELECT * FROM "Book" OFFSET 50 LIMIT 200');
    }));
});
