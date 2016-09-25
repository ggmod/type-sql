import DefaultQueryColumn from "./default-column";
import GenericsHelper from "./generics-helper";


export default class QueryTable<Entity> {

    private _$type: GenericsHelper<Entity>;

    $all = new DefaultQueryColumn<this, Entity>(this, {
        special: '*'
    });
}
