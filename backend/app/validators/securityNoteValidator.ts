/**
 * Created by marcelboes on 04.06.17.
 */
import { Request } from "express"
import { BaseValidator } from "./baseValidator";
const securityNoteModel = require("../models/securityNoteModel");

export class SecurityNoteValidator extends BaseValidator {
    public static validateSecurityNoteSchema(req: Request): any {
        if (typeof req.body === "object") {
            if (typeof req.body.name !== "undefined") {
                const note = new securityNoteModel({
                    groupId: req.params.group,
                    name: this.escapeHTML(req.body.name),
                    owner: req.user.id,
                });
                if (typeof req.body.fields !== "undefined") {
                    note.fields = req.body.fields;
                }
                return note;
            } else {
                return {error: "There is no security note name in the request!"};
            }
        } else {
            return {error: "The request was no object!"};
        }
    }
}
