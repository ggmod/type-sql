import SELECT from './select';
import WHERE from './where';
import GROUP_BY from './group-by';
import ORDER_BY from './orderby';
import OFFSET_LIMIT from './offset-limit';
import JOIN from './join';
import EXAMPLES from './examples';

export default (db, log) => {
    describe('SELECT Query', () => {
        SELECT(db, log);
        WHERE(db, log);
        GROUP_BY(db, log);
        ORDER_BY(db, log);
        OFFSET_LIMIT(db, log);
        JOIN(db, log);
        EXAMPLES(db, log);
    });
}
