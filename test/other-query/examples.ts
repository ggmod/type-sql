import { BOOK } from '../tables/book';
import { sync } from "../utils/utils";
import { QuerySource } from "../../dist";
import { TestLog } from "../utils/logger";

export default (db: QuerySource, log: TestLog) => {

    describe('Intro examples', () => {
        it('queries', sync(async () => {

            let result = await db.from(BOOK)
                .where(BOOK.author.lower().like('%john%')
                    .and(BOOK.price.lt(10).or(BOOK.available.eq(true)))
                    .and(BOOK.date.gte(new Date('2016-10-23T19:11:25.342Z'))))
                .groupBy(BOOK.author, BOOK.available)
                .having(BOOK.price.sum().between(1000, 2000))
                .orderBy(BOOK.author.asc().nullsFirst(), BOOK.price.sum().desc())
                .offset(20)
                .limit(10)
                .select(BOOK.author, BOOK.available, BOOK.price.sum().as('sum_price'));

            await db.table(BOOK)
                .where(BOOK.author.eq('John Smith'), BOOK.price.lte(200))
                .update({
                    author: 'John X.',
                    available: false
                });

            await db.table(BOOK).where(BOOK.title.isNull()).delete();

            let generatedId = await db.table(BOOK).insert({ title: '...', author: '...' });
            let book = await db.table(BOOK).get(generatedId);
        }));
    });
};
