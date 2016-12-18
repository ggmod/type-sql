import { BOOK, Book } from '../tables/book';
import { db, client, BEFORE_EACH, BEFORE_ALL, sync } from './utils';

describe('INSERT postgres binding', () => {

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH)
    }));

    it('single item', sync(async () => {
        await db.table(BOOK).insert({ title: 'Book Title', author: 'Book Author' });

        let items = await db.from(BOOK).select();
        expect(JSON.stringify(items[0])).toEqual(JSON.stringify(
            { id: 1, title: 'Book Title', author: 'Book Author', price: null, available: null, date: null, data: null }
        ));
    }));

    it('multiple values', sync(async() => {
        let e = { title: 'qwe', author: 'xy'};
        let e2 = { title: 'asd', author: 'ab' };
        await db.table(BOOK).insert([e, e2]);

        let items = await db.from(BOOK).select();
        expect(JSON.stringify(items)).toEqual(JSON.stringify([
            { id: 1, title: 'qwe', author: 'xy', price: null, available: null, date: null, data: null },
            { id: 2, title: 'asd', author: 'ab', price: null, available: null, date: null, data: null }
        ]));
    }));

    it('multiple values with different columns', sync(async () => {
        let e = { title: 'qwe', author: 'xy', price: 10};
        let e2 = { title: 'asd', author: 'ab', available: true };
        await db.table(BOOK).insert([e, e2]);

        let items = await db.from(BOOK).select();
        expect(JSON.stringify(items)).toEqual(JSON.stringify([
            { id: 1, title: 'qwe', author: 'xy', price: 10, available: null, date: null, data: null },
            { id: 2, title: 'asd', author: 'ab', price: null, available: true, date: null, data: null }
        ]));
    }));
});
