import { BOOK } from '../tables/book';
import { sync } from "../utils/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";
import { QueryEngine } from "../utils/types";

export default (db: QuerySource, log: TestLog, type: QueryEngine) => {

    describe('OFFSET, LIMIT', () => {
        it('basic usage', sync(async () => {
            if (type !== 'mysql') {
                await db.from(BOOK).offset(10).select();
                expect(log.sql).toEqual('SELECT * FROM "Book" OFFSET 10');
            }

            await db.from(BOOK).limit(20).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" LIMIT 20');

            await db.from(BOOK).offset(50).limit(200).select();
            expect(log.sql).toEqual('SELECT * FROM "Book" LIMIT 200 OFFSET 50');
        }));
    });
}
