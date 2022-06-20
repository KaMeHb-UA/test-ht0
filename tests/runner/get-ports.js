import { createServer } from 'node:net';
import { promisify } from 'node:util';

export default count => {
    const ps = new Array(count).fill(undefined).map(() => new Promise(async resolve => {
        const srv = createServer();
        await promisify(srv.listen).call(srv, 0);
        const { port } = srv.address();
        await promisify(srv.close).call(srv);
        resolve(port);
    }));
    return Promise.all(ps);
}
