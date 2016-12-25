import QUERY_RESULT from '../query-result';
import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import SQL_INJECTION_LOCAL from '../other/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other/sql-injection-remote';
import PARAMETERIZED from '../other/parameterized';
import ALIAS from '../other/alias';
import { createDb } from '../config/db';
import { sync } from '../config/utils';
import { BEFORE_ALL_PG, BEFORE_EACH_PG } from "../config/ddl";
import { Client } from 'pg';
import PG_CONFIG from '../pg-config';
import { substitutePgParams } from "../config/substitute-params";

describe('PG', () => {
    let client = new Client(PG_CONFIG);
    client.connect();

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL_PG)
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH_PG)
    }));

    describe('Non parameterized', () => {
        let { db, log } = createDb(client, { parameterized: false }, 'pg');

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'pg');
        TABLE_QUERY(db, log);
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
    });

    describe('Parameterized', () => {
        let { db, log } = createDb(client, { parameterized: true }, 'pg', substitutePgParams);

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'pg');
        TABLE_QUERY(db, log);
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
    });

    describe('Parameterized - without substitution', () => {
        let { db, log } = createDb(client, { parameterized: true }, 'pg');

        SQL_INJECTION_REMOTE(db, log, 'pg');
        PARAMETERIZED(db, log, 'pg');
    });
});
