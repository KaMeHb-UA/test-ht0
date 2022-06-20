import appRoot from '@/helpers/app-root';
import { registerComponent, unregisterComponent, loadComponent } from '@/services/component-registration/index.js'
import stubUnits from './stub-units';
import units from './units';
import getPorts from './get-ports';

// unit tests
import grpcUnitTest from '../grpc.unit.test';
import restUnitTest from '../rest.unit.test';
import serverUnitTest from '../server.unit.test';
import methodsUnitTest from '../methods.unit.test';

const [ grpcBinding, restBinding ] = (await getPorts(2)).map(port => `127.0.0.1:${port}`);

const basicOptions = {
    grpcBinding,
    restBinding,
    appRoot,
    loadComponent,
};

// fill shared tests state as a component
void function(){
    let grpcResolver, restResolver;
    const grpcStop = new Promise(r => grpcResolver = r);
    const restStop = new Promise(r => restResolver = r);
    registerComponent({
        name: 'tests state',
        default: () => ({
            grpcResolver,
            grpcStop,
            restResolver,
            restStop,
        }),
    }, basicOptions);
}();

const unitTests = {
    'gRPC Handler': grpcUnitTest,
    'REST Handler': restUnitTest,
    'Server': serverUnitTest,
    'Methods': methodsUnitTest,
};

console.log('Running unit tests...');

for(const name in unitTests){
    console.log(`${
        '\n\n--------------------------------\n\n'
    }${
        ''.padStart(16 - Math.floor(name.length / 2), ' ')
    }${
        name
    }${
        '\n\n--------------------------------\n'
    }`);
    const start = Date.now();
    const components = Object.assign({}, stubUnits, {
        [name]: units[name],
    });
    Object.keys(components).map(componentName => registerComponent({
        name: componentName,
        default: components[componentName],
    }, basicOptions));
    await unitTests[name](Object.assign({}, basicOptions));
    console.log(`${name} test done in ${Date.now() - start} ms`);
    Object.keys(components).map(unregisterComponent);
}
