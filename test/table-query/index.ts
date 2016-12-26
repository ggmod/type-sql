import COUNT from './count';
import DELETE from './delete';
import INSERT from './insert';
import UPDATE from './update';
import SHORTCUTS from './shortcuts';

export default (db, log, type) => {
    describe('table queries', () => {
        COUNT(db, log);
        DELETE(db, log);
        INSERT(db, log, type);
        UPDATE(db, log);
        SHORTCUTS(db, log);
    });
}
