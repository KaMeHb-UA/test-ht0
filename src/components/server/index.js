const handlerComponents = [
    'gRPC Handler',
    'REST Handler',
];

export const name = 'Server';

export default async ({ loadComponent }) => {
    const methodsDestroy = loadComponent('Methods').then(({ destroy }) => destroy);
    const handlers = await Promise.all(handlerComponents.map(loadComponent));
    return async () => {
        const stoppers = await Promise.all(handlers.map(start => start()));
        stoppers.push(await methodsDestroy);
        return async () => {
            console.log('\n\nShutdown the server...');
            const start = Date.now();
            await Promise.all(stoppers.map(stop => stop()));
            console.log(`${name} closed in ${Date.now() - start} ms`);
        };
    };
};
