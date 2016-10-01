import QuerySource from "../src/builder/query-source";
import DefaultQueryProcessor from "../src/defeault-processor";

let db = new QuerySource(new DefaultQueryProcessor());

export { db };
