/**
 * Created by marcelboes on 19.05.17.
 */

import {bcrypt} from "bcrypt";
import {model, Schema} from "mongoose";
import * as passportLocalMongoose from "passport-local-mongoose";

/**
 * User schema for MongoDB
 */
const UserSchema = new Schema({
    email: String,
    password: String,
    publicKey: String,
    username: {type: String, required: true},
});

UserSchema.plugin(passportLocalMongoose);

module.exports = model("User", UserSchema);
