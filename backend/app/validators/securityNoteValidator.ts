/**
 * Created by marcelboes on 04.06.17.
 */
import { Request } from "express"
import { BaseValidator } from "./baseValidator";
const securityNoteModel = require("../models/securityNoteModel");


export class SecurityNoteValidator extends BaseValidator {
    static validateSecurityNoteSchema(req: Request): any {
        if (typeof req.body === "object") {
            if (typeof req.body["name"] !== "undefined"
                    && typeof req.body["owner"] !== "undefined") {
                let note = new securityNoteModel({
                    name: this.escapeHTML(req.body["name"]),
                    owner: this.escapeHTML(req.body["owner"]),
                    groupId: req.params.group
                });
                if (typeof req.body["fields"] !== "undefined")
                    note.fields = req.body["fields"];
                return note;
            } else
                return { "error" : "There is no security note name, owner, or groupId property in the request!" };
        } else
            return { "error" : "The request was no object!" };
    }
}