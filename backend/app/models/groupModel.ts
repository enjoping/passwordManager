/**
 * Created by marcelboes on 19.05.17.
 */

import { model, Schema } from "mongoose";

/**
 * Group schema for MongoDB
 */
const GroupSchema = new Schema({
    name: { type: String, required: true},
    owner: { type: String, required: true},
    count: Number
});

module.exports = model("Group", GroupSchema);
