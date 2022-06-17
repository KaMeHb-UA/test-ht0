import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { load } from '@grpc/proto-loader';
import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';

export const name = 'gRPC Handler';

function wrapMethods({ methods }){
    const res = {};
    for(const name in methods){
        res[name] = async ({ request }, callback) => {
            try{
                callback(null, await methods[name](request));
            } catch(e){
                callback(e);
            }
        };
    }
    return res;
}

export default async ({ appRoot, loadComponent, grpcBinding }) => {
    const [ methods, packageDefinition ] = await Promise.all([
        loadComponent('Methods').then(wrapMethods),
        load(resolve(appRoot, 'grpc.proto')),
    ]);
    const proto = loadPackageDefinition(packageDefinition);
    return async () => {
        const server = new Server();
        server.addService(proto.LogService.service, methods);
        await promisify(server.bindAsync).call(server, grpcBinding, ServerCredentials.createInsecure());
        server.start();
        const close = promisify(server.tryShutdown).bind(server);
        return async () => {
            const start = Date.now();
            await close();
            console.log(`${name} closed in ${Date.now() - start} ms`);
        };
    };
};
