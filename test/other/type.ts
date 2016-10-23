import BOOK from '../tables/book';
import AUTHOR from '../tables/author';
import { db } from '../utils';


// "select"" return types:
let q1 = db.from(BOOK).select();            // Book[]
let q2 = db.from(BOOK).select(BOOK.title);  // string[]
let q3 = db.from(BOOK).select(BOOK.id, BOOK.title);    // any[]
let q4 = db.from(BOOK).select(BOOK.$all);   // Book[]
let q5 = db.from(BOOK).select(BOOK.$all.count());   // number[]
