import { withArgsCheck } from './args';

export const name = 'Methods';

export default async ({ loadComponent }) => {
    const { add, disconnect } = await loadComponent('MongoDB Cluster');
    return {
        methods: withArgsCheck({
            async log(data){
                await add(data)
            },
        }),
        async destroy(){
            const start = Date.now();
            await disconnect();
            console.log(`${name} closed in ${Date.now() - start} ms`);
        },
    };
};
