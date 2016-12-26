
export function sync(fn) {
    return done => {
        fn().then(() => { done(); }, err => { done.fail(err) });
    }
}
