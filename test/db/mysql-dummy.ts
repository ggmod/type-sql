import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import PARAMETERIZED from '../other/parameterized';
import FORMATTING from '../other/formatting';
import SQL_INJECTION_LOCAL from '../other/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other/sql-injection-remote';
import { createDb } from '../config/db';

const dummyMySqlClient = {
    query(options, cb) {
        cb(null, []);
    }
};

describe('MySQL Dummy', () => {

    describe('Not parameterized', () => {
        let { db, log } = createDb(dummyMySqlClient, { parameterized: false }, 'mysql', sql => sql.replace(/`/g, '"'));

        SELECT_QUERY(db, log, 'mysql');
        TABLE_QUERY(db, log);
        SQL_INJECTION_LOCAL(db);
    });

    describe('Parameterized', () => {
        let { db, log } = createDb(dummyMySqlClient, { parameterized: true }, 'mysql');

        SQL_INJECTION_REMOTE(db, log, 'mysql');
        PARAMETERIZED(db, log, 'mysql');
    });

    describe('Formatted', () => {
        let { db, log } = createDb(dummyMySqlClient, { parameterized: false, lineBreaks: true }, 'mysql', sql => sql.replace(/`/g, '"'));

        FORMATTING(db, log);
    });
});
