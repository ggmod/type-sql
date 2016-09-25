import NumberColumn from "../src/builder/number-column";
import StringColumn from "../src/builder/string-column";
import QueryTable from '../src/builder/query-table';

export interface Book {
    id: number,
    title: string,
    author: string,
    price: number
}

export class BookTable extends QueryTable<Book> {

    $name = 'Book';

    id = new NumberColumn(this, {
        name: 'id'
    });

    title = new StringColumn(this, {
        name: 'title'
    });

    author = new StringColumn(this, {
        name: 'author'
    });

    price = new NumberColumn(this, {
        name: 'price'
    });
}

export const BOOK = new BookTable();

export default BOOK;
