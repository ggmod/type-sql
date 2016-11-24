import BOOK from '../tables/book';
import AUTHOR from '../tables/author';
import { db } from '../utils';

describe('JOIN', () => {

    it('two tables', () => {
        db.from(BOOK.innerJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Author" ON "Book"."author_id" = "Author"."id"');
    });

    it('modifiers', () => {
        db.from(BOOK.leftJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" LEFT JOIN "Author" ON "Book"."author_id" = "Author"."id"');
        db.from(BOOK.rightJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" RIGHT JOIN "Author" ON "Book"."author_id" = "Author"."id"');
        db.from(BOOK.fullJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" FULL JOIN "Author" ON "Book"."author_id" = "Author"."id"');
    });

    it('three tables', () => {
        db.from(BOOK.innerJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id)).innerJoin(AUTHOR).on(AUTHOR.id.eq(BOOK.authorId))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Author" ON "Book"."author_id" = "Author"."id" INNER JOIN "Author" ON "Author"."id" = "Book"."author_id"');
        db.from(BOOK.innerJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id)).leftJoin(AUTHOR).on(AUTHOR.id.eq(BOOK.authorId))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Author" ON "Book"."author_id" = "Author"."id" LEFT JOIN "Author" ON "Author"."id" = "Book"."author_id"');
        db.from(BOOK.innerJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id)).rightJoin(AUTHOR).on(AUTHOR.id.eq(BOOK.authorId))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Author" ON "Book"."author_id" = "Author"."id" RIGHT JOIN "Author" ON "Author"."id" = "Book"."author_id"');
        db.from(BOOK.innerJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id)).fullJoin(AUTHOR).on(AUTHOR.id.eq(BOOK.authorId))).select();
        expect(db.sql).toEqual('SELECT * FROM "Book" INNER JOIN "Author" ON "Book"."author_id" = "Author"."id" FULL JOIN "Author" ON "Author"."id" = "Book"."author_id"');
    });

});
