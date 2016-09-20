import NumberColumn from "../src/builder/number-column";
import StringColumn from "../src/builder/string-column";
import QueryTable from '../src/builder/query-table';


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
