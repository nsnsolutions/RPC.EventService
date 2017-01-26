'use strict';

module.exports = function(o) {

    var payload = o.payload || o;

    return { eventId: payload.event_id };
}
