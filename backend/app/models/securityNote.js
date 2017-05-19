/**
 * Created by marcelboes on 19.05.17.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * SecurityNote schema for MongoDB
 */
const SecurityNoteSchema = new Schema({

});

/**
 * This method triggers for each save in the database.
 */
SecurityNoteSchema.pre("save", next => {
    this.creationDate = Date.now();
    next();
});

module.exports = mongoose.model("SecurityNote", SecurityNoteSchema);