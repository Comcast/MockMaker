# How to run MockMaker

## Local use NodeJS

You can run MockMaker locally using just NodeJS. The application will default to port 80\. Passing in the port will override the default.

To run on port 80:

```
node src/mock-maker.js
```

To override the port.

```
node src/mock-maker.js 8080
```

## Docker

Run using a docker image.  The container defaults to using port 80. It is recommended to use port forwarding using a different local port like 8080.
```
docker run -p 8080:80 ${DOCKER_IMAGE}
```

Then use the following commands to access MockMaker.
```
curl http://localhost:8080/mockmaker/health
```
Access the documentation by pointing your browser to http://localhost:8080/docs

## Helm

Install using the chart. For the moment, the chart is only accessible through the project files.

```
cd charts
helm install ./mock-maker
```

If needed, add the port forwarding:

```
kubectl port-forward willing-coral-mock-maker-54c59749bd-4x46z 8080:80
```
