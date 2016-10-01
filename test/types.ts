import BOOK from './book';
import AUTHOR from './author';
import { db } from './utils';


// "select"" return types:
let q1 = db.from(BOOK).select(BOOK.id, BOOK.title);    // any[]
let q2 = db.from(BOOK).select();            // Book[]
let q3 = db.from(BOOK).select(BOOK.title);  // string[]
let q4 = db.from(BOOK).select(BOOK.$all);   // Book[]
