/**
 * Created by marcelboes on 19.05.17.
 */

const express = require("express");
const router = express.Router();

const getSecurityNotes = (req, res) => {

};

const getSecurityNote = (req, res) => {

};

const postSecurityNote = (req, res) => {

};

const patchSecurityNote = (req, res) => {

};

const deleteSecurityNote = (req, res) => {

};

router.route("/")
    .get(getSecurityNotes)
    .post(postSecurityNote);

router.route("/:id")
    .get(getSecurityNote)
    .delete(deleteSecurityNote)
    .patch(patchSecurityNote);

module.exports = router;
