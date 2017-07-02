/**
 * Created by marcelboes on 04.06.17.
 */
import { Request } from "express"
import { BaseValidator } from "./baseValidator";
const securityNoteModel = require("../models/securityNoteModel");

export class SecurityNoteValidator extends BaseValidator {
    /**
     * This method checks the given request on validation for the security note schema and returns a promise.
     * @param req
     * @returns {Promise<T>}
     */
    public static validateSecurityNoteSchema(req: Request): Promise<any> {
        return new Promise((resolve, reject) => {
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
                    resolve(note);
                } else {
                    reject({ error: "There is no security note name in the request!" });
                }
            } else {
                reject({ error: "The request was no object!" });
            }
        });
    }
}
