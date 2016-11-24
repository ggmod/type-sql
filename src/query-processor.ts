
interface QueryProcessor {
    execute<T>(query): Promise<T>;
}

export default QueryProcessor;
