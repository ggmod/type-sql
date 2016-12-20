import { QuerySource, QueryProcessorOptions, createQueryProcessor } from "../../dist";

export interface TestLog {
    sql: string,
    params: any[] | undefined
}

interface TestDB {
    db: QuerySource,
    log: TestLog
}

function createDb(client: any, options: QueryProcessorOptions): TestDB {
    let log = {} as TestLog;

    Object.assign(options, {
        logger: (sql: string, params?: any[]) => {
            log.sql = sql;
            log.params = params;
        }
    });
    let db = new QuerySource(createQueryProcessor(client, options));
    return { db, log };
}

export { createDb };
