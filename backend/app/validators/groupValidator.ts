/**
 * Created by marcelboes on 04.06.17.
 */
import { Request } from "express"
import { BaseValidator } from "./baseValidator";
const groupModel = require("../models/groupModel");

export class GroupValidator extends BaseValidator {
    public static validateGroupSchema(req: Request): any {
        if (typeof req.body === "object") {
            if (typeof req.body.name !== "undefined") {
                const group = new groupModel({
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
