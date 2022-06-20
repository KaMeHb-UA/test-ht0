import HTTPError from '@/helpers/http-error';

const methodArgs = {
    log: {
        Category: "string",
        Origin: "string",
        Message: "string",
        Timestamp(v){
            if(Number.isNaN(+new Date(v))) throw new HTTPError('Invalid datetime string supplied in Timestamp field', 400);
        },
    },
};

export function checkArgs(name, args){
    const argTypes = methodArgs[name];
    for(const arg in argTypes){
        if(!(arg in args)) throw new HTTPError(arg + ' field not found in args', 400);
        else if(typeof argTypes[arg] === 'function') argTypes[arg](args[arg]);
        else if(typeof args[arg] !== argTypes[arg])
            throw new HTTPError(`${arg} field has incorrect type. Expected ${argTypes[arg]} but received ${typeof args[arg]}`, 400);
    }
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
