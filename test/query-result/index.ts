import SELECT from './select';
import COUNT from './count';
import DELETE from './delete';
import GET from './get';
import INSERT from './insert';
import UPDATE from './update';
import FIELD_TYPES from './field-types';

export default (db) => {
    describe('Query results', () => {
        SELECT(db);
        COUNT(db);
        DELETE(db);
        GET(db);
        UPDATE(db);
        INSERT(db);
        FIELD_TYPES(db);
    });
}
