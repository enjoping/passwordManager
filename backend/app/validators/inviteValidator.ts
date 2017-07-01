/**
 * Created by marcelboes on 05.06.17.
 */
import { Request } from "express";
import { BaseValidator } from "./baseValidator";
import * as crypto from "crypto";
const inviteModel = require("../models/inviteModel");

export class InviteValidator extends BaseValidator {
    public static validateInviteSchema(req: Request): any {
        if (typeof req.body !== "object") {
            return { error: "The request was no object!" };
        }
        if (typeof req.body.email === "undefined") {
            return { error: "The field email is required." };
        }
        const secret = "1nv1t3t0k3n";
        const encryptedInviteToken = crypto.createHmac("sha256", secret)
            .update(crypto.randomBytes(64).toString("utf8"))
            .digest("hex");
        return new inviteModel({
            email: this.escapeHTML(req.body.email),
            inviteToken: encryptedInviteToken,
            creationDate: Date.now()
        });
    }
}
