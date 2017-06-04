/**
 * Created by marcelboes on 19.05.17.
 */

import { model, Schema } from "mongoose";

/**
 * SecurityNote schema for MongoDB
 */
const UserSchema = new Schema({
    email: { type: String, required: true},
    name: { type: String, required: true},
    password: String,
    publicKEy: String
});

/**
 * This method triggers for each save in the database.
 */
UserSchema.pre("save", function(this, next) {
    this.creationDate = Date.now();
    next();
});

module.exports = model("UserNote", UserSchema);
