'use strict';

var path = require('path');
var http = require('http');
var oas3Tools = require('openbackhaul-oas3-tools');
var appCommons = require('onf-core-model-ap/applicationPattern/commons/AppCommons');
var express = require('express');

var serverPort = 3032;

// uncomment if you do not want to validate security e.g. operation-key, basic auth, etc
// appCommons.openApiValidatorOptions.validateSecurity = false;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    openApiValidator: appCommons.openApiValidatorOptions
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();
appCommons.setupExpressApp(app);

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/v1/start-gui', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const stack = app._router.stack;
const lastEntries = stack.splice(app._router.stack.length - 2);  // The number of middleware we added is 2 in this case.
const firstEntries = stack.splice(0, 9); // Adding the middleware after the cookieParser
app._router.stack = [...firstEntries, ...lastEntries, ...stack];

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

//setting the path to the database 
global.databasePath = './database/config.json'
global.applicationDataPath = './application-data/'

appCommons.performApplicationRegistration();