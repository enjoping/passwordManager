/**
 * Created by marcelboes on 19.05.17.
 */

import {bcrypt} from "bcrypt";
import {model, Schema} from "mongoose";

/**
 * User schema for MongoDB
 */
const UserSchema = new Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    password: {
        required: true, set: (pass) => {
            const bcrypt = require("bcrypt");
            return bcrypt.hashSync(pass, 10);
        }, type: String,
    },
    publicKey: String
});

module.exports = model("User", UserSchema);
