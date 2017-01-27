'use strict';

const lib = require('../lib');
const rpcUtils = require('rpc-utils');
const tryStep = lib.helpers.tryStep

module.exports = function RaiseEventPlugin(opts) {

    var seneca = this,
        shared = lib.shared(seneca, opts),
        events = lib.events(seneca, opts),
        snsClient = opts.snsClient,
        notifyArn = opts.notifyArn,
        logLevel = opts.logLevel;

    seneca.rpcAdd('role:eventService.Pub,cmd:raiseEvent.v1', raiseEvent_v1);

    return { name: 'RaiseEventPlugin' };

    // ------------------------------------------------------------------------

    function raiseEvent_v1 (args, rpcDone) {

        var params = {
            logLevel: args.get("logLevel", logLevel),
            repr: lib.repr.raiseEventResponse_v1,
            name: "Raise Event (v1)",
            code: "RE01",
            done: rpcDone
        }

        params.tasks = [
            tryStep(shared.getAuthorityFromToken),
            validate,
            packageEvent,
            raiseEvent,
        ];

        rpcUtils.Executor(params).run(args);
    }

    function validate(console, state, done) {

        console.info("Validating Client request.");

        var _timestamp = rpcUtils.helpers.fmtTimestamp(state.get('eventDate'));

        /* 
         * Required Fields 
         */

        if(!state.has('type'))
            return done({ name: 'badRequest',
                message: 'Missing required field: type' });

        else if(!state.has('type', String))
            return done({ name: 'badRequest',
                message: 'Wrong type for field: type. Expected: String' });

        else if(Object.keys(events).indexOf(state.type) < 0)
            return done({ name: 'badRequest',
                message: 'Invalid value for field: type. Expected: ' + Object.keys(events).join('. ') });

        else if(!state.has('jobId'))
            return done({ name: 'badRequest',
                message: 'Missing required field: jobId' });

        else if(!state.has('jobId', String))
            return done({ name: 'badRequest',
                message: 'Wrong type for field: jobId. Expected: String' });

        else if(state.get('jobId') === "")
            return done({ name: 'badRequest',
                message: 'Invalid valie for field: jobId. String Empty' });

        else if(state.has('eventDate') && !state.has('eventDate', String))
            return done({ name: 'badRequest',
                message: 'Wrong type for field: eventDate. Expected String' });

        else if(!_timestamp)
            return done({ name: 'badRequest',
                message: 'Invalid value for field: eventDate. Expected: ISO8601 Date string' });

        /* 
         * Optional Fields 
         */

        else if(state.has('itemId') && !state.has('itemId', String))
            return done({ name: 'badRequest',
                message: 'Wrong type for field: itemId. Expected: String' });

        else if(state.has('itemId') && state.get('itemId') === "")
            return done({ name: 'badRequest',
                message: 'Invalid valie for field: itemId. String Empty' });

        /* 
         * Validate event.
         */

        state.set('timestamp', _timestamp);

        events[state.type].validate(console, state, done);
    }

    function packageEvent(console, state, done) {

        console.info("Packing event Payload");

        var _id = rpcUtils.helpers.fmtUuid();

        state.set('payload', {
            event_id: _id,
            message_id: _id,
            type: state.type,
            job_id: state.jobId,
            timestamp: state.timestamp,
            person: state.person,
            details: {}
        });

        events[state.type].pack(console, state, (err, _state) => {
            if(!err)
                console.debug("PAYLOAD:\n", state.payload);

            done(err, _state);
        });
    }

    function raiseEvent(console, state, done) {

        console.info("Publish Event on Exchange");
        console.debug("Target ARN: " + notifyArn);

        var params;

        try {
            params = {
                TopicArn: notifyArn,
                MessageStructure: 'json',
                Message: JSON.stringify({
                    "default": JSON.stringify(state.payload),
                })
            };
        } catch(ex) {
            return done({
                name: 'internalError',
                message: "Failed to serialize event: " + ex.message,
                innerError: ex
            });
        }

        snsClient.publish(params, (err) => {
            if(err)
                return done({
                    name: "internalError",
                    message: "Failed to publish event on exchange.",
                    innerError: err });

            done(null, state);
        });

    }
};
