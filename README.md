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

# API

## Methods

The following is a full list of methods provided by this service. More detail
can be found for each method in dedicated sections below.

| role             | cmd           | Plugin Name      | Description                       |
| ---------------- | ------------- | ---------------- | --------------------------------- |
| eventService.Pub | raiseEvent.v1 | RaiseEventPlugin | Validate, format and raise event. |

### Raise Event (version 1)

Validate, format and raise event.

- role: eventService.Pub
- cmd: raiseEvent.v1
- Plugin: RaiseEventPlugin

### Returns

- Success response: [raiseEventResponse_v1](#raiseeventresponse_v1)
- Failed response: [errorResponse_v1](#errorresponse_v1)

#### API Interface URI

`/amqp/exec/eventService/raiseEvent?version=v1`

#### Arguments

| Param     | Type   | Default | Description                                                            |
| --------- | ------ | ------- | ---------------------------------------------------------------------- |
| type      | String | N/A     | The type of event to raise. _See [Events](#events) for valid options._ |
| jobId     | String | N/A     | The job this event is associated with.                                 |
| eventDate | String | `NOW`   | Optional: The time the event was raised.                               |
| itemId    | String | null    | Optional: The item this event is associated with.                      |
| token     | String | null    | Optional: The authority token associated with this event.              |

<sup>_Note: Additional requirements might be required depending on the event
being raised._</sup>

### Representations

#### raiseEventResponse_v1

Represents a successful execution of raiseEvent. This model will contain an
event ID that can be used to lookup an event once it is done processing.

```json
{
    "eventId": "6c65d0eab7f94fde88970bf14ebf66a7"
}
```

#### ErrorsResponse_v1

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

### Events

This service capable of interacting with the following events.

##### PrintJobApprovalRequested

Represents a VFS print job event that has been submitted for processing, but requires
approval to continue.

To raise this event, additional fields are required

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| token     | String | N/A     | The authority token associated with this event. |

##### PrintJobApproved

Represents a VFS approval even on print job that was approved and is or has
completed processing.

To raise this event, additional fields are required

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| token     | String | N/A     | The authority token associated with this event. |
| comments  | String | null    | Optional: Comments about the approved job.      |

##### PrintJobDeclined

Represents a VFS approval declined event on a print job that was declinee and
will be or has already been cancelled.

To raise this event, additional fields are required

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| token     | String | N/A     | The authority token associated with this event. |
| comments  | String | null    | Optional: Comments about the declined job.      |

##### PrintJobStatusChanged

Represents a VFS status change event on a print job that has had it's status
altered during processing.

To raise this event, additional fields are required

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| status    | String | N/A     | The name of the new status of the Print Job.    |

##### PrintJobCancelled

Represents a VFS print job event that has been manualy halted for any reason.


##### PrintJobFailed

Represents a VFS failure event on a print job that failed to process due to a
error in the request or a programming bug.

To raise this event, additional fields are required

| Param     | Type   | Default | Description                                     |
| --------- | ------ | ------- | ----------------------------------------------- |
| reason    | String | N/A     | Details as to the reason the print job failed.  |
