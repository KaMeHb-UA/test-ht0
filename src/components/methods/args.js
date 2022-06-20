import HTTPError from '@/helpers/http-error';

const methodArgs = {
    log: {
        Category: null,
        Origin: null,
        Message: null,
        Timestamp(v){
            if(Number.isNaN(+new Date(v))) throw new HTTPError('Invalid datetime string supplied in Timestamp field', 400);
        },
    },
};

export function checkArgs(name, args){
    const argTypes = methodArgs[name];
    for(const arg in argTypes){
        if(!(arg in args)) throw new HTTPError(arg + ' field not found in args', 400);
        if(typeof argTypes[arg] === 'function') argTypes[arg](args[arg]);
    }
}

export function withArgsCheck(name, method){
    return async args => {
        checkArgs(name, args);
        return method(args);
    };
}
