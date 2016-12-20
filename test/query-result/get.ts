import { BOOK, Book } from '../tables/book';
import { sync } from '../config/utils';
import { QuerySource } from "../../dist";

export default (db: QuerySource) => {

    describe('GET postgres binding', () => {

        it('GET missing item', sync(async () => {
            let item: Book | undefined = await db.table(BOOK).get(12);
            expect(item).toBe(undefined);
        }));

        it('GET item', sync(async () => {
            await db.table(BOOK).insert({ title: 'my book', author: 'my author' });

            let item: Book | undefined = await db.table(BOOK).get(1);
            expect(JSON.stringify(item)).toEqual(JSON.stringify(
                { id: 1, title: 'my book', author: 'my author', price: null, available: null, date: null, data: null }
            ));
        }));
    });
}
