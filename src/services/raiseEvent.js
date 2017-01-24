'use strict';

const lib = require('../lib');
const rpcUtils = require('rpc-utils');
const AWS = require('aws-sdk');
const lodash = require('lodash');

module.exports = function RaiseEventPlugin(opts) {

    var seneca = this,
        shared = lib.shared(seneca, opts),
        logLevel = opts.logLevel;

    seneca.rpcAdd('role:eventService.Pub,cmd:raiseEvent.v1', raiseEvent_v1);

    return { name: 'RaiseEventPlugin' };

    // ------------------------------------------------------------------------

    function raiseEvent_v1 (args, rpcDone) {

        var params = {
            logLevel: args.get("logLevel", logLevel),
            //repr: lib.repr.ApprovalEntity_v1,
            name: "Raise Event (v1)",
            code: "ES-RE01",
            done: rpcDone
        }

        params.tasks = [
            shared.getAuthorityFromToken,
            validate
        ];

        rpcUtils.Executor(params).run(args);
    }

    function validate(console, state, done) {

        console.info("Validating Client request.");

        if(!state.has('person', Object))
            return done({
                name: "internalError",
                message: "Failed to load authority." });

        done(null, state);
    }
};
