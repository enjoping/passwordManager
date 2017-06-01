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
    noteId: Number
});

/**
 * This method triggers for each save in the database.
 */
GroupSchema.pre("save", (next) => {
    this.creationDate = Date.now();
    next();
});

module.exports = model("Group", GroupSchema);
