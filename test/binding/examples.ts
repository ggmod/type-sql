import { BOOK } from '../tables/book';
import { getDB  } from '../config/db';
import { BEFORE_EACH, BEFORE_ALL } from '../config/ddl';
import { sync } from '../config/utils';

let { db, client } = getDB(true);

describe('pg binding examples', () => {

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH)
    }));

    it('condition field types', sync(async () => {
        await db.from(BOOK).where(
            BOOK.title.eq('asd'),
            BOOK.price.eq(10),
            BOOK.available.eq(true),
            BOOK.date.eq(new Date('2016-10-23T19:11:25.342Z'))
        ).select();
        // just check if PG accepts these parameter types
    }));

    it('other', sync(async () => {
        await db.from(BOOK)
            .where(BOOK.author.eq('xy'))
            .offset(10)
            .limit(2)
            .orderBy(BOOK.title.asc().nullsLast())
            .select(BOOK.id, BOOK.title.lower());

        await db.from(BOOK)
            .where(BOOK.price.gt(100))
            .groupBy(BOOK.author)
            .having(BOOK.$all.count().gt(10).or(BOOK.author.startsWith('X')))
            .orderBy(BOOK.$all.count().desc(), BOOK.author.asc())
            .select(BOOK.$all.count(), BOOK.author);

        // just testing if pg fails when running the queries
    }));
});
