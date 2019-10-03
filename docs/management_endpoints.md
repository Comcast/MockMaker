# Management Endpoints

## Management Endpoints Summary

REST endpoint                | Description
---------------------------- | -----------------------------------------------------------
`GET /mockmaker/count/{endpoint name}` | Count how many times the endpoint has been hit
`GET /mockmaker/reset`                 | Resets all counters and endpoint configurations
`GET /mockmaker/health`                | Returns OK if service is running
`GET /mockmaker/report`                | Returns a report of all endpoint configuration and counters

## Count

The basic configuration for setting up a mock endpoint that returns a static resonse message:

### REST API Format

```
curl -X GET http://mockmaker-server/mockmaker/count/{endpoint name}'
```

Name            | Description
--------------- | ---------------------------------------
{endpoint name} | Mock endpoint the application will call

### Example

```
curl -X GET http://mockmaker-server/count/current_weather/90210'
```

MockMaker will return in the body of the response a `1` which is the number of times the application has hit that endpoint.

## Reset

The basic configuration for setting up a mock endpoint that returns a static resonse message:

### REST API Format

Resets all configurations endpoints and clears all counters.

```
curl -X GET http://mockmaker-server/mockmaker/reset'
```

### Example

```
curl -X GET http://mockmaker-server/mockmaker/reset'
```

MockMaker will return in the body a `OK` after settings have been cleared.

## Health

Returns a confirmation message that the server is running. Mainly used for kubernetes liveliness probe.

### REST API Format

```
curl -X GET http://mockmaker-server/mockmaker/health'
```

### Example

```
curl -X GET http://mockmaker-server/mockmaker/health'
```

MockMaker will return in the body a `OK` after settings have been cleared.

## Report

Returns a report of the currently configured endpoints and counters. This is a great way to confirm the configured endpoints are properly getting configured and utilized by the application.

### REST API Format

```
curl -X GET http://mockmaker-server/mockmaker/report'
```

The body of the response will contain a `plain/text` body. Also, the report is logged to console on MockMaker.

### Example

```
curl -X GET http://mockmaker-server/mockmaker/report'
```

MockMaker will return in the body a report of the endpoints configured.  If appropriate, it will also show
the response body configured and the redirect URL for a HTTP 302. For example:

```
MockMaker Report
----------------------------------------
Registered Mock Endpoints
   /endpoint1         : {sample data}
   /endpoint2         : <result><note>no results found</note></result>
   /endpoint3         : {sample data 1234567890 1234567890 1234567890 1234
   /endpoint4         : {sample data}
Registered HTTP Status Code Endpoints
   /worksheet         : 404 :
   /myredirectpath    : 302 : http://redirect.com/path
Registered Delay Endpoints
   /asset             : 100  : {sample data2222}
   /document          : 150  : {sample data2222}
Endpoints Count
   /endpoint1         : 1
   /endpoint2         : 3
   /endpoint3         : 2
   /endpoint4         : 1
   /worksheet         : 8
   /myredirectpath    : 1
   /asset             : 1
   /document          : 1
```
