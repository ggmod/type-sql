
export interface TestLog {
    sql: string,
    params: any[] | undefined
}

type Logger = (sql: string, params?: any[]) => void;

function createLogger(logConverter?: (sql: string, params: any[]) => string): { log: TestLog, logger: Logger} {
    let log = {} as TestLog;

    let logger = (sql: string, params?: any[]) => {
        log.sql = logConverter ? logConverter(sql, params!) : sql;
        log.params = params;
    };
    return { logger, log };
}

export { createLogger };
