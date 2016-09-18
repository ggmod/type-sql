import Book from './book';
import Author from './author';
import QueryDatabase from "../src/query-database";

let db = new QueryDatabase();

//let x = Book.author.eq('xy');
//let y = Book.title.asc();

let q1 = db.from(Book)
    .where(Book.author.eq('xy'))
    .offset(10)
    .limit(2)
    .orderBy(Book.title.asc())
    .select(Book.id, Book.title.lower());

console.log(q1.toUnsafeSQL());
