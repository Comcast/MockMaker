// Copyright 2019 Comcast Cable Communications Management, LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// MockMaker is an easy to run service that can allow you to quickly set
// up a mock server for testing purposes.

var express = require('express'),
    url = require('url'),
    bodyParser = require('body-parser'),
    path = require('path'),
    util = require('util'),
    args = require('minimist')(process.argv.slice(2));

// parse port
var listeningPort = 80;  // default port
if (args._[0]) { listeningPort = args._[0];}

// Start the express applicaiton
var app = express();


// parse the body just as raw text
app.use(function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
});

// enable the docs directory
app.use('/docs', express.static('public'));

///////////////// Global Variables //////////////////////
var mockEndpoints = new Array(); // {endpoint,return body}
var countEndpoints = new Array(); // {endpoint, count}
var httpEndpoints = new Array(); // {endpoint, return http status code, location}
var delayEndpoints = new Array(); // {endpoint, return delay, return body}
var lastPayloads = new Map();


///////////////// Global Functions //////////////////////

// Drop the first part of the path and return the remaining
// part of the path.
function getRequestedPathName(request) {
    var pathname = url.parse(request.url).pathname;
    var pathNameArray = pathname.split("/");
    // remove first path from the array
    pathNameArray.shift();
    pathNameArray.shift();
    pathNameArray.shift();
    return pathNameArray.join('/');
}

function dropFirstPartOfPathName(pathName) {
    var pathNameArray = pathName.split("/");
    // remove first path from the array
    pathNameArray.shift();
    return '/' + pathNameArray.join('/');
}

function returnFirstPartOfPathName(pathName) {
    var pathNameArray = pathName.split("/");
    // remove first path from the array
    return pathNameArray[0];
}

// check to see if path is a registered mock endpoint
function isMockEndpoint(pathName) {
    for (let index in mockEndpoints) {
        if (mockEndpoints[index][0] == pathName) {
            return true;
        }
    }
    return false;
}

// return the configuration for the path name
function getMockEndpointConfig(pathName) {
    for (let index in mockEndpoints) {
        if (mockEndpoints[index][0] == pathName) {
            return mockEndpoints[index];
        }
    }
    return new Array();
}


function deleteMockEndpointConfig(pathName) {
    for (let index = 0; index < mockEndpoints.length; index++) {
        if (mockEndpoints[index][0] == pathName) {
            mockEndpoints.splice(index, 1);
            break;
        }
    }
}

// check to see if path is a registered delay endpoint
function isDelayEndpoint(pathname) {
    for (let index in delayEndpoints) {
        if (delayEndpoints[index][0] == pathname) {
            return true;
        }
    }
    return false;
}

// return the configuration for the path name
function getDelayEndpointConfig(pathName) {
    for (let index in delayEndpoints) {
        if (delayEndpoints[index][0] == pathName) {
            return delayEndpoints[index];
        }
    }
    console.log("%s No delay config found for path: %s", new Date().toISOString(), pathName)

    return new Array();
}

function deleteDelayEndpointConfig(pathName) {
    for (let index = 0; index < delayEndpoints.length; index++) {
        if (delayEndpoints[index][0] == pathName) {
            delayEndpoints.splice(index, 1);
            break;
        }
    }
}

// check to see if path is a registered http endpoint
function isHttpEndpoint(pathname) {
    for (let index in httpEndpoints) {
        if (httpEndpoints[index][0] == pathname) {
            return true;
        }
    }
    return false;
}

// return the configuration for the path name
function getHttpEndpointConfig(pathName) {
    for (let index in httpEndpoints) {
        if (httpEndpoints[index][0] == pathName) {
            return httpEndpoints[index];
        }
    }
    console.log("%s No HTTP config found for path: %s", new Date().toISOString(), pathName)
    return new Array();
}

function deleteHttpEndpointConfig(pathName) {
    for (let index = 0; index < httpEndpoints.length; index++) {
        if (httpEndpoints[index][0] == pathName) {
            httpEndpoints.splice(index, 1);
            break;
        }
    }
}

// Increment the count of the path received
function incrementEndpointCount(pathName) {
    var countMatchFound = false;
    for (let index in countEndpoints) {
        if (countEndpoints[index][0] == pathName) {
            countEndpoints[index][1] += 1;
            countMatchFound = true;
            break;
        }
    }
    if (!countMatchFound) {
        countElement = new Array();
        countElement[0] = pathName;
        countElement[1] = 1;
        countEndpoints.push(countElement);
    }
}

function createReportString(){
      var reportBody = "\n MockMaker Report\n----------------------------------------\n";
      var maxEndpointLength = getMaxEndpointLength()+2;
      reportBody += " Registered Mock Endpoints\n";
      for (index in mockEndpoints) {
          reportBody += util.format("    %s  : %s\n", pad(mockEndpoints[index][0],maxEndpointLength,' ',STR_PAD_RIGHT), mockEndpoints[index][1].substr(0, 50));
      }
      reportBody += " Registered HTTP Status Code Endpoints\n";
      for (index in httpEndpoints) {
          reportBody += util.format("    %s  : %s : %s\n", pad(httpEndpoints[index][0],maxEndpointLength,' ',STR_PAD_RIGHT), httpEndpoints[index][1], httpEndpoints[index][2].substr(0, 50));
      }
      reportBody += " Registered Delay Endpoints\n";
      for (index in delayEndpoints) {
          reportBody += util.format("    %s  : %s  : %s\n", pad(delayEndpoints[index][0],maxEndpointLength,' ',STR_PAD_RIGHT), delayEndpoints[index][1], delayEndpoints[index][2].substr(0, 50));
      }
      reportBody += " Endpoints Count\n";
      for (index in countEndpoints) {
          reportBody += util.format("    %s  : %s\n", pad(countEndpoints[index][0],maxEndpointLength,' ',STR_PAD_RIGHT), countEndpoints[index][1]);
      }
      return reportBody;

}

// Determine the longs endpoint name to format report
function getMaxEndpointLength(){
      var maxLength=0;
      for (index in mockEndpoints) {
          maxLength = Math.max(maxLength,mockEndpoints[0].length);
      }
      for (index in httpEndpoints) {
          maxLength = Math.max(maxLength,httpEndpoints[index][0].length);
      }
      for (index in delayEndpoints) {
          maxLength = Math.max(maxLength,delayEndpoints[index][0].length);
      }
      for (index in countEndpoints) {
          maxLength = Math.max(maxLength,countEndpoints[index][0].length);
      }
      return maxLength;
}

// Padding is critical for the report output.
// credit: https://stackoverflow.com/questions/2686855/is-there-a-javascript-function-that-can-pad-a-string-to-get-to-a-determined-leng
var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

function pad(str, len, pad, dir) {

    if (typeof(len) == "undefined") { var len = 0; }
    if (typeof(pad) == "undefined") { var pad = ' '; }
    if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }

    if (len + 1 >= str.length) {

        switch (dir){

            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
            break;

            case STR_PAD_BOTH:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
            break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
            break;
        }
    }
    return str;
}

///////////////// ROUTES //////////////////////

// Add mock endpoint
// Example:
//     curl -X POST http://10.10.10.10/mockmaker/add/mymockendpoint -d '{desired response body for endpoint}'
app.post('/mockmaker/add/*', function(request, response) {
    var newPath = '/' + getRequestedPathName(request);

    //Check for duplicate endpoints.  Delete existing instance.
    if (isMockEndpoint(newPath)) {
        console.log("%s [%s] Duplicate endpoint found.  Removing old instance: %s", new Date().toISOString(), "/add", newPath)
        deleteMockEndpointConfig(newPath);
    }

    console.log("%s [%s] Adding new endpoint: %s", new Date().toISOString(), "/add", newPath)

    newMockEndpoint = new Array();
    newMockEndpoint[0] = newPath;
    newMockEndpoint[1] = request.rawBody;
    mockEndpoints.push(newMockEndpoint);
    response.send('OK');
})

// Add HTTP  endpoint
// Format  /mockmaker/http/{desired http status code}/{endpointname}
// For HTTP 302, the body of the request will dictate the location value
//
// Example:
//     curl -X POST http://10.10.10.10/http/404/mymockendpoint
//       this will return a HTTP 404 for the endpoint /mymockendpoint
//     curl -X POST http://10.10.10.10/http/302/mymockendpoint -d 'http://redirect.com/path'
//       this will return a HTTP 302 and set the location header value to http://redirect.com/path
app.post('/mockmaker/http/*', function(request, response) {
    var newPath = getRequestedPathName(request);
    var httpStatusCode = returnFirstPartOfPathName(newPath);
    newPath = dropFirstPartOfPathName(newPath);

    //Check for duplicate endpoints.  Delete existing instance.
    if (isHttpEndpoint(newPath)) {
        console.log("%s [%s] Duplicate endpoint found.  Removing old instance: %s", new Date().toISOString(), "/add", newPath)
        deleteHttpEndpointConfig(newPath);
    }

    console.log("%s [%s] Adding new endpoint with HTTP status code : %s ,HTTP Status code: %s", new Date().toISOString(), "/http", newPath, httpStatusCode)

    //mockEndpoints.push(newPath)
    newMockEndpoint = new Array();
    newMockEndpoint[0] = newPath;
    newMockEndpoint[1] = httpStatusCode;
    newMockEndpoint[2] = request.rawBody;
    httpEndpoints.push(newMockEndpoint);
    response.send('OK');
})

// Add delay endpoint
// Format  /delay/{desired delay in ms}/{endpointname}
//
// Example:
//     curl -X POST http://10.10.10.10/delay/1500/mymockendpoint -d 'response body message'
//       this will delay for 1.5 seconds and return the desired response body

app.post('/mockmaker/delay/*', function(request, response) {
    var newPath = getRequestedPathName(request);
    var delayValue = returnFirstPartOfPathName(newPath);
    newPath = dropFirstPartOfPathName(newPath);

    //Check for duplicate endpoints.  Delete existing instance.
    if (isDelayEndpoint(newPath)) {
        console.log("%s [%s] Duplicate endpoint found.  Removing old instance: %s", new Date().toISOString(), "/delay", newPath)
        deleteDelayEndpointConfig(newPath);
    }

    console.log("%s [%s] Adding new endpoint with delay: %s : Delay: %s  : Body: ", new Date().toISOString(), "/delay", newPath, delayValue, request.rawBody)

    newMockEndpoint = new Array();
    newMockEndpoint[0] = newPath;
    newMockEndpoint[1] = delayValue;
    newMockEndpoint[2] = request.rawBody;
    delayEndpoints.push(newMockEndpoint);
    response.send('OK');
})

// This responds a GET request for the /count page.
app.get('/mockmaker/count/*', function(req, res) {
    var newPath = '/' + getRequestedPathName(req);
    var responseBody = 0;
    for (let index in countEndpoints) {
        if (countEndpoints[index][0] == newPath) {
            responseBody = countEndpoints[index][1];
            break;
        }
    }
    console.log("%s [%s] Returning count for endpoint: %s   Count: %s", new Date().toISOString(), "/count", newPath, responseBody.toString());
    res.send(responseBody.toString());
})

//todo should also return headers for last request
app.get('/mockmaker/lastpayload/*', function(req, res) {
    var path = "/" + getRequestedPathName(req);
    var payload = lastPayloads.get(path)
    res.send(payload)
})

// Health endpoint
app.get('/mockmaker/health', function(req, res) {
    console.log("%s [%s] Returning status OK", new Date().toISOString(), "/health")
    res.send('OK');
})

// Resets all values and counters
app.get('/mockmaker/reset', function(req, res) {
    console.log("%s [%s] Resetting environment", new Date().toISOString(), "/reset")
    mockEndpoints = new Array();
    countEndpoints = new Array();
    delayEndpoints = new Array();
    httpEndpoints = new Array();
    res.send('RESET');
})

// Generates a report of currently configured endpoints
// along with the count received.  The report is returned
// in the body of the response and also written to log.
app.get('/mockmaker/report', function(req, res) {
    console.log("%s [%s] Generating report", new Date().toISOString(), "/report");
    var reportBody = createReportString();
    console.log("%s %s", new Date().toISOString(), reportBody)

    res.set("Content-type", 'text/plain');
    res.send(reportBody);
})

// Path for all mock endpoints
app.all('/*', function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var responseBody = '';

    incrementEndpointCount(pathname);

    if (isMockEndpoint(pathname)) {
        var config = getMockEndpointConfig(pathname);
        lastPayloads.set(pathname, req.rawBody)
        res.send(config[1]);
        console.log("%s [%s] Mock Endpoint.", new Date().toISOString(), pathname)

    } else if (isHttpEndpoint(pathname)) {
        lastPayloads.set(pathname, req.rawBody)
        var config = getHttpEndpointConfig(pathname);
        //console.log("PathName" + pathname);

        console.log("CONFIG" + config);
        // FOR HTTP 302, add the location header
        if (config[1] == 302) {
            var location = "location:" + config[2];
            res.set("location", config[2]);
            res.status(config[1]).send("HTTP " + config[1] + " location:" + config[2]);
            console.log("%s [%s] Mock HTTP Endpoint.", new Date().toISOString(), pathname)
        } else {
            res.status(config[1]).send("HTTP " + config[1]);
            console.log("%s [%s] Mock HTTP Endpoint.", new Date().toISOString(), pathname)
        }

    } else if (isDelayEndpoint(pathname)) {
        lastPayloads.set(pathname, req.rawBody)
        var config = getDelayEndpointConfig(pathname);


        setTimeout(function() {
            console.log("%s [%s] Mock DelayEndpoint.", new Date().toISOString(), pathname)
            res.status(200).send(config[2]);
            res.end();
        }, config[1]);

    } else {
        console.log("%s [%s] HTTP 404 Endpoint not registered: %s", new Date().toISOString(), "/", pathname)
        res.status(404).send("HTTP 404 Endpoint not configured in MockMaker");
    }
})


var server = app.listen(listeningPort, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("MockMaker app listening at http://%s:%s", host, port)
})
