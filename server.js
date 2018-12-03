const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiKey = require('apikey');

// Configuration
const appConfig = require('./config/app.config.js');

// Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect(appConfig.db.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database.', err);
    process.exit();
});

// Create app
const app = express();

function auth(key, fn) {
    if ('1234' === key)
        fn(null, true)
    else
        fn(null, null)
}

app.use(apiKey(auth));

// Parse - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Parse - application/json
app.use(bodyParser.json())

// Import routes
var routes = require('./routes.js');
routes(app);

// Listen for requests
const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
if (isInLambda) {
    const serverlessExpress = require('aws-serverless-express');
    const server = serverlessExpress.createServer(app);
    exports.handler = (event, context) => serverlessExpress.proxy(server, event, context)
} else {
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
}