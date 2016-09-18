import NumberColumn from "../src/number-column";
import StringColumn from "../src/string-column";
import QueryTable from '../src/query-table';


class BookTable extends QueryTable {

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
}

const Book = new BookTable();

export default Book;
