/**
 * Created by marcelboes on 19.05.17.
 */

import { Schema } from "mongoose";
import * as autoIncrement from "mongoose-auto-increment";
import * as passportLocalMongoose from "passport-local-mongoose";
import { Database } from "./database";

const database = Database.getInstance();
const connection = database.getConnection();

/**
 * Invite schema for MongoDB
 */
const InviteSchema = new Schema({
    email: { type: String, required: true },
    inviteToken: { type: String, required: true },
    creationDate: { type: Date, required: true }
});

InviteSchema.plugin(autoIncrement.plugin, "Invite");
module.exports = connection.model("Invite", InviteSchema);
