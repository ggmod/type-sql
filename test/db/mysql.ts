import QUERY_RESULT from '../query-result';
import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import SQL_INJECTION_LOCAL from '../other/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other/sql-injection-remote';
import PARAMETERIZED from '../other/parameterized';
import ALIAS from '../other/alias';
import { createDb } from '../config/db';
import { BEFORE_ALL_MYSQL, BEFORE_EACH_MYSQL } from "../config/ddl";
import mysql = require('mysql');
import MYSQL_CONFIG from '../mysql-config';
import {substituteMySqlParams} from "../config/substitute-params";

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
        let { db, log } = createDb(client, { parameterized: false }, 'mysql', sql => sql.replace(/`/g, '"'));

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'mysql');
        TABLE_QUERY(db, log, 'mysql');
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
    });

    describe('Parameterized', () => {
        let { db, log } = createDb(client, { parameterized: true }, 'mysql', (sql, params) =>
            substituteMySqlParams(sql, params).replace(/`/g, '"'));

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'mysql');
        TABLE_QUERY(db, log, 'mysql');
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
    });

    describe('Parameterized - without substitution', () => {
        let { db, log } = createDb(client, { parameterized: true }, 'mysql');

        SQL_INJECTION_REMOTE(db, log, 'mysql');
        PARAMETERIZED(db, log, 'mysql');
    });
});
