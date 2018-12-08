const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiKey = require('apikey');
const routes = require('./routes.js');

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

// Simple API Key authentication for Demo purposes
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

routes(app);

// Listen for requests

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
if (isInLambda) {
    // This part is only for Lambda. In order to run Express in Lambda runtime we need to use additial lib. This lib is AWS official one.
    // Ofcourse in prod env you probalt will separate this in two files or create some prod/demo env config 
    const serverlessExpress = require('aws-serverless-express');
    const server = serverlessExpress.createServer(app);
    exports.handler = (event, context) => serverlessExpress.proxy(server, event, context)
} else {
    // This is for local or normal usage. If you run it on Docker, local machine or anything rather than Lambda
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
}