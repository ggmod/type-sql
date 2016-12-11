import { BOOK, Book } from '../tables/book';
import { db, client, BEFORE_EACH, BEFORE_ALL, sync } from './utils';

describe('UPDATE postgres binding', () => {

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH)
    }));

    it('UPDATE all', sync(async () => {
        let count: number = await db.table(BOOK).updateAll({ title: 'Updated'});
        expect(count).toBe(0);

        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let count2: number = await db.table(BOOK).updateAll({ title: 'Updated'});
        expect(count2).toBe(2);

        let results = await db.from(BOOK).select(BOOK.title);
        expect(results).toEqual(['Updated', 'Updated']);
    }));

    it('UPDATE conditions', sync(async () => {
        let count: number = await db.table(BOOK).where(BOOK.title.startsWith('Book')).update({ author: 'updated' });
        expect(count).toBe(0);

        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let count2: number = await db.table(BOOK).where(BOOK.title.startsWith('Book')).update({ author: 'updated' });
        expect(count2).toBe(2);

        let results = await db.from(BOOK).select(BOOK.author);
        expect(results).toEqual(['updated', 'updated']);
    }));

    it('UPDATE single item', sync(async () => {
        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ]);

        let updated: boolean = await db.table(BOOK).update(1, { title: 'updated'});
        expect(updated).toBe(true);

        let updated2: boolean = await db.table(BOOK).update(999, { title: 'updated'});
        expect(updated2).toBe(false);

        let results = await db.from(BOOK).select(BOOK.title);
        expect(results.sort()).toEqual(['Book 2', 'updated']);
    }));
});
