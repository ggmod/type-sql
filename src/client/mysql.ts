import QuerySource from "../builder/query-source";
import {QueryProcessorOptions, createQueryProcessor} from "./query-processor";

export default class MySqlQuerySource extends QuerySource {

    constructor(client: any, options: QueryProcessorOptions = {}) {
        super(createQueryProcessor(client, options, 'mysql'));
    }
}
