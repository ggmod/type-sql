import NumberColumn from "../src/number-column";
import StringColumn from "../src/string-column";
import QueryTable from '../src/query-table';


class AuthorTable extends QueryTable {
    $name = "Author";

    name = new StringColumn(this, {
        name: 'name'
    });
}

const Author = new AuthorTable();

export default Author;
