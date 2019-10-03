# HTTP Status Code Endpoint Examples

## REST API Format

The basic configuration for setting up a mock endpoint that returns a HTTP status code is:

```
curl -X PUT http://mockmaker-server/mockamker/http/{http status code}/{endpoint name} -d '{optionally, redirect url}'
```

Name               | Description
------------------ | -------------------------------------------------------------------------------------
{http status code} | Any valid HTTP response code. Examples: 204, 400, 404, 500,...
{endpoint name}    | Mock endpoint the application will call
{redirect url}     | The body of the request will be used to set the 'location' header for HTTP 302's only

## HTTP 404 Example

### Step 1: Configure the endpoint with the desired response body.

```

curl -X POST http://mockmaker-server/mockmaker/http/404/stock_quote
```

### Step 2: Application will now be able to call mock endpoint.

Both POST and GET are supported.

```
curl -X POST http://mockmaker-server/stock_quote
OR
curl -X GET http://mockmaker-server/stock_quote
```

Both requests above will get a `HTTP 404`

## HTTP 302 Example

### Step 1: Configure the endpoint with the desired response body.

```

curl -X POST http://mockmaker-server/mockmaker/http/302/media_info -d 'http://redirect.com/path'
```

### Step 2: Application will now be able to call mock endpoint.

Both POST and GET are supported.

```
curl -X POST <http://mockmaker-server/media_info>

OR

curl -X GET <http://mockmaker-server/media_info
```

Both requests above will get a `HTTP 302` with the header value of:

```
location: http://redirect.com/path
```
