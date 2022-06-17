const loadedComponents = {};

export function registerComponent({ name, default: loader }, options){
    if(name in loadedComponents) throw new Error('Cannot register component ' + name + ' twice');
    let start;
    loadedComponents[name] = new Promise(r => setTimeout(r))
        .then(() => (start = Date.now(), loader(options)))
        .then(component => (console.log(`Component ${name} loaded in ${Date.now() - start} ms`), loadedComponents[name] = component));
}

export async function loadComponent(name){
    if(name in loadedComponents) return loadedComponents[name];
    throw new Error('There is no registered component named ' + name);
}
