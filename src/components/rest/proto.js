import HTTPError from '@/helpers/http-error';

function readReqBody(req){
    return new Promise((resolve, reject) => {
        const data = [];
        req.on('data', chunk => data.push(chunk));
        req.once('end', () => resolve(Buffer.concat(data)));
        req.once('error', reject);
    });
}

async function getParams(req){
    const body = await readReqBody(req);
    try{
        const res = JSON.parse(body.toString('utf8'));
        if(!res || typeof res !== 'object' || Array.isArray(res)) throw new HTTPError('Request body should contain JSON object, not any other type', 400);
        return res;
    } catch(e){
        if(e instanceof HTTPError) throw e;
        throw new HTTPError('Cannot parse request as JSON', 400);
    }
}

function getQueryParams(req){
    const { searchParams } = new URL('http://_' + req.url);
    const res = Object.fromEntries(searchParams);
    for(const i in res) try{
        res[i] = JSON.parse(res[i]);
    } catch(e){}
    return res;
}

async function writeRes(res, data){
    res.end(JSON.stringify(data));
}

export default {
    log: ['POST', getParams, writeRes],
    analyze: ['GET', getQueryParams, writeRes],
}
