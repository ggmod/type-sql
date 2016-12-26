import { BOOK, Book } from '../tables/book';
import { CUSTOMER } from '../tables/customer';
import { ORDER } from '../tables/order';
import { sync } from '../config/utils';
import { QuerySource, QueryEngine } from "../../dist";
import { TestLog } from "../config/db";

export default (db: QuerySource, log: TestLog, type: QueryEngine) => {

    describe('Parameterized queries', () => {

        it('basic query', sync(async () => {
            await db.from(BOOK)
                .where(BOOK.author.eq('xy'), BOOK.title.eq('asd'))
                .offset(10)
                .limit(2)
                .orderBy(BOOK.title.asc())
                .select(BOOK.id, BOOK.title.lower());

            if (type === 'pg') {
                let s = `SELECT "Book"."id", LOWER("Book"."title") FROM "Book" WHERE "Book"."author" = $1 AND "Book"."title" = $2 ORDER BY "Book"."title" ASC LIMIT 2 OFFSET 10`;
                expect(log.sql).toEqual(s);
            } else if (type === 'mysql') {
                let s = "SELECT `Book`.`id`, LOWER(`Book`.`title`) FROM `Book` WHERE `Book`.`author` = ? AND `Book`.`title` = ? ORDER BY `Book`.`title` ASC LIMIT 2 OFFSET 10";
                expect(log.sql).toEqual(s);
            }
            expect(log.params).toEqual(['xy', 'asd']);
        }));

        it('nested conditions', sync(async () => {
            await db.from(BOOK).where(BOOK.id.gt(150).or(BOOK.id.lte(50).and(BOOK.price.lt(100).or(BOOK.price.gt(200))))).select();

            if (type === 'pg') {
                let s = `SELECT * FROM "Book" WHERE "Book"."id" > $1 OR ( "Book"."id" <= $2 AND ( "Book"."price" < $3 OR "Book"."price" > $4 ) )`;
                expect(log.sql).toEqual(s);
            } else if (type === 'mysql') {
                let s = "SELECT * FROM `Book` WHERE `Book`.`id` > ? OR ( `Book`.`id` <= ? AND ( `Book`.`price` < ? OR `Book`.`price` > ? ) )";
                expect(log.sql).toEqual(s);
            }
            expect(log.params).toEqual([150, 50, 100, 200]);

            await db.from(BOOK).where(BOOK.id.gt(100).or(BOOK.id.lte(50)).$().not().and(BOOK.price.lt(100).or(BOOK.price.gt(200)))).select();

            if (type === 'pg') {
                let s2 = `SELECT * FROM "Book" WHERE NOT ( "Book"."id" > $1 OR "Book"."id" <= $2 ) AND ( "Book"."price" < $3 OR "Book"."price" > $4 )`;
                expect(log.sql).toEqual(s2);
            } else if (type === 'mysql') {
                let s2 = "SELECT * FROM `Book` WHERE NOT ( `Book`.`id` > ? OR `Book`.`id` <= ? ) AND ( `Book`.`price` < ? OR `Book`.`price` > ? )";
                expect(log.sql).toEqual(s2);
            }
            expect(log.params).toEqual([100, 50, 100, 200]);
        }));

        it('"IN" keyword', sync(async () => {
            await db.from(BOOK).where(BOOK.title.isNotNull(), BOOK.id.in([11, 12, 13])).select();

            if (type === 'pg') expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" IS NOT NULL AND "Book"."id" IN ($1, $2, $3)`);
            if (type === 'mysql') expect(log.sql).toEqual("SELECT * FROM `Book` WHERE `Book`.`title` IS NOT NULL AND `Book`.`id` IN (?, ?, ?)");
            expect(log.params).toEqual([11, 12, 13]);
        }));

        it('"LIKE" keyword', sync(async () => {
            await db.from(BOOK).where(BOOK.title.like('%xy%'), BOOK.author.contains('abc')).select();
            if (type === 'pg') expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."title" LIKE $1 AND "Book"."author" LIKE $2`);
            if (type === 'mysql') expect(log.sql).toEqual("SELECT * FROM `Book` WHERE `Book`.`title` LIKE ? AND `Book`.`author` LIKE ?");
            expect(log.params).toEqual(['%xy%', '%abc%']);
        }));

        it('INSERT, UPDATE', sync(async () => {
            await db.table(BOOK).insert({
                author: 'xy',
                available: true,
                data: { x: 2, y: 10 },
                date: new Date('2016-10-23T19:11:25.342Z'),
                price: 10,
                title: 'asd'
            });

            if (type === 'pg') expect(log.sql).toEqual(`INSERT INTO "Book" ("author", "available", "data", "date", "price", "title") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id"`);
            if (type === 'mysql') expect(log.sql).toEqual("INSERT INTO `Book` (`author`, `available`, `data`, `date`, `price`, `title`) VALUES (?, ?, ?, ?, ?, ?)");

            expect(log.params).toEqual(['xy', true, { x: 2, y: 10 }, new Date('2016-10-23T19:11:25.342Z'), 10, 'asd']);

            await db.table(BOOK).update(12, {
                author: 'xy',
                available: true,
                data: { x: 2, y: 10 },
                date: new Date('2016-10-23T19:11:25.342Z'),
                price: 10,
                title: 'asd'
            });

            if (type === 'pg') expect(log.sql).toEqual(`UPDATE "Book" SET "author" = $1, "available" = $2, "data" = $3, "date" = $4, "price" = $5, "title" = $6 WHERE "Book"."id" = $7`);
            if (type === 'mysql') expect(log.sql).toEqual("UPDATE `Book` SET `author` = ?, `available` = ?, `data` = ?, `date` = ?, `price` = ?, `title` = ? WHERE `Book`.`id` = ?");
            expect(log.params).toEqual(['xy', true, { x: 2, y: 10 }, new Date('2016-10-23T19:11:25.342Z'), 10, 'asd', 12]);
        }));

        it('ID types', sync(async () => {
            await db.table(BOOK).get(12345);
            if (type === 'pg') expect(log.sql).toEqual(`SELECT * FROM "Book" WHERE "Book"."id" = $1`);
            if (type === 'mysql') expect(log.sql).toEqual("SELECT * FROM `Book` WHERE `Book`.`id` = ?");
            expect(log.params).toEqual([12345]);

            await db.table(CUSTOMER).get('1-1-1-1');
            if (type === 'pg') expect(log.sql).toEqual(`SELECT * FROM "Customer" WHERE "Customer"."name" = $1`);
            if (type === 'mysql') expect(log.sql).toEqual("SELECT * FROM `Customer` WHERE `Customer`.`name` = ?");
            expect(log.params).toEqual(['1-1-1-1']);

            await db.table(ORDER).get({ bookId: 11, customerId: 'xy' });
            if (type === 'pg') expect(log.sql).toEqual(`SELECT * FROM "Order" WHERE "Order"."bookId" = $1 AND "Order"."customerId" = $2`);
            if (type === 'mysql') expect(log.sql).toEqual("SELECT * FROM `Order` WHERE `Order`.`bookId` = ? AND `Order`.`customerId` = ?");
            expect(log.params).toEqual([11, 'xy']);
        }));

        it('INSERT multiple values with different columns', sync(async () => {
            let e = { title: 'qwe', author: 'xy' } as Book;
            let e2 = { title: 'asd', price: 10 } as Book;
            await db.table(BOOK).insert([e, e2]);
            if (type === 'pg') expect(log.sql).toEqual(`INSERT INTO "Book" ("author", "price", "title") VALUES ($1, NULL, $2), (NULL, $3, $4)`);
            if (type === 'mysql') expect(log.sql).toEqual("INSERT INTO `Book` (`author`, `price`, `title`) VALUES (?, NULL, ?), (NULL, ?, ?)");
            expect(log.params).toEqual(['xy', 'qwe', 10, 'asd']);
        }));

        it('UPDATE set to null', sync(async () => {
            let e = { title: null } as any as Book;
            await db.table(BOOK).updateAll(e);
            if (type === 'pg') expect(log.sql).toEqual(`UPDATE "Book" SET "title" = NULL`);
            if (type === 'mysql') expect(log.sql).toEqual("UPDATE `Book` SET `title` = NULL");
            expect(log.params).toEqual([]);

            let e2 = { author: undefined } as any as Book;
            await db.table(BOOK).updateAll(e2);
            if (type === 'pg') expect(log.sql).toEqual(`UPDATE "Book" SET "author" = NULL`);
            if (type === 'mysql') expect(log.sql).toEqual("UPDATE `Book` SET `author` = NULL");
            expect(log.params).toEqual([]);
        }));
    });
}
