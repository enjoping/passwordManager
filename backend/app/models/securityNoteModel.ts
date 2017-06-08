/**
 * Created by marcelboes on 19.05.17.
 */

import { model, Schema } from "mongoose";

/**
 * SecurityNote schema for MongoDB
 */
const SecurityNoteSchema = new Schema({
    name: { type: String, required: true},
    owner: { type: String, required: true},
    groupId: Number,
    fields: [
        {
            name: String,
            type: String,
            value: String
        }
    ]
});

module.exports = model("SecurityNote", SecurityNoteSchema);
