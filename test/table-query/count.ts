import { BOOK } from '../tables/book';
import { sync } from "../config/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../config/db";

export default (db: QuerySource, log: TestLog) => {

    describe('Count', () => {

        it('conditions', sync(async () => {
            await db.table(BOOK).where(BOOK.title.eq('asd')).count();
            expect(log.sql).toEqual(`SELECT COUNT("Book".*) FROM "Book" WHERE "Book"."title" = 'asd'`);

            await db.table(BOOK).where(BOOK.title.eq('asd'), BOOK.price.lt(100)).count();
            expect(log.sql).toEqual(`SELECT COUNT("Book".*) FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);

            await db.table(BOOK).where(BOOK.title.eq('asd').and(BOOK.price.lt(100))).count();
            expect(log.sql).toEqual(`SELECT COUNT("Book".*) FROM "Book" WHERE "Book"."title" = 'asd' AND "Book"."price" < 100`);
        }));

        it('all', sync(async () => {
            await db.table(BOOK).countAll();
            expect(log.sql).toEqual('SELECT COUNT("Book".*) FROM "Book"');
        }));
    });
}
