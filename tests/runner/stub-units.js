import { withArgsCheck } from '@/components/methods/args';

const logs = [];

export default {
    'Methods': async () => ({
        methods: withArgsCheck({
            async log(){},
        }),
        destroy(){},
    }),
    'gRPC Handler': async ({ loadComponent }) => {
        const { grpcResolver } = await loadComponent('tests state');
        return async () => grpcResolver;
    },
    'REST Handler': async ({ loadComponent }) => {
        const { restResolver } = await loadComponent('tests state');
        return async () => restResolver;
    },
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
