'use strict';

const AWS = require('aws-sdk');
const rpcUtils = require('rpc-utils');
const services = require('./services');

module.exports = function RPC_ApprovalService(App) {

    // Simplify reference to configurations.
    var conf = App.configurations;

    // Validate Shared Configs
    conf.service.assertMember("notifyArn");

    // Validate Service Configs.
    conf.shared.assertMember("region");
    conf.shared.assertMember("logLevel");

    var app = App({
        onConfigUpdate: () => app.restart(),
        onStart: bootstrap,
        onRestart: bootstrap,
        onShutdown:() => process.exit(0)
    });

    app.start();

    // ------------------------------------------------------------------------

    function bootstrap(bus, conf) {

        var params = {
            logLevel: conf.shared.logLevel,
            notifyArn: conf.service.notifyArn,
            snsClient: new AWS.SNS({ region: conf.shared.region })
        };

        bus.use(services.RaiseEventPlugin, params);

        bus.rpcClient({ pin: "role:*" });
        bus.rpcServer({ pin: [
            "role:eventService",
            "role:eventService.Pub"
        ]});

    }
}
