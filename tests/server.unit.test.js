export default async ({ loadComponent }) => {
    const { grpcStop, restStop } = await loadComponent('tests state');
    const startServer = await loadComponent('Server');
    const stopServer = await startServer();
    await stopServer(); // should call stop functions. Stub realizations calls resolvers so we can await stop promises
    await grpcStop;
    await restStop;
};
