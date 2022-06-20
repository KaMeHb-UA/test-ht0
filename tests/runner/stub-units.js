import { withArgsCheck } from '@/components/methods/args';

const logs = [];

function checkArgs(args, ...names){
    for(const name of names){
        if(!(name in args)) throw TypeError(name + ' field not found in args');
    }
}

export default {
    'Methods': async () => ({
        methods: {
            log: withArgsCheck('log', async () => {}),
        },
    }),
    'gRPC Handler': async () => async () => {},
    'REST Handler': async () => async () => {},
    'MongoDB Cluster': async () => ({
        async add(data){
            logs.push(JSON.stringify(data));
        },
        async list(filter, options){
            return logs.map(JSON.parse);
        },
        async disconnect(){},
    }),
};
