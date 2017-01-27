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

        else if(state.has('comments') && !state.has('comments', String))
            return done({ name: 'badRequest',
                message: 'Wrong type for field: comments' });

        else if(state.has('comments') && state.get('comments') === "")
            return done({ name: 'badRequest',
                message: 'Invalid value for field: comments. Found Empty String.' });

        done(null, state);
    }

    function pack(console, state, done) {

        state.set('payload.details.userId', state.person.userId);
        state.set('payload.details.fullName', state.person.fullName);

        if(state.has('comments'))
            state.set('payload.details.comments', state.comments);

        done(null, state);
    }
};
