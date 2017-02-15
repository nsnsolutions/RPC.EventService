# RCP RPC.EventService

Validate and raise events on SNS Bus.

## Quick Start

To run the service locally:

```bash
npm install
npm start -- --debug
```

For automatic code reloading in development:

```bash
npm install -g nodemon
nodemon -- --debug
```

To run on __AMQP__, omit the ```--debug``` option from either command.

<sup>_Note: You will need a running [RabbitMQ and ETCD2](https://github.com/nsnsolutions/rpcfw.env) environment._</sup>

# Interface

This section outlines the details you will need to use this service.

- [Methods](#methods)
- [Representations](#representations)
- [Event Types](#event-types)

## Methods

- [Raise Event](#raise-event-v1) - Validate, format and raise event.

### Raise Event (v1)

Validate, format and raise event.

#### RPC Execution

- Role: eventService.Pub
- Cmd: raiseEvent.v1

```javascript
var args = { ... }
seneca.act('role:eventService.Pub,cmd:raiseEvent.v1', args, (err, dat) => {
    /* Handle result */
});
```

#### HTTP Execution

- Service Name: eventService
- Method Name: raiseEvent
- Version: v1

```
POST /amqp/exec/evetnService/raiseEvent?version=v1 HTTP/1.1
Host: devel.rpc.velma.com
Content-Type: application/json
x-repr-format: RPC
Cache-Control: no-cache

{ ... }
```

#### Arguments

Raise event accepts the following arguments.

| Param     | Type   | Default | Description                                                                 |
| --------- | ------ | ------- | --------------------------------------------------------------------------- |
| type      | String | N/A     | The type of event to raise. _See [Events](#event-types) for valid options._ |
| jobId     | String | N/A     | The job this event is associated with.                                      |
| eventDate | String | `NOW`   | Optional: The time the event was raised.                                    |
| itemId    | String | null    | Optional: The item this event is associated with.                           |
| token     | String | null    | Optional: The authority token associated with this event.                   |

<sup>_Note: Additional requirements might be required depending on the event
being raised._</sup>

#### Returns

Raise event returns the following information.

- Success response: [Raise Event Response (v1)](#raise-event-response-v1)
- Failed response: [Error Response (v1)](#error-response-v1)

## Representations

All service resposnes will map to one of these response models.

- [Raise Event Response (v1)] (#raise-event-response-v1)
- [Error Response (v1)] (#error-response-v1)

### Raise Event Response (v1)

Represents a successful execution of raiseEvent. This model will contain an
event ID that can be used to lookup an event once it is done processing.

```json
{
    "hasError": false,
    "result": {
        "eventId": "6c65d0eab7f94fde88970bf14ebf66a7" 
    }
}
```

### Error Response (v1)

Represents an execution failure. Details about the failure are placed in
`message` and a numeric value is placed in `code` that is specific the type of
error.

This response uses the standard
[rpcfw](https://github.com/nsnsolutions/rpcfw/blob/devel/README.md#errors)
error model and codes.

```json
{
    "hasError": true,
    "code": 000,
    "message": "Description of error"
}
```

For more information on workflow error codes:
[RPC-Utils.Executor](https://github.com/nsnsolutions/RPC.Utils/blob/devel/README.md#executor)

## Event Types

This service is capable of dispatching the following events.

- [Print Job Approval Request (v1)](print-job-approval-request-v1)
- [Print Job Approved (v1)](print-job-approved-v1)
- [Print Job Declined (v1)](print-job-declined-v1)
- [Print Job Status Changed (v1)](print-job-status-changed-v1)
- [Print Job Cancelled (v1)](print-job-cancelled-v1)
- [Print Job Failed (v1)](print-job-failed-v1)

### Print Job Approval Request (v1)

Represents a VFS print job event that has been submitted for processing, but requires
approval to continue.

__Type:__ PrintJobApprovalRequested

| Param     | Type   | Default | Description                                                            |
| --------- | ------ | ------- | ---------------------------------------------------------------------- |
| jobId     | String | N/A     | The job this event is associated with.                                 |
| token     | String | N/A     | The authority token associated with this event.                        |
| eventDate | String | `NOW`   | Optional: The time the event was raised.                               |

### Print Job Approved (v1)

Represents a VFS approval even on print job that was approved and is or has
completed processing.

__Type:__ PrintJobApproved

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| jobId     | String | N/A     | The job this event is associated with.          |
| token     | String | N/A     | The authority token associated with this event. |
| comments  | String | null    | Optional: Comments about the approved job.      |
| eventDate | String | `NOW`   | Optional: The time the event was raised.        |

### Print Job Declined (v1)

Represents a VFS approval declined event on a print job that was declinee and
will be or has already been cancelled.

__Type:__ PrintJobDeclined

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| jobId     | String | N/A     | The job this event is associated with.          |
| token     | String | N/A     | The authority token associated with this event. |
| comments  | String | null    | Optional: Comments about the declined job.      |
| eventDate | String | `NOW`   | Optional: The time the event was raised.        |

### Print Job Status Changed (v1)

Represents a VFS status change event on a print job that has had it's status
altered during processing.

__Type:__ PrintJobStatusChanged

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| jobId     | String | N/A     | The job this event is associated with.          |
| status    | String | N/A     | The name of the new status of the Print Job.    |
| eventDate | String | `NOW`   | Optional: The time the event was raised.        |

### Print Job Cancelled (v1)

Represents a VFS print job event that has been manualy halted for any reason.

__Type:__ PrintJobCancelled

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| jobId     | String | N/A     | The job this event is associated with.          |
| eventDate | String | `NOW`   | Optional: The time the event was raised.        |

### Print Job Failed (v1)

Represents a VFS failure event on a print job that failed to process due to a
error in the request or a programming bug.

__Type:__ PrintJobFailed

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| jobId     | String | N/A     | The job this event is associated with.          |
| reason    | String | N/A     | Details as to the reason the print job failed.  |
| eventDate | String | `NOW`   | Optional: The time the event was raised.        |
