import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import PARAMETERIZED from '../other-query/parameterized';
import FORMATTING from '../other-query/formatting';
import SQL_INJECTION_LOCAL from '../other-query/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other-query/sql-injection-remote';
import { createLogger } from '../utils/logger';
import { PgQuerySource } from "../../dist";

const pgClientMock = {
    query(sql, paramsOrCb, cb) {
        (cb || paramsOrCb)(null, { rows: [] });
    }
};

describe('PG Dummy', () => {

    describe('Not parameterized', () => {
        let { logger, log } = createLogger();
        let db = new PgQuerySource(pgClientMock, { parameterized: false, logger });

        SELECT_QUERY(db, log, 'pg');
        TABLE_QUERY(db, log, 'pg');
        SQL_INJECTION_LOCAL(db);
    });

    describe('Parameterized', () => {
        let { logger, log } = createLogger();
        let db = new PgQuerySource(pgClientMock, { parameterized: true, logger });

        SQL_INJECTION_REMOTE(db, log, 'pg');
        PARAMETERIZED(db, log, 'pg');
    });

    describe('Formatted', () => {
        let { logger, log } = createLogger();
        let db = new PgQuerySource(pgClientMock, { parameterized: false, lineBreaks: true, logger });

        FORMATTING(db, log);
    });
});
