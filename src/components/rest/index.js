import { createServer } from 'node:http';
import { promisify } from 'node:util';
import proto from './proto';

export const name = 'REST Handler';

export default async ({ loadComponent, restBinding }) => {
    const methods = await loadComponent('Methods');
    return async () => {
        const server = createServer(async (req, res) => {
            const { pathname } = new URL(req.url, 'http://localhost');
            const method = pathname.slice(1);
            if(!(method in proto) || !(method in methods)) return res.writeHead(404).end();
            const [ httpMethod, readRequest, writeResponce ] = proto[method];
            if(httpMethod !== req.method) return res.writeHead(405).end();
            await writeResponce(res, methods[method](await readRequest(req)));
        });
        const [ host, port ] = restBinding.split(':');
        await promisify(server.listen).call(server, +port, host);
        return promisify(server.close).bind(server);
    };
};
