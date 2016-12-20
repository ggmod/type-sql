import QUERY_RESULT from '../query-result';
import { createDb } from '../config/db';
import { sync } from '../config/utils';
import { BEFORE_ALL_PG, BEFORE_EACH_PG } from "../config/ddl";
import { Client } from 'pg';
import PG_CONFIG from '../pg-config';

describe('PG', () => {
    let client = new Client(PG_CONFIG);
    client.connect();

    let { db } = createDb(client, {});

    beforeAll(sync(async() => {
        await client.query(BEFORE_ALL_PG)
    }));

    beforeEach(sync(async() => {
        await client.query(BEFORE_EACH_PG)
    }));

    QUERY_RESULT(db);
});
