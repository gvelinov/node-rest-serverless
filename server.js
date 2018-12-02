const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

// Parse - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Parse - application/json
app.use(bodyParser.json())

// Import routes
var routes = require('./routes.js');
routes(app);

// Listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});