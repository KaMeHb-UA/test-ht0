import * as grpcComponent from '@/components/grpc';
import * as restComponent from '@/components/rest';
import * as mongoComponent from '@/components/mongo';
import * as methodsComponent from '@/components/methods';
import * as serverComponent from '@/components/server';

export default Object.assign.apply(null, [
    grpcComponent,
    restComponent,
    mongoComponent,
    methodsComponent,
    serverComponent,
].map(({ name, default: loader }) => ({ [name]: loader })));
