import appRoot from '@/helpers/app-root';
import { registerComponent, unregisterComponent, loadComponent } from '@/services/component-registration/index.js'
import stubUnits from './stub-units';
import units from './units';
import getPorts from './get-ports';

const [ grpcBinding, restBinding ] = (await getPorts(2)).map(port => `127.0.0.1:${port}`);

const basicOptions = {
    grpcBinding,
    restBinding,
    appRoot,
    loadComponent,
};

const unitTests = {
};

console.log('Running unit tests...');

for(const name in unitTests){
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
