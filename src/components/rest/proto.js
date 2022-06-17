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
    return JSON.parse(body.toString('utf8'));
}

async function writeRes(res, data){
    res.end(JSON.stringify(data));
}

export default {
    log: ['POST', getParams, writeRes],
}
