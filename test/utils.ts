import QuerySource from "../src/builder/query-source";
import DefaultQueryProcessor from "../src/defeault-processor";

export class TestQuerySource extends QuerySource {
    get sql() { return (<DefaultQueryProcessor>this._queryProcessor).sql; }
    get params() { return (<DefaultQueryProcessor>this._queryProcessor).params; }
}

let db = new TestQuerySource(new DefaultQueryProcessor());

export { db };
