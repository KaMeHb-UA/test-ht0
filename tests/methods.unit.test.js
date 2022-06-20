export default async ({ loadComponent }) => {
    const { methods: { log }, destroy } = await loadComponent('Methods');
    if(typeof log !== 'function') throw new TypeError('log method isn\'t implemented');
    if(typeof destroy !== 'function') throw new TypeError('destroy method should be available in Methods component');
    await destroy();
};
