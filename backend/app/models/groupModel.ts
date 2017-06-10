/**
 * Created by marcelboes on 19.05.17.
 */

import { Schema } from "mongoose";
import * as autoIncrement from "mongoose-auto-increment";
import { Database } from "./database";

const database = Database.getInstance();
const connection = database.getConnection();

/**
 * Group schema for MongoDB
 */
const GroupSchema = new Schema({
    count: Number,
    name: { type: String, required: true},
    owner: { type: String, required: true},
});

GroupSchema.plugin(autoIncrement.plugin, "Group");
module.exports = connection.model("Group", GroupSchema);
