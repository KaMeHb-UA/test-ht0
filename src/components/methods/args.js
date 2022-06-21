import HTTPError from '@/helpers/http-error';

const analyzeTypeUnknown = 'type field should be "count"';

function formatStrListOptions(arr){
    const [ ...elements ] = arr;
    const last = elements.pop();
    return elements.map(JSON.stringify).join(', ') + ' or ' + JSON.stringify(last);
}

const methodArgs = {
    log: {
        Category: "string",
        Origin: "string",
        Message: "string",
        Timestamp(v){
            if(Number.isNaN(+new Date(v))) throw new HTTPError('Invalid datetime string supplied in Timestamp field', 400);
        },
    },
    analyze: [{
        type(v){
            if(v !== 'count') throw new HTTPError(analyzeTypeUnknown, 400);
        },
        patterns(v){
            if(!v || typeof v !== 'object' || Array.isArray(v)) throw new HTTPError('"patterns" field should be a map with string keys');
            const knownFields = Object.keys(methodArgs.log);
            for(const i in v){
                if(!knownFields.includes(i)) throw new HTTPError(`unknown field ${JSON.stringify(i)}, should be one of ${formatStrListOptions(knownFields)}`);
                const err = new HTTPError('each "patterns" field should be an array of 1 or 2 string elements');
                if(!Array.isArray(v[i])) throw err;
                const { length, 0: first, 1: second } = v[i];
                if(length !== 1 && length !== 2) throw err;
                if(typeof first !== 'string' || (typeof second !== 'string' && typeof second !== 'undefined')) throw err;
            }
        },
    }],
};

export function checkArgs(name, args){
    const argTypesArr = Array.isArray(methodArgs[name]) ? methodArgs[name] : [ methodArgs[name] ];
    argTypesArr.forEach((argTypes, i) => {
        try{
            for(const arg in argTypes){
                if(!(arg in args)) throw new HTTPError(arg + ' field not found in args', 400);
                else if(typeof argTypes[arg] === 'function') argTypes[arg](args[arg]);
                else if(typeof args[arg] !== argTypes[arg])
                    throw new HTTPError(`${arg} field has incorrect type. Expected ${argTypes[arg]} but received ${typeof args[arg]}`, 400);
            }
        } catch(e){
            if(i + 1 === argTypesArr.length) throw e;
        }
    });
}

export function withArgsCheck(methodMap){
    const res = {};
    for(const name in methodMap){
        const method = methodMap[name];
        res[name] = async args => {
            checkArgs(name, args);
            return method(args);
        };
    }
    return res;
}
