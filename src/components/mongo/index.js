import { MongoClient } from 'mongodb';

export const name = 'MongoDB Cluster';

export default async ({ mongoBinding }) => {
    const client = new MongoClient(mongoBinding, { tls: true });
    await client.connect();
    const db = client.db();
    const collection = db.collection('logs');
    return {
        async add(data){
            await collection.insertOne(data);
        },
        async list(filter, options){
            return collection.find(filter, options).toArray();
        },
        async disconnect(){
            const start = Date.now();
            await client.close();
            console.log(`${name} closed in ${Date.now() - start} ms`);
        },
    };
};
