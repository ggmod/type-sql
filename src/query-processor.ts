
interface QueryProcessor {

    execute<T>(query): Promise<T>;

    executeAsStream<T>(query); // TODO type??

    convertToSQL(query): string;

    convertToParameterizedSQL(query): { sql: string, params: any[] };
}

export default QueryProcessor;
