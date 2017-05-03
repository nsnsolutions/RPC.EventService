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

        if(!state.has('person'))
            return done({ name: 'badRequest',
                message: 'Missing Authority'});

        done(null, state);
    }

    function pack(console, state, done) {
        state.set('payload.details.userId', state.person.userId);
        state.set('payload.details.fullName', state.person.fullName);
        done(null, state);
    }
};
