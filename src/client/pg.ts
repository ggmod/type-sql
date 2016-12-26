import QuerySource from "../builder/query-source";
import {QueryProcessorOptions, createQueryProcessor} from "./query-processor";

export default class PgQuerySource extends QuerySource {

    constructor(client: any, options: QueryProcessorOptions = {}) {
        super(createQueryProcessor(client, options, 'pg'));
    }
}
