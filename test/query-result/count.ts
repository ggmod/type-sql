import { BOOK, Book } from '../tables/book';
import { sync } from '../config/utils';
import { QuerySource } from "../../dist";

export default (db: QuerySource) => {

    describe('COUNT postgres binding', () => {

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
}
