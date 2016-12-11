import { BOOK, Book } from '../tables/book';
import { db, client, BEFORE_EACH, BEFORE_ALL, sync } from './utils';

describe('COUNT postgres binding', () => {

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH)
    }));

    it('COUNT all', sync(async () => {
        let count: number = await db.table(BOOK).countAll();
        expect(count).toBe(0);

        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let count2: number = await db.table(BOOK).countAll();
        expect(count2).toBe(2);
    }));

    it('COUNT condition', sync(async () => {
        let count: number = await db.table(BOOK).where(BOOK.title.startsWith('Book')).count();
        expect(count).toBe(0);

        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let count2: number = await db.table(BOOK).where(BOOK.title.startsWith('Book')).count();
        expect(count2).toBe(2);
    }));
});
