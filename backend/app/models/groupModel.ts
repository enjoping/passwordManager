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
    count: Number,
    creationDate: Date
});

/**
 * This method triggers for each save in the database.
 */
GroupSchema.pre("save", function(this, next) {
    this.creationDate = Date.now();
    next();
});

module.exports = model("Group", GroupSchema);
