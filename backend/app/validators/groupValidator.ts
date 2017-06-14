/**
 * Created by marcelboes on 04.06.17.
 */
import * as crypto from "crypto";
import { Request } from "express";
import { BaseValidator } from "./baseValidator";
const groupModel = require("../models/groupModel");

export class GroupValidator extends BaseValidator {
    public static validateGroupSchema(req: Request): any {
        if (typeof req.body === "object") {
            if (typeof req.body.name !== "undefined") {
                const groupPass = crypto.randomBytes(64).toString("base64");
                const group = new groupModel({
                    members: [{id: req.user.id, password: groupPass}],
                    name: this.escapeHTML(req.body.name),
                    owner: req.user.id,
                });
                if (typeof req.body.count !== "undefined") {
                    group.count = req.body.count;
                }
                return group;
            } else {
                return {error: "There is no group name or owner property in the request!"};
            }
        } else {
            return {error: "The request was no object!"};
        }
    }
}
