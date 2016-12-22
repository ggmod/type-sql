import { convertParam } from '../../dist/converter/param-converter';

enum State {
    STRING,
    PARAM,
    SQL
}

export function substitutePgParams(sql: string, params: any[]) {
    let state: State = State.SQL;
    let result: string[] = [];
    let paramStart;

    for (let i = 0; i < sql.length + 1; i++) {
        let c = sql[i];

        if (state === State.SQL) {
            if (c === "'") {
                state = State.STRING;
            } else if (c === '$') {
                state = State.PARAM;
                paramStart = i;
            }
        } else if (state === State.PARAM) {
            if (Number.isNaN(parseInt(c))) {
                state = State.SQL;
                let paramIndex = Number(sql.substring(paramStart + 1, i)) - 1;
                let param = convertParam(params[paramIndex]);
                result.splice(result.length, 0, ...param);
            }
        } else if (state === State.STRING) {
            if (c === "'") {
                state = State.SQL;
            }
        }

        if (state !== State.PARAM && i < sql.length) {
            result.push(c);
        }
    }

    return result.join('');
}

// describe('pg substitution', () => {
//     fit('check', () => {
//         console.log(substitutePgParams("test $1 asdfgh '$2' $2 qwerty $3", [123, 'xy', 44]));
//     })
// });
