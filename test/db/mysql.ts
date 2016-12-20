import QUERY_RESULT from '../query-result';
import { createDb } from '../config/db';
import { BEFORE_ALL_MYSQL, BEFORE_EACH_MYSQL } from "../config/ddl";
import mysql = require('mysql');
import MYSQL_CONFIG from '../mysql-config';

describe('PG', () => {
    let client = mysql.createConnection(MYSQL_CONFIG);
    client.connect();

    let { db } = createDb(client, {});

    beforeAll((done) => {
        client.query(BEFORE_ALL_MYSQL, (err) => err ? done.fail(err) : done());
    });

    beforeEach((done) => {
        client.query(BEFORE_EACH_MYSQL, (err) => err ? done.fail(err) : done());
    });

    // QUERY_RESULT(db); // TODO
});
