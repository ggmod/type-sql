import NumberColumn from "../src/number-column";
import StringColumn from "../src/string-column";
import DatabaseTable from '../src/database-table';


class BookTable extends DatabaseTable {

    name = 'Book';

    id = new NumberColumn({
        name: 'id'
    });

    title = new StringColumn({
        name: 'title'
    });

    author = new StringColumn({
        name: 'author'
    })
}

const Book = new BookTable();

export default Book;
