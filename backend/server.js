/**
 * Created by marcelboes on 19.05.17.
 */

const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(config.db);
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");

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
app.use("/api", groupRoute);
app.use("/api", securityNoteRoute);

app.listen(config.port);

module.exports = app;