/**
 * Created by marcelboes on 19.05.17.
 */

import * as config from "config";

import { Server } from "./app/models/server";

import { GroupRouter } from "./app/routes/groupRouter";
import { LoginRouter } from "./app/routes/loginRouter";
import { SecurityNoteRouter } from "./app/routes/securityNoteRouter";
import { UserRouter } from "./app/routes/userRouter";

const server = new Server(config.get("port"));

const groupRouter = new GroupRouter();
const securityNoteRouter = new SecurityNoteRouter();
const userRouter = new UserRouter();
server.registerRouter("/api/1.0/group", groupRouter.getRouter());
server.registerRouter("/api/1.0/group", securityNoteRouter.getRouter());
server.registerRouter("/api/1.0/user", userRouter.getRouter());
server.registerRouter("/api/1.0/login", new LoginRouter().getRouter());

server.start();

module.exports = server.getApp();
