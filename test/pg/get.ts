import { BOOK, Book } from '../tables/book';
import { db, client, BEFORE_EACH, BEFORE_ALL, sync } from './utils';

describe('GET postgres binding', () => {

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH)
    }));

    it('GET missing item', sync(async () => {
        let item: Book | undefined = await db.table(BOOK).get(12);
        expect(item).toBe(undefined);
    }));

    it('GET item', sync(async () => {
        await db.table(BOOK).insert({ title: 'my book', author: 'my author' } as Book);

        let item: Book | undefined = await db.table(BOOK).get(1);
        expect(JSON.stringify(item)).toEqual(JSON.stringify(
            { id: 1, title: 'my book', author: 'my author', author_id: null, price: null, available: null, date: null, data: null }
        ));
    }));
});
