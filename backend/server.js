/**
 * Created by marcelboes on 19.05.17.
 */

const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(config.get('db'));
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const path = require('path');

/**
 * Body parser Options
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * Defining routers.
 */
const groupRoute = require("./app/routes/group");
const securityNoteRoute = require("./app/routes/securityNote");
app.use("/api/1.0/group", groupRoute);
app.use("/api/1.0/security-note", securityNoteRoute);

/**
 * Deliver the angular frontend
 */
app.use('/', express.static(__dirname + '/dist'));
app.use(function(req, res){
    res.sendFile('index.html', { root: path.resolve(__dirname + '/dist') });
});

app.listen(config.get('port'));

module.exports = app;
