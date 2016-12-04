
interface QueryProcessor {
    execute<T>(query: any): Promise<T>;
}

export default QueryProcessor;
