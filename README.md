
# ![Image](./docs/images/logo.jpg?raw=true)

## Purpose

MockMaker is a customizable service that allows you to create a mock server on the fly.   Endpoints are available to curate the expected response using curl or equivalent commands . The API was built with automated testing in mind and allows easy setup, verification, and tear down of tests.  

The three main testing supported are:

- Return a static response
- Return a specific HTTP status code. Example, HTTP 404, 500, or even HTTP 302 with redirect
- Return a response after a specified delay. Example, pause for 1 second before returning a response.

Once the endpoint is configured, any application can utilize the endpoints to receive the expected responses.

## Configuration Endpoints

REST endpoint                                        | Description
---------------------------------------------------- | -----------------------------------------------------------------------------------------------
`POST /mockmaker/add/{endpoint name}`                | Add a new endpoint. The body of the request will be the response returned by the mock endpoint.
`POST /mockmaker/http/{code}/{endpoint name}`        | Returns a HTTP status code. For a HTTP 302, a redirect url can be specified.
`POST /mockmaker/delay/{timeout ms}/{endpoint name}` | Creates a new endpoint that will have a forced delay in all responses.

## Mock Endpoints

Once the configuration of the mock endpoints are created, the application can now hit that endpoint directly. All method types are supported.

```
POST /mockendpoint
GET /mockendpoint
```

Note: `mockmaker` endpoint is reserved to manage the MockMaker server.  Please see the Management Endpoints below.  

## Management Endpoints

REST endpoint                                 | Description
----------------------------------------------|------------------------------------------------------------
`GET /mockmaker/count/{endpoint name}`        | Count how many times the endpoint has been hit
`GET /mockmaker/lastpayload/{endpoint name}` | fetch the last payload that was sent to this endpoint by client
`GET /mockmaker/reset`                        | Resets all counters and endpoint configurations
`GET /mockmaker/health`                       | Returns OK if service is running
`GET /mockmaker/report`                       | Returns a report of all endpoint configuration and counters

## Dependencies
This project uses the following technologies to help build the source code and docs.  Consult the following websites for instructions
on how to install locally.
- docker: https://www.docker.com
- mkdocs: https://www.mkdocs.org
- nodejs: https://nodejs.org

## TODO

Here are a list of things that may need to be addressed in the future.  Check out the "CONTRIBUTING.md" document on how to contribute to this project.  Please post us a message if there is a feature you would like to add.

- Should unexpected mock endpoints return HTTP 404 or a HTTP 200 with empty response?
- Possibly record the request body that was sent to each mock endpoint to the log.
- Add a way in the API to return the request message received for the mock endpoint.
- Passing in the location value for HTTP 302 could be improved to something more conventional.
