/**
 * Created by marcelboes on 04.06.17.
 */
import { Request } from "express"
const groupModel = require("../models/groupModel");


export class GroupValidator {
    static escapeHTML(input: string): string {
        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/"/g, "&#039;");
    }

    static validateGroupSchema(req: Request) {
        if (typeof req.body === "object") {
            if (typeof req.body["name"] !== "undefined" && typeof req.body["owner"] !== "undefined") {
                return new groupModel({
                    name: this.escapeHTML(req.body["name"]),
                    owner: this.escapeHTML(req.body["owner"])
                });
            } else
                return { "error" : "There is no group name or owner in the request!" };
        } else
            return { "error" : "The request was no object!" };
    }
}