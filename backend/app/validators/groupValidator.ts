/**
 * Created by marcelboes on 04.06.17.
 */
import * as crypto from "crypto";
import { Request } from "express";
import { BaseValidator } from "./baseValidator";
const groupModel = require("../models/groupModel");

export class GroupValidator extends BaseValidator {
    /**
     * This method checks the given request on validation for the group schema and returns a promise.
     * @param req
     * @returns {Promise<T>}
     */
    public static validateGroupSchema(req: Request): Promise<any> {
        return new Promise((fulfill, reject) => {
            if (typeof req.body === "object") {
                if (typeof req.body.name !== "undefined") {
                    const group = new groupModel({
                        members: [{id: req.user.id, password: req.body.password}],
                        name: this.escapeHTML(req.body.name),
                        owner: req.user.id,
                    });
                    if (typeof req.body.count !== "undefined") {
                        group.count = req.body.count;
                    }
                    fulfill(group);
                } else {
                    reject({ error: "There is no group name or owner property in the request!" });
                }
            } else {
                reject({ error: "The request was no object!" });
            }
        });
    }
}
