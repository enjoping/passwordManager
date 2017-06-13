/**
 * Created by marcelboes on 19.05.17.
 */

import { Schema } from "mongoose";
import * as autoIncrement from "mongoose-auto-increment";
import { Database } from "./database";

const database = Database.getInstance();
const connection = database.getConnection();

/**
 * SecurityNote schema for MongoDB
 */
const SecurityNoteSchema = new Schema({
    name: { type: String, required: true },
    owner: { type: Number, required: true },
    groupId: {type: Number, required: true },
    fields: [
        {
            name: String,
            type: String,
            value: String
        }
    ]
});

SecurityNoteSchema.plugin(autoIncrement.plugin, "SecurityNote");
module.exports = connection.model("SecurityNote", SecurityNoteSchema);
