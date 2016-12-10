import { BOOK, Book } from '../tables/book';
import { AUTHOR } from '../tables/author';
import { db, client, BEFORE_EACH, BEFORE_ALL, sync } from './utils';

describe('Postgres binding', () => {

    beforeAll(sync(async () => {
        await client.query(BEFORE_ALL);
    }));

    beforeEach(sync(async () => {
        await client.query(BEFORE_EACH)
    }));

    it('SELECT return types', sync(async () => {
        // empty result:
        let items = await db.from(BOOK).select();
        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toEqual(0);

        await db.table(BOOK).insert([
            { title: 'Book 1', author: 'xy' },
            { title: 'Book 2', author: 'abc' }
        ] as Book[]); // TODO show nullable fields on interface

        // entity result:
        let inserted: Book[] = await db.from(BOOK).select();
        expect(Array.isArray(inserted)).toBe(true);
        expect(inserted.length).toEqual(2);
        expect(JSON.stringify(inserted)).toEqual(JSON.stringify([
            { id: 1, title: 'Book 1', author: 'xy', author_id: null, price: null, available: null, date: null, data: null },
            { id: 2, title: 'Book 2', author: 'abc', author_id: null, price: null, available: null, date: null, data: null }
        ]));

        // single column result:
        let titles: string[] = await db.from(BOOK).select(BOOK.title);
        expect(Array.isArray(titles)).toBe(true);
        expect(titles.length).toEqual(2);
        expect(titles).toEqual(['Book 1', 'Book 2']);

        // custom column selection:
        let columns: any[] = await db.from(BOOK).select(BOOK.title, BOOK.author);
        expect(Array.isArray(columns)).toBe(true);
        expect(columns.length).toEqual(2);
        expect(JSON.stringify(columns)).toEqual(JSON.stringify([{ title: 'Book 1', author: 'xy' }, { title: 'Book 2', author: 'abc' }]));

        // joined tables:
        // TODO create example data when authorId issue is resolved

        let joined1: any[] = await db.from(BOOK, AUTHOR).where(BOOK.authorId.eq(AUTHOR.id)).select();
        expect(Array.isArray(joined1)).toBe(true);
        expect(joined1.length).toEqual(0);

        let joined2: any[] = await db.from(BOOK.innerJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id))).select();
        expect(Array.isArray(joined2)).toBe(true);
        expect(joined2.length).toEqual(0);
    }));
});
