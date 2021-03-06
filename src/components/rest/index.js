import { createServer } from 'node:http';
import { promisify } from 'node:util';
import proto from './proto';

export const name = 'REST Handler';

export default async ({ loadComponent, restBinding }) => {
    const { methods } = await loadComponent('Methods');
    return async () => {
        const server = createServer(async (req, res) => {
            const { pathname } = new URL(req.url, 'http://localhost');
            const method = pathname.slice(1);
            if(!(method in proto) || !(method in methods)) return res.writeHead(404).end();
            const [ httpMethod, readRequest, writeResponce ] = proto[method];
            if(httpMethod !== req.method) return res.writeHead(405).end();
            try{
                await writeResponce(res, await methods[method](await readRequest(req)));
            } catch(e){
                res.writeHead(e.code || 500).end(e.message);
            }
        });
        const [ host, port ] = restBinding.split(':');
        await promisify(server.listen).call(server, +port, host);
        const close = promisify(server.close).bind(server);
        return async () => {
            const start = Date.now();
            await close();
            console.log(`${name} closed in ${Date.now() - start} ms`);
        };
    };
};
