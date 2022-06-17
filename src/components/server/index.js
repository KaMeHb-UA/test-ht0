const handlerComponents = [
    'gRPC Handler',
    'REST Handler',
];

export const name = 'Server';

export default async ({ loadComponent }) => {
    const handlers = await Promise.all(handlerComponents.map(loadComponent));
    return async () => {
        const stoppers = await Promise.all(handlers.map(start => start()));
        return async () => {
            await Promise.all(stoppers.map(stop => stop()));
        };
    };
};
