import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import PARAMETERIZED from '../other-query/parameterized';
import FORMATTING from '../other-query/formatting';
import SQL_INJECTION_LOCAL from '../other-query/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other-query/sql-injection-remote';
import { createLogger } from '../utils/logger';
import { MySqlQuerySource } from '../../dist';

const mySqlClientMock = {
    query(options, cb) {
        cb(null, []);
    }
};

describe('MySQL Dummy', () => {

    describe('Not parameterized', () => {
        let { logger, log } = createLogger(sql => sql.replace(/`/g, '"'));
        let db = new MySqlQuerySource(mySqlClientMock, { parameterized: false, logger });

        SELECT_QUERY(db, log, 'mysql');
        TABLE_QUERY(db, log, 'mysql');
        SQL_INJECTION_LOCAL(db);
    });

    describe('Parameterized', () => {
        let { logger, log } = createLogger();
        let db = new MySqlQuerySource(mySqlClientMock, { parameterized: true, logger });

        SQL_INJECTION_REMOTE(db, log, 'mysql');
        PARAMETERIZED(db, log, 'mysql');
    });

    describe('Formatted', () => {
        let { logger, log } = createLogger(sql => sql.replace(/`/g, '"'));
        let db = new MySqlQuerySource(mySqlClientMock, { parameterized: false, lineBreaks: true, logger });

        FORMATTING(db, log);
    });
});
