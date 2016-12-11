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
        await db.table(BOOK).insert({ title: 'Book Title', author: 'Book Author' } as Book);

        let items = await db.from(BOOK).select();
        expect(JSON.stringify(items[0])).toEqual(JSON.stringify(
            { id: 1, title: 'Book Title', author: 'Book Author', author_id: null, price: null, available: null, date: null, data: null }
        ));
    }));

    it('multiple values', sync(async() => {
        let e = { title: 'qwe', author: 'xy'} as Book;
        let e2 = { title: 'asd', author: 'ab' } as Book;
        await db.table(BOOK).insert([e, e2]);

        let items = await db.from(BOOK).select();
        expect(JSON.stringify(items)).toEqual(JSON.stringify([
            { id: 1, title: 'qwe', author: 'xy', author_id: null, price: null, available: null, date: null, data: null },
            { id: 2, title: 'asd', author: 'ab', author_id: null, price: null, available: null, date: null, data: null }
        ]));
    }));

    it('multiple values with different columns', sync(async () => {
        let e = { title: 'qwe', author: 'xy', price: 10} as Book;
        let e2 = { title: 'asd', author: 'ab', available: true } as Book;
        await db.table(BOOK).insert([e, e2]);

        let items = await db.from(BOOK).select();
        expect(JSON.stringify(items)).toEqual(JSON.stringify([
            { id: 1, title: 'qwe', author: 'xy', author_id: null, price: 10, available: null, date: null, data: null },
            { id: 2, title: 'asd', author: 'ab', author_id: null, price: null, available: true, date: null, data: null }
        ]));
    }));
});
