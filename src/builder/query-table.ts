import DefaultQueryColumn from "./default-column";


export default class QueryTable {

    $all = new DefaultQueryColumn<this, any>(this, {
        special: '*'
    });
}
