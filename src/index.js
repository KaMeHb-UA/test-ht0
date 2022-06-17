import loadComponent from '@/components';
import process from 'node:process';

void async function(){
    const startServer = await loadComponent('Server');
    const stopServer = await startServer();
    process.on('SIGINT', stopServer);
    process.on('SIGHUP', stopServer);
    console.log('Server started');
}();
