import QUERY_RESULT from '../query-result';
import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import SQL_INJECTION_LOCAL from '../other-query/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other-query/sql-injection-remote';
import PARAMETERIZED from '../other-query/parameterized';
import ALIAS from '../other-query/alias';
import EXAMPLES from '../other-query/examples';
import { createLogger } from '../utils/logger';
import { substituteMySqlParams } from "../utils/substitution";
import { BEFORE_ALL_MYSQL, BEFORE_EACH_MYSQL } from "../utils/ddl";
import mysql = require('mysql');
import MYSQL_CONFIG from '../mysql-config';
import { MySqlQuerySource } from '../../dist';

describe('MySQL', () => {
    let client = mysql.createConnection({
        ...MYSQL_CONFIG,
        multipleStatements: true,
        timezone: 'Z'
    });
    client.connect();

    beforeAll((done) => {
        client.query(BEFORE_ALL_MYSQL, (err) => err ? done.fail(err) : done());
    });

    beforeEach((done) => {
        client.query(BEFORE_EACH_MYSQL, (err) => err ? done.fail(err) : done());
    });

    describe('Non parameterized', () => {
        let { logger, log } = createLogger(sql => sql.replace(/`/g, '"'));
        let db = new MySqlQuerySource(client, { parameterized: false, logger });

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'mysql');
        TABLE_QUERY(db, log, 'mysql');
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
        EXAMPLES(db, log);
    });

    describe('Parameterized', () => {
        let { logger, log } = createLogger((sql, params) => substituteMySqlParams(sql, params).replace(/`/g, '"'));
        let db = new MySqlQuerySource(client, { parameterized: true, logger });

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'mysql');
        TABLE_QUERY(db, log, 'mysql');
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
        EXAMPLES(db, log);
    });

    describe('Parameterized - without substitution', () => {
        let { logger, log } = createLogger();
        let db = new MySqlQuerySource(client, { parameterized: true, logger });

        SQL_INJECTION_REMOTE(db, log, 'mysql');
        PARAMETERIZED(db, log, 'mysql');
    });
});
