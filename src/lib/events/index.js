'use strict';

const commons = require('require-dir')('.');

module.exports = function validator(trans, opts) {

    var self = {};

    init();

    return self;

    // ------------------------------------------------------------------------

    function init() {
        for(var name in commons)
            self[name] = commons[name].call(trans, opts);
    }
};
