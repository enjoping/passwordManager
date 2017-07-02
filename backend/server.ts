/**
 * Created by marcelboes on 19.05.17.
 */

import * as config from "config";

import { Server } from "./app/models/server";

import { GroupMemberRouter } from "./app/routes/groupMemberRouter";
import { GroupRouter } from "./app/routes/groupRouter";
import { InviteRouter } from "./app/routes/inviteRouter";
import { LoginRouter } from "./app/routes/loginRouter";
import { SecurityNoteRouter } from "./app/routes/securityNoteRouter";
import { UserRouter } from "./app/routes/userRouter";

const server = new Server(config.get("port"));

/**
 * Register all routers here to make the rest interface available from outside.
 */
server.registerRouter("/api/1.0/group", new GroupRouter().getRouter());
server.registerRouter("/api/1.0/group", new SecurityNoteRouter().getRouter());
server.registerRouter("/api/1.0/group", new GroupMemberRouter().getRouter());
server.registerRouter("/api/1.0/user", new UserRouter().getRouter());
server.registerRouter("/api/1.0/login", new LoginRouter().getRouter());
server.registerRouter("/api/1.0/invite", new InviteRouter().getRouter());

server.start();

module.exports = server.getApp();
