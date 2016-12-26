import { BOOK } from '../tables/book';
import { ORDER } from "../tables/order";
import { sync } from '../utils/utils';
import { QuerySource } from "../../dist";

export default (db: QuerySource) => {

    describe('SQL injection - local escaping of non-string parameters', () => {

        it('offset/limit', () => {
            expect(() => db.from(BOOK).offset(<any>'1;DROP TABLE users').select()).toThrow();
            expect(() => db.from(BOOK).limit(<any>'1;DROP TABLE users').select()).toThrow();
        });

        it('numeric condition parameters', () => {
            expect(() => db.from(BOOK).where(BOOK.price.eq(<any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).where(BOOK.price.lte(<any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).where(BOOK.price.ne(<any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).where(BOOK.price.between(0, <any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).where(BOOK.price.in([0, 2, <any>'1;DROP TABLE users'])).select()).toThrow();

            expect(() => db.from(BOOK).where(BOOK.available.eq(<any>'TRUE;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).where(BOOK.date.eq(<any>'\'2016-10-23T19:11:25.342Z\';DROP TABLE users')).select()).toThrow();
        });

        it('numeric condition parameters - having', () => {
            expect(() => db.from(BOOK).having(BOOK.price.eq(<any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).having(BOOK.price.lte(<any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).having(BOOK.price.ne(<any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).having(BOOK.price.between(0, <any>'1;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).having(BOOK.price.in([0, 2, <any>'1;DROP TABLE users'])).select()).toThrow();

            expect(() => db.from(BOOK).having(BOOK.available.eq(<any>'TRUE;DROP TABLE users')).select()).toThrow();
            expect(() => db.from(BOOK).having(BOOK.date.eq(<any>'\'2016-10-23T19:11:25.342Z\';DROP TABLE users')).select()).toThrow();
        });

        it('join parameters', sync(async () => {
            expect(() => db.from(BOOK.innerJoin(ORDER).on(<any>BOOK.id.eq(<any>`asdf' OR '1'='1'`))).select()).toThrow();
            expect(() => db.from(BOOK.innerJoin(ORDER).on(<any>BOOK.title.eq(`asdf' OR '1'='1'`))).select()).toThrow();
        }));

        it('insert', sync(async () => {
            expect(() => db.table(BOOK).insert(';DROP TABLE users' as any)).toThrow();

            expect(() => db.table(BOOK).insert({ price: `);DROP_TABLE users` } as any)).toThrow();
        }));

        it('update', sync(async () => {
            expect(() => db.table(BOOK).update(12, ';DROP TABLE users' as any)).toThrow();

            expect(() => db.table(BOOK).update(13, { price: `);DROP_TABLE users` } as any)).toThrow();
        }));

        it('ID', sync(async () => { // the same ID logic is used for 'get' and 'update'
            expect(() => db.table(BOOK).delete(`11';DROP_TABLE users` as any)).toThrow();
        }));
    });
}
