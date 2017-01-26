'use strict';

module.exports = {
    tryStep: tryStep
};

function tryStep(meth, name) {

    return handler;

    function handler(console, state, done) {

        meth(console, state, (err) => {

            if(name)
                state.set(`$try.${name}`, {
                    err: err,
                    hasError: Boolean(err) });

            done(null, state);
        });

    }
}
