# Delay Endpoint Examples

## REST API Format

The basic configuration for setting up a mock endpoint that returns a static response with a time delay:

```
curl -X POST http://mockmaker-server/mockmaker/delay/{milliseconds}/{endpoint name} -d '{response message}'
```

Name               | Description
------------------ | ------------------------------------------------------------------------------
{milliseconds}     | Integer number with time delay in milliseconds. Example, 1000, 1500, 60000,...
{endpoint name}    | Mock endpoint the application will call
{response message} | The body of the request will be used as the response for the mock endpoint

## Example POST Endpoint

### Step 1: Configure the endpoint with the desired response body and time delay.

The body of the configuration request will be the static response for the endpoint.

```
curl -X POST http://mockmaker-server/mockmaker/delay/5000/current_weather/90210 -d '<result> <customers> <customer><name>John Smith</name> <customer><name>Chris Smith</name> <customer><name>Sara Smith</name> <customer><name>Lisa Smith</name> </customers></result>'
```

### Step 2: Application will now be able to call mock endpoint.

```
curl -X POST http://mockmaker-server/current_weather/90210 -d '<query><filter>lastName=Smith</filter> </query>'
```

The response from MockMaker will be the response above but only after 5 seconds:

```
<result> <customers> <customer><name>John Smith</name> <customer><name>Chris Smith</name><customer><name>Sara Smith</name> <customer><name>Lisa Smith</name></customers></result>
```


## Example GET Endpoint

### Step 1: Configure the endpoint with the desired response body and time delay.

The body of the configuration request will be the static response for the endpoint.

```
curl -X POST http://mockmaker-server/mockmaker/delay/15000/current_weather/90210 -d '{ name: "Beverly Hills", forecast: "Sunny with a high reaching the upper 80s" current_temp : "78F" }'
```

### Step 2: Application will now be able to call mock endpoint.

```
curl -X GET http://mockmaker-server/current_weather/90210
```

The response from MockMaker will be the response above but only after 15 seconds:

```
{ name: "Beverly Hills", forecast: "Sunny with a high reaching the upper 80s" current_temp : "78F" }
```
