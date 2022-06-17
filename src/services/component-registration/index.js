const loadedComponents = {};

export function registerComponent({ name, default: loader }, options){
    if(name in loadedComponents) throw new Error('Cannot register component ' + name + ' twice');
    loadedComponents[name] = new Promise(r => setTimeout(r))
        .then(() => loader(options))
        .then(component => loadedComponents[name] = component);
}

export async function loadComponent(name){
    if(name in loadedComponents) return loadedComponents[name];
    throw new Error('There is no registered component named ' + name);
}
