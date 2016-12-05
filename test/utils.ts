import { QuerySource, DefaultQueryProcessor } from "../dist";

export class TestQuerySource extends QuerySource {
    get sql() { return (<DefaultQueryProcessor>this._queryProcessor).sql; }
    get params() { return (<DefaultQueryProcessor>this._queryProcessor).params; }
}

let db = new TestQuerySource(new DefaultQueryProcessor());

export { db };
