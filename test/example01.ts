import BOOK from './book';
import AUTHOR from './author';
import QuerySource from "../src/builder/query-source";
import DefaultQueryProcessor from "../src/defeault-processor";

let db = new QuerySource(new DefaultQueryProcessor());

//let x = BOOK.author.eq('xy');
//let y = BOOK.title.asc();

let q1 = db.from(BOOK)
    .where(BOOK.author.eq('xy'))
    .offset(10)
    .limit(2)
    .orderBy(BOOK.title.asc())
    .select(BOOK.id, BOOK.title.lower());

let q2 = db.from(BOOK).select();
let q3 = db.from(BOOK).select(BOOK.title);
let q4 = db.from(BOOK).select(BOOK.$all);

console.log(q1.toSQL());
