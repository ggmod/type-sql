import { BOOK } from '../tables/book';
import { AUTHOR } from '../tables/author';
import { BOOK_ORDER } from '../tables/book-order';
import { BOOK_TYPE } from '../tables/book-type';
import { db, client, BEFORE_EACH, BEFORE_ALL, sync } from './utils';

describe('field types postgres binding', () => {

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH)
    }));

    it('input/output field types for INSERT, UPDATE, SELECT', sync(async () => {
        await db.table(BOOK).insert({
            title: 'asd',
            author: 'xy',
            price: 10,
            available: true,
            date: new Date('2016-10-23T19:11:25.342Z'),
            data: { x: 2, y: 10 }
        });

        let item = await db.table(BOOK).get(1);
        expect(JSON.stringify(item)).toEqual(JSON.stringify({
            id: 1,
            title: 'asd',
            author: 'xy',
            author_id: null,
            price: 10,
            available: true,
            date: new Date('2016-10-23T19:11:25.342Z'),
            data: { x: 2, y: 10 }
        }));
        expect(item!.date instanceof Date).toBe(true);

        await db.table(BOOK).update(1, {
            title: 'asdf',
            author: 'xyz',
            price: 11,
            available: false,
            date: new Date('2016-11-23T19:11:25.342Z'),
            data: { x: 3, y: 11 }
        });

        let item2 = await db.table(BOOK).get(1);
        expect(JSON.stringify(item2)).toEqual(JSON.stringify({
            id: 1,
            title: 'asdf',
            author: 'xyz',
            author_id: null,
            price: 11,
            available: false,
            date: new Date('2016-11-23T19:11:25.342Z'),
            data: { x: 3, y: 11 }
        }));
        expect(item2!.date instanceof Date).toBe(true);
    }));

    it('ID types', sync(async () => {
        await db.table(AUTHOR).insert({ id: 12345, name: 'X Y' });
        await db.table(BOOK_TYPE).insert({ name: '1-1-1-1', description: 'type desc' });
        await db.table(BOOK_ORDER).insert({ bookId: 11, orderId: 22, count: 10 });

        let author = await db.table(AUTHOR).get(12345);
        let type = await db.table(BOOK_TYPE).get('1-1-1-1');
        let order = await db.table(BOOK_ORDER).get({ bookId: 11, orderId: 22 });

        expect(author!.id).toBe(12345);
        expect(type!.name).toBe('1-1-1-1');
        expect(order!.bookId).toBe(11);
        expect(order!.orderId).toBe(22);
    }));
});
