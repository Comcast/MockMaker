# Simple Mock Endpoint Examples

## REST API Format

The basic configuration for setting up a mock endpoint that returns a static resonse message:

```
curl -X POST http://mockmaker-server/mockmaker/add/{endpoint name} -d '{response message}'
```

Name               | Description
------------------ | --------------------------------------------------------------------------
{endpoint name}    | Mock endpoint the application will call
{response message} | The body of the request will be used as the response for the mock endpoint

## Example POST Endpoint

### Step 1: Configure the endpoint with the desired response body.

The body of the configuration request will be the static response for the endpoint.

```
curl -X POST http://mockmaker-server/mockmaker/add/search/customers -d '<result><customers><customer><name>John Smith</name> <customer><name>Chris Smith</name><customer><name>Sara Smith</name> <customer><name>Lisa Smith</name></customers></result>'
```

### Step 2: Application will now be able to call mock endpoint.

```
curl -X POST http://mockmaker-server/search/customers -d '<query> <filter>lastName=Smith</filter></query>'
```

The body of the request does not impact what is returned.  Only that the endpoint called matches the endpoint configured previously.  The response from MockMaker will be:

```
<result><customers><customer><name>John Smith</name> <customer><name>Chris Smith</name><customer><name>Sara Smith</name> <customer><name>Lisa Smith</name></customers></result>
```

## Example GET Endpoint

### Step 1: Configure the endpoint with the desired response body.

The body of the configuration request will be the static response for the endpoint.

```
curl -X POST http://mockmaker-server/mockmaker/add/current_weather/90210 -d '{ name: "Beverly Hills", forecast: "Sunny with a high reaching the upper 80s" current_temp : "78F" }'
```

### Step 2: Application will now be able to call mock endpoint.

```
curl -X GET http://mockmaker-server/current_weather/90210
```

The response from MockMaker will be the response above:

```
{ name: "Beverly Hills", forecast: "Sunny with a high reaching the upper 80s" current_temp : "78F" }
```
