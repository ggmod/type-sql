import Book from './book';
import Database from "../src/database";

let db = new Database();

let q1 = db.from(Book)
    .where(Book.author.eq('xy'))
    .offset(10)
    .limit(2)
    .orderBy(Book.title.asc())
    .select(Book.id, Book.title.lower());

console.log(q1.toUnsafeSQL());
