import fetch from 'node-fetch';

const ENV = process.env.NODE_ENV || 'production';
const PRODSERVER='https://webrtc.corp.talbots.com';
const DEVSERVER='http://localhost:1443';
/************************** */

const server= (ENV ==='production')? PRODSERVER : DEVSERVER;

const post = (api,cfg) => fetch(`${server}/${api}`,cfg);
const asJSON = (r) => r.json();


export const getSession = (data) => {
    return post('session',{method:'POST',body: JSON.stringify(data), headers: {"Content-Type": "application/json"}}).then(asJSON).then( (data) => data);
}
/*
export const getToken = (data) => post('token', getTokenData(data)).then(asJSON).then( (data) => data.token);
const getTokenData = (data) => {
    const { name, sessionId, storeId } = data;
    return {
        method:'POST',
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({
            sessionId: sessionId,
            data: `name=${name}&storeId=${storeId}`
        })
    };
};
*/
