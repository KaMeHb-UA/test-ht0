import { randomUUID } from 'node:crypto';

export default async ({ loadComponent }) => {
    const { add, list, rm, disconnect } = await loadComponent('MongoDB Cluster');
    if(typeof add !== 'function') throw new TypeError('add method isn\'t implemented');
    if(typeof list !== 'function') throw new TypeError('list method isn\'t implemented');
    const logData = {
        Timestamp: new Date().toISOString(),
        Category: randomUUID(),
        Origin: randomUUID(),
        Message: randomUUID(),
    };
    await add(logData);
    if((await list(logData)).length !== 1) throw new Error('incorrect count of filtered logs found after adding one');
    await rm(logData);
    if((await list(logData)).length !== 0) throw new Error('incorrect count of filtered logs found after removing one');
    await disconnect();
};
