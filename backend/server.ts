/**
 * Created by marcelboes on 19.05.17.
 */

import * as bodyParser from "body-parser";
import * as config from "config";
import * as express from "express";
import * as mongoose from "mongoose";
import * as path from "path";

const app: express.Application = express();
mongoose.connect(config.get("db"));
mongoose.Promise = global.Promise;

/**
 * Body parser Options
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * Defining routers.
 */
import * as groupRoute from "./app/routes/group";
import * as securityNoteRoute from "./app/routes/securityNote";
app.use("/api/1.0/group", groupRoute);
app.use("/api/1.0/security-note", securityNoteRoute);

/**
 * Deliver the angular frontend
 */
app.use("/", express.static(__dirname + "/dist"));
app.use((req: express.Request, res: express.Response) => {
    res.sendFile("index.html", { root: path.resolve(__dirname + "/dist") });
});

app.listen(config.get("port"));

module.exports = app;
