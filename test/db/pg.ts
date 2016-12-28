import QUERY_RESULT from '../query-result';
import SELECT_QUERY from '../select-query';
import TABLE_QUERY from '../table-query';
import SQL_INJECTION_LOCAL from '../other-query/sql-injection-local';
import SQL_INJECTION_REMOTE from '../other-query/sql-injection-remote';
import PARAMETERIZED from '../other-query/parameterized';
import ALIAS from '../other-query/alias';
import EXAMPLES from '../other-query/examples';
import { createLogger } from '../utils/logger';
import { substitutePgParams } from "../utils/substitution";
import { sync } from '../utils/utils';
import { BEFORE_ALL_PG, BEFORE_EACH_PG } from "../utils/ddl";
import { Client } from 'pg';
import PG_CONFIG from '../pg-config';
import { PgQuerySource } from "../../dist";

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
        let { logger, log } = createLogger();
        let db = new PgQuerySource(client, { parameterized: false, logger });

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'pg');
        TABLE_QUERY(db, log, 'pg');
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
        EXAMPLES(db, log);
    });

    describe('Parameterized', () => {
        let { logger, log } = createLogger(substitutePgParams);
        let db = new PgQuerySource(client, { parameterized: true, logger });

        QUERY_RESULT(db);
        SELECT_QUERY(db, log, 'pg');
        TABLE_QUERY(db, log, 'pg');
        SQL_INJECTION_LOCAL(db);
        ALIAS(db, log);
        EXAMPLES(db, log);
    });

    describe('Parameterized - without substitution', () => {
        let { logger, log } = createLogger();
        let db = new PgQuerySource(client, { parameterized: true, logger });

        SQL_INJECTION_REMOTE(db, log, 'pg');
        PARAMETERIZED(db, log, 'pg');
    });
});
