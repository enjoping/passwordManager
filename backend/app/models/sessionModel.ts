/**
 * Created by Radek Suski on 10.06.17.
 */

import {model, Schema} from "mongoose";

/**
 * Session schema for MongoDB
 */
const SessionSchema = new Schema({
    id: {type: String, required: true},
    token: {type: String, required: true},
});

module.exports = model("Session", SessionSchema);
