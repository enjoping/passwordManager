/**
 * Created by marcelboes on 19.05.17.
 */

import * as config from "config";
// import * as mongoose from "mongoose";

import {Server} from "./app/models/server";

import { GroupRouter } from "./app/routes/groupRouter";
import { SecurityNoteRouter } from "./app/routes/securityNoteRouter";

const server = new Server(config.get("port"));

const groupRouter = new GroupRouter();
const securityNoteRouter = new SecurityNoteRouter();
server.registerRouter("/api/1.0/group", groupRouter.getRouter());
server.registerRouter("/api/1.0/security-note", securityNoteRouter.getRouter());

// TODO move these lines into the database class
// mongoose.connect(config.get("db"));
// mongoose.Promise = global.Promise;

server.start();

module.exports = server.getApp();
