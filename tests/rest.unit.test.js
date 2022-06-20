async function log(url, value){
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(value),
    });
    if(!res.ok){
        throw new Error(`failed to fetch ${url}: ${res.status} (${res.statusText})`);
    }
}

const validTs = new Date().toISOString();
const invalidTs = 'Invalid timestamp string';

async function checkArgs(url){
    const initialArgs = {
        Timestamp: validTs,
        Category: 'test',
        Origin: 'test',
        Message: 'test',
    };
    const calls = Object.keys(initialArgs).map(name => {
        const nextArgs = Object.assign({}, initialArgs);
        delete nextArgs[name];
        return log(url, nextArgs).then(() => {
            throw new TypeError(`log call without required arg ${name} wasn't rejected`);
        }, () => {});
    });
    calls.push(
        log(url, Object.assign({}, initialArgs, {
            Timestamp: invalidTs,
        })).then(() => {
            throw new TypeError('log call with invalid datetime string wasn\'t rejected');
        }, () => {}),
        log(url, Object.assign({}, initialArgs)),
    );
    await Promise.all(calls);
}

export default async ({ loadComponent, restBinding }) => {
    const url = 'http://' + restBinding + '/log';
    const startRest = await loadComponent('REST Handler');
    const stopRest = await startRest();
    await checkArgs(url);
    await stopRest();
};
