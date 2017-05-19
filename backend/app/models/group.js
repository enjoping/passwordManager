/**
 * Created by marcelboes on 19.05.17.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Group schema for MongoDB
 */
const GroupSchema = new Schema({

});

/**
 * This method triggers for each save in the database.
 */
GroupSchema.pre("save", next => {
    this.creationDate = Date.now();
    next();
});

module.exports = mongoose.model("Group", GroupSchema);