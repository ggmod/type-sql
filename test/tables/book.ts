import NumberColumn from "../../src/builder/number-column";
import StringColumn from "../../src/builder/string-column";
import QueryTable from '../../src/builder/query-table';
import BooleanColumn from "../../src/builder/boolean-column";
import DateColumn from "../../src/builder/date-column";
import BasicQueryColumn from "../../src/builder/basic-column";

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

    authorId = new NumberColumn(this, {
        name: 'author_id'
    });

    price = new NumberColumn(this, {
        name: 'price'
    });

    date = new DateColumn(this, {
        name: 'date'
    });

    available = new BooleanColumn(this, {
        name: 'available'
    });

    data = new BasicQueryColumn<this, any>(this, {
        name: 'data'
    });
}

export const BOOK = new BookTable();

export default BOOK;
