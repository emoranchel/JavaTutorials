# Creating a Node.js RESTful Application in Oracle Application Container Cloud Service

## Before You Begin

This tutorial shows you how to develop a simple message board application. Using REST calls, you can read existing comments and create new comments on the message board. This tutorial takes 10 minutes to complete.

### Background

Oracle Application Container Cloud Service provides a lightweight infrastructure that lets you deploy Java Platform, Standard Edition (SE), PHP, and Node.js applications to Oracle Cloud. You can use Node.js cloud service in Oracle Application Container Cloud Service to develop RESTful web services, and then integrate them with your client applications.

### What Do You Need?

* [Node.js](https://nodejs.org/en/)
* [GiT](https://git-scm.com/downloads) (GiT CMD shell to execute cURL commands)
* Access to an instance of Oracle Application Container Cloud Service
* [A storage replication policy for your service instance](https://docs.oracle.com/en/cloud/iaas/storage-cloud/cssto/selecting-replication-policy-your-service-instance.html)

## Develop a Sample RESTful Node.js Service

1. Create a JavaScript file and name it server.js.
2. Open server.js in an editor and create a simple Node.js server.

```javascript
var http = require('http');
var PORT = 8089; 
var server = http.createServer(function (request, response) {
    response.end("LATER ON, YOU WILL PLACE CODE HERE");
});

server.listen(PORT, function () {
    console.log('Server running...');
});
```

This code fragment creates a service that listens on HTTP port 8089. In a later step, you will change this port with an Oracle Application Container Cloud Service variable.

Test your server.

```bash
node server.js
```

In a browser window, go to http://localhost:8089 and look for the following message: "LATER ON, YOU WILL PLACE CODE HERE."
To stop the server, press CTRL+C.
Add the following variable declarations after the var PORT declaration:

```javascript
var topicList = [];
var topicDetail = {};
var currentId = 123;
```

Add the following functions after the variable declarations:

```javascript
function addTopic(tTitle, tText) {
   console.log("addTopic(" + tTitle + "," + tText + ")");
   var topicId = ++currentId;
   topicList.push({title: tTitle, id: topicId});
   topicDetail[topicId] = {title: tTitle, text: tText, comments: []};
   return topicId;
}
```

```javascript
function addComment(topicId, text) {
   console.log("addComment(" + topicId + "," + text + ")");
   topicDetail[topicId].comments.push(text);
}  
```

Create sample messages.

```javascript
var id1 = addTopic("Topic 1","Topic 1 content");
var id2 = addTopic("Topic 2","Topic 2 content");
addComment(id1, "Good topic");
addComment(id2, "This is a comment");
addComment(id2, "This is another comment");            
```

Replace the http.createServer function with the following code:

```javascript
var server = http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    console.log('TopicList=' + JSON.stringify(topicList));
    console.log('TopicDetail=' + JSON.stringify(topicDetail));
    var requestBody = '';

    request.on('data', function (data) {
        requestBody += data;
    });

    request.on('end', function () {
        handleRequest(request, response, requestBody);
    });
});                    
```

Add this function to handle the HTTP requests:

```javascript
function handleRequest(request, response, requestBody) {
    console.log(request.method + ":" + request.url + ' >>' + requestBody);

    if (request.url == '/') {
        if (request.method == 'POST') {
            var jsonMsg = JSON.parse(requestBody);
            addTopic(jsonMsg.title, jsonMsg.text);
            response.end();
        } else {
            response.end(JSON.stringify(topicList));
        }
    } else {
        var topicId = request.url.substring(1);
        if (request.method == 'POST') {
            var jsonMsg = JSON.parse(requestBody);
            addComment(jsonMsg.topicId, jsonMsg.text);
            response.end();
        } else {
            response.end(JSON.stringify(topicDetail[topicId]));
        }
    }
}           
```

Your application must listen to requests on a port provided by an Oracle Application Container Cloud Service environment variable. In your server.js file, update the var PORT variable declaration.

```javascript
var PORT = process.env.PORT || 80;
```
