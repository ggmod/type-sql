import { QuerySource, QueryProcessorOptions, createQueryProcessor } from "../../dist";
import { Client } from 'pg';
import mysql = require('mysql');
import PG_CONFIG from '../pg-config';
import MYSQL_CONFIG from '../mysql-config';

let dummyPgClient = {
    query(sql, paramsOrCb, cb) {
        (cb || paramsOrCb)(null, { rows: [] });
    }
};

let pgClient = new Client(PG_CONFIG);
pgClient.connect();

let mysqlClient = mysql.createConnection(MYSQL_CONFIG);
mysqlClient.connect();

interface SqlLog {
    sql: string,
    params: any[] | undefined
}

interface TestDB {
    db: QuerySource,
    log: SqlLog,
    client: any
}

function createDb(options: QueryProcessorOptions, client?: any): TestDB {
    let log = {} as SqlLog;

    Object.assign(options, {
        logger: (sql: string, params?: any[]) => {
            log.sql = sql;
            log.params = params;
        }
    });

    client = client || dummyPgClient;
    let db = new QuerySource(createQueryProcessor(client, options));
    return { db, log, client };
}

let dummyDB = createDb({ parameterized: false });

let pgDB = createDb({}, pgClient);

function getDB(pg = false): TestDB {
    return pg ? pgDB : dummyDB;
}

export { getDB, createDb };
