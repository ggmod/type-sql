import { convertSubstitutionParam } from '../../dist/converter/param-converter';

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
                let param = convertSubstitutionParam(params[paramIndex]);
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


export function substituteMySqlParams(sql: string, params: any[]) {
    let result: string[] = [];
    let paramIndex = 0;

    for (let i = 0; i < sql.length; i++) {
        let c = sql[i];

        if (c === '?') {
            let param = convertSubstitutionParam(params[paramIndex++]);
            result.splice(result.length, 0, ...param);
        } else {
            result.push(c);
        }
    }

    return result.join('');
}
