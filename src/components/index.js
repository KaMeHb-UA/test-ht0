import * as grpcHandler from '@/components/grpc';
import * as restHandler from '@/components/rest';
import * as server from '@/components/server';
import * as methods from '@/components/methods';
import * as mongo from '@/components/mongo';
import { loadComponent, registerComponent } from '@/services/component-registration';
import appRoot from '@/helpers/app-root';
import { env } from 'node:process';

const {
    GRPC_BINDING,
    REST_BINDING,
    MONGO_CONNECTION_URL,
} = env;

const loadOptions = {
    appRoot,
    loadComponent,
    grpcBinding: GRPC_BINDING,
    restBinding: REST_BINDING,
    mongoBinding: MONGO_CONNECTION_URL,
};

await Promise.all([
    grpcHandler,
    restHandler,
    server,
    methods,
    mongo,
].map(v => registerComponent(v, loadOptions)));

export default loadComponent
