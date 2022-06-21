import HTTPError from '@/helpers/http-error';
import { withArgsCheck } from './args';

export const name = 'Methods';

async function getCount(getter, patterns){
    const regexps = {};
    for(const name in patterns){
        regexps[name] = new RegExp(...patterns[name]);
    }
    return getter(regexps);
}

export default async ({ loadComponent }) => {
    const { add, count, disconnect } = await loadComponent('MongoDB Cluster');
    return {
        methods: withArgsCheck({
            async log(data){
                await add(data);
                return {};
            },
            async analyze({ type, patterns }){
                switch(type){
                    case 'count':
                        return {
                            count: await getCount(count, patterns),
                        };
                    default:
                        throw new HTTPError('unknown analyze type', 400);
                }
            },
        }),
        async destroy(){
            const start = Date.now();
            await disconnect();
            console.log(`${name} closed in ${Date.now() - start} ms`);
        },
    };
};
