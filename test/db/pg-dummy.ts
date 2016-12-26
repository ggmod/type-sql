import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import PARAMETERIZED from '../other/parameterized';
import FORMATTING from '../other/formatting';
import SQL_INJECTION_LOCAL from '../other/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other/sql-injection-remote';
import { createDb } from '../config/db';

const dummyPgClient = {
    query(sql, paramsOrCb, cb) {
        (cb || paramsOrCb)(null, { rows: [] });
    }
};

describe('PG Dummy', () => {

    describe('Not parameterized', () => {
        let { db, log } = createDb(dummyPgClient, { parameterized: false }, 'pg');

        SELECT_QUERY(db, log, 'pg');
        TABLE_QUERY(db, log, 'pg');
        SQL_INJECTION_LOCAL(db);
    });

    describe('Parameterized', () => {
        let { db, log } = createDb(dummyPgClient, { parameterized: true }, 'pg');

        SQL_INJECTION_REMOTE(db, log, 'pg');
        PARAMETERIZED(db, log, 'pg');
    });

    describe('Formatted', () => {
        let { db, log } = createDb(dummyPgClient, { parameterized: false, lineBreaks: true }, 'pg');

        FORMATTING(db, log);
    });
});
