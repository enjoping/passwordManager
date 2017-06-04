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
    fields: [
        {
            name: String,
            type: String,
            value: String
        }
    ]
});

/**
 * This method triggers for each save in the database.
 */
SecurityNoteSchema.pre("save", function(this, next) {
    this.creationDate = Date.now();
    next();
});

module.exports = model("SecurityNote", SecurityNoteSchema);
