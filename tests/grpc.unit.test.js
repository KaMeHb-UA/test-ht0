import { resolve } from 'node:path';
import { load } from '@grpc/proto-loader';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';

function log(client, arg){
    return new Promise((resolve, reject) => client.log(arg, (err, value) => {
        if(err) return reject(err);
        resolve(value);
    }));
}

const validTs = new Date().toISOString();
const invalidTs = 'Invalid timestamp string';

async function checkArgs(client){
    const initialArgs = {
        Timestamp: validTs,
        Category: 'test',
        Origin: 'test',
        Message: 'test',
    };
    const calls = Object.keys(initialArgs).map(name => {
        const nextArgs = Object.assign({}, initialArgs);
        delete nextArgs[name];
        return log(client, nextArgs).then(() => {
            throw new TypeError(`log call without required arg ${name} wasn't rejected`);
        }, () => {});
    });
    calls.push(
        log(client, Object.assign({}, initialArgs, {
            Timestamp: invalidTs,
        })).then(() => {
            throw new TypeError('log call with invalid datetime string wasn\'t rejected');
        }, () => {}),
        log(client, Object.assign({}, initialArgs)),
    );
    await Promise.all(calls);
}

export default async ({ loadComponent, grpcBinding, appRoot }) => {
    const packageDefinition = load(resolve(appRoot, 'grpc.proto'));
    const grpcHandler = await loadComponent('gRPC Handler');
    const stopGrpc = await grpcHandler();
    const proto = loadPackageDefinition(await packageDefinition);
    const client = new proto.LogService(grpcBinding, credentials.createInsecure());
    await checkArgs(client);
    await stopGrpc();
};
