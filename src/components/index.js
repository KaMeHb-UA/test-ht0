import * as grpcHandler from '@/components/grpc';
import * as restHandler from '@/components/rest';
import * as server from '@/components/server';
import * as methods from '@/components/methods';
import { loadComponent, registerComponent } from '@/services/component-registration';
import appRoot from '@/helpers/app-root';

const loadOptions = {
    appRoot,
    loadComponent,
    grpcBinding: '0.0.0.0:3001',
    restBinding: '0.0.0.0:3002',
};

await Promise.all([
    grpcHandler,
    restHandler,
    server,
    methods,
].map(v => registerComponent(v, loadOptions)));

export default loadComponent
