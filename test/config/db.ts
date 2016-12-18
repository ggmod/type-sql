import { QuerySource, PgQueryProcessor, QueryProcessorOptions } from "../../dist";
import { Client } from 'pg';
import PG_CONFIG from '../pg-config';


let dummyPgClient = {
    query() {
        return Promise.resolve({ rows: [] });
    }
};

let pgClient = new Client(PG_CONFIG);
pgClient.connect();

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
    let db = new QuerySource(new PgQueryProcessor(client, options));
    return { db, log, client };
}

let dummyDB = createDb({ parameterized: false });

let pgDB = createDb({}, pgClient);

function getDB(pg = false): TestDB {
    return pg ? pgDB : dummyDB;
}

export { getDB, createDb };
