const logjam = () => {

    let state = {
        owner : '',
        debug: false
    };

    const setState = (s) => { state = merge(state,s); }

    const log = (msg,options) => {
        const logType = typeof msg;
        const opts = merge(state, options);
        let txt = (!msg) ? ''
                : (logType === 'object')
                ? JSON.stringify(msg)
                : msg;
        state = opts;
        if (!opts.debug) return '';
        txt = (opts.owner !== '') ? opts.owner+': '+txt : txt;
        txt.length && console.log(txt);
    };

    return {
        log: log,
        set: setState
    };
};

const merge = (o1, o2) => {
    let one = o1 || {};
    const two = o2 || {};
    let keys;
    for(keys in two) {
        if (two.hasOwnProperty(keys)) {
            one[keys] = two[keys];
        }
    }
    return one;
}

module.exports = logjam;