import { BOOK } from '../tables/book';
import { sync } from "../utils/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";

export default (db: QuerySource, log: TestLog) => {

    describe('DELETE', () => {

        it('conditions', sync(async () => {
            await db.table(BOOK).where(BOOK.title.eq('asd')).delete();
            expect(log.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."title" = 'asd'`);

            await db.table(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).delete();
            expect(log.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);

            await db.table(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).delete();
            expect(log.sql).toEqual(`DELETE FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        }));

        it('all', sync(async () => {
            await db.table(BOOK).deleteAll();
            expect(log.sql).toEqual('DELETE FROM "Book"');
        }));
    });
}
