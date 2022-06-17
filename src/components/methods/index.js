import HTTPError from '@/helpers/http-error';

export const name = 'Methods';

export default async ({ loadComponent }) => {
    const { add, disconnect } = await loadComponent('MongoDB Cluster');
    return {
        methods: {
            async log(data){
                if(Number.isNaN(+new Date(data.Timestamp))) throw new HTTPError('Invalid datetime string supplied in Timestamp field', 400);
                await add(data);
            },
        },
        async destroy(){
            const start = Date.now();
            await disconnect();
            console.log(`${name} closed in ${Date.now() - start} ms`);
        },
    };
};
