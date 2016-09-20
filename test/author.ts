import NumberColumn from "../src/builder/number-column";
import StringColumn from "../src/builder/string-column";
import QueryTable from '../src/builder/query-table';


class AuthorTable extends QueryTable {
    $name = "Author";

    name = new StringColumn(this, {
        name: 'name'
    });
}

const Author = new AuthorTable();

export default Author;
