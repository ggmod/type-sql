import { BOOK } from '../tables/book';
import { AUTHOR } from '../tables/author';
import { db } from '../utils';


// "select" return types:
let q1 = db.from(BOOK).select();                    // Book[]
let q2 = db.from(BOOK).select(BOOK.title);          // string[]
let q3 = db.from(BOOK).select(BOOK.id, BOOK.title); // any[]
let q4 = db.from(BOOK).select(BOOK.$all);           // Book[]
let q5 = db.from(BOOK).select(BOOK.$all.count());   // number[]
let q6 = db.table(BOOK).countAll();                 // number
let q7 = db.table(BOOK).where(BOOK.title.eq('xy')).count(); // number

// "from" table and entity type
let j0 = db.from(BOOK);
let j1 = db.from(BOOK, AUTHOR);
let j2 = db.from(BOOK.innerJoin(AUTHOR).on(BOOK.authorId.eq(AUTHOR.id)));
