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

        if(!state.has('status'))
            return done({ name: 'badRequest',
                message: 'Missing required field: status' });

        else if(!state.has('status', String))
            return done({ name: 'badRequest',
                message: 'Wrong type for field: status. Expected: String' });

        else if(state.get('status') === "")
            return done({ name: 'badRequest',
                message: 'Invalid data for field: status. Empty String' });

        done(null, state);
    }

    function pack(console, state, done) {
        state.set('payload.details.status', state.status);
        done(null, state);
    }
};
