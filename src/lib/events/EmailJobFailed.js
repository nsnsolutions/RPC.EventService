'use strict';

module.exports = function(opts) {

    var shared = this,
        logLevel = opts.logLevel;

    return {
        validate: validate,
        pack: pack
    }

    // -----------------------------------------------------------------------

    function validate(console, state, done) {

        if(!state.has('reason'))
            return done({ name: 'badRequest',
                message: 'Missing required field: reason' });

        else if(!state.has('reason', String))
            return done({ name: 'badRequest',
                message: 'Wrong type for field: reason. Expected String' });

        else if(state.get('reason') === "")
            return done({ name: 'badRequest',
                message: 'Invalid value for field: reason. Recieved Empty String.' });

        done(null, state);
    }

    function pack(console, state, done) {
        state.set('payload.details.reason', state.reason);
        done(null, state);
    }
};
