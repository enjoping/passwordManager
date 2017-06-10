/**
 * Created by marcelboes on 19.05.17.
 */

import { Schema } from "mongoose";
import * as autoIncrement from "mongoose-auto-increment";
import { Database } from "./database";

const database = Database.getInstance();
const connection = database.getConnection();

/**
 * User schema for MongoDB
 */
const UserSchema = new Schema({
    email: { type: String, required: true},
    name: { type: String, required: true},
    password: String,
    publicKey: String
});

UserSchema.plugin(autoIncrement.plugin, "User");
module.exports = connection.model("User", UserSchema);
