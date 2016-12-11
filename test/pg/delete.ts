import { BOOK, Book } from '../tables/book';
import { db, client, BEFORE_EACH, BEFORE_ALL, sync } from './utils';

describe('DELETE postgres binding', () => {

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH)
    }));

    it('DELETE all', sync(async () => {
        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let count: number = await db.table(BOOK).deleteAll();
        expect(count).toBe(2);

        let count2: number = await db.table(BOOK).deleteAll();
        expect(count2).toBe(0);
    }));

    it('DELETE conditions', sync(async () => {
        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let count: number = await db.table(BOOK).where(BOOK.title.startsWith('Book')).delete();
        expect(count).toBe(2);

        let count2: number = await db.table(BOOK).where(BOOK.title.startsWith('Book')).delete();
        expect(count2).toBe(0);
    }));

    it('DELETE single item', sync(async () => {
        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let deleted: boolean = await db.table(BOOK).delete(1);
        expect(deleted).toBe(true);

        let deleted2: boolean = await db.table(BOOK).delete(1);
        expect(deleted2).toBe(false);
    }));
});
