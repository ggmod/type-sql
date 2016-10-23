import BasicQueryColumn from "./basic-column";
import GenericsHelper from "./generics-helper";


export default class QueryTable<Entity> {

    private _$type: GenericsHelper<Entity>;

    $all = new BasicQueryColumn<this, Entity>(this, {
        special: '*'
    });
}
