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
 * User schema for MongoDB
 */
const UserSchema = new Schema({
    email: { type: String, required: true},
    password: String,
    publicKey: { type: String, required: true},
    username: {type: String, required: true},
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.plugin(autoIncrement.plugin, "User");
module.exports = connection.model("User", UserSchema);
