/**
 * Created by marcelboes on 04.06.17.
 */
import { Request } from "express"
import { BaseValidator } from "./baseValidator";
const groupModel = require("../models/groupModel");


export class SecurityNoteValidator extends BaseValidator {
    static validateSecurityNoteSchema(req: Request): any {
        if (typeof req.body === "object") {
            if (typeof req.body["name"] !== "undefined" && typeof req.body["owner"] !== "undefined") {
                let group = new groupModel({
                    name: this.escapeHTML(req.body["name"]),
                    owner: this.escapeHTML(req.body["owner"])
                });
                if (typeof req.body["count"] !== "undefined")
                    group.count = req.body["count"];
                return group;
            } else
                return { "error" : "There is no security note name or owner property in the request!" };
        } else
            return { "error" : "The request was no object!" };
    }
}