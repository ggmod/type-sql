import { QuerySource, QueryProcessorOptions, createQueryProcessor } from "../../dist";

export interface TestLog {
    sql: string,
    params: any[] | undefined
}

interface TestDB {
    db: QuerySource,
    log: TestLog
}

function createDb(client: any, options: QueryProcessorOptions, engine: string, logConverter?: (sql: string, params: any[]) => string): TestDB {
    let log = {} as TestLog;

    Object.assign(options, {
        logger: (sql: string, params?: any[]) => {
            log.sql = logConverter ? logConverter(sql, params!) : sql;
            log.params = params;
        }
    });
    let db = new QuerySource(createQueryProcessor(client, options, engine as any));
    return { db, log };
}

export { createDb };
