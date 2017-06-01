/**
 * Created by marcelboes on 19.05.17.
 */

import * as config from "config";

import { Database } from "./app/models/database";
import { Server } from "./app/models/server";

import { GroupRouter } from "./app/routes/groupRouter";
import { SecurityNoteRouter } from "./app/routes/securityNoteRouter";

const server = new Server(config.get("port"));

const database = Database.getInstance();
database.connect(config.get("db"));

const groupRouter = new GroupRouter();
const securityNoteRouter = new SecurityNoteRouter();
server.registerRouter("/api/1.0/group", groupRouter.getRouter());
server.registerRouter("/api/1.0/security-note", securityNoteRouter.getRouter());

server.start();

module.exports = server.getApp();
