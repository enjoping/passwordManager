/**
 * Created by marcelboes on 19.05.17.
 */

const express = require("express");
const router = express.Router();

const getGroups = (req, res) => {

};

const getGroup = (req, res) => {

};

const postGroup = (req, res) => {

};

const patchGroup = (req, res) => {

};

const deleteGroup = (req, res) => {

};

router.route("/")
    .get(getGroups)
    .post(postGroup);

router.route("/:id")
    .get(getGroup)
    .delete(deleteGroup)
    .patch(patchGroup);

module.exports = router;
