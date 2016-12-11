
interface QueryProcessor {
    execute(query: any): Promise<any>;
}

export default QueryProcessor;
