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
        done(null, state);
    }

    function pack(console, state, done) {
        done(null, state);
    }
};
