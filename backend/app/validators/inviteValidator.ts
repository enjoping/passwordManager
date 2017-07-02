/**
 * Created by marcelboes on 05.06.17.
 */
import { Request } from "express";
import { BaseValidator } from "./baseValidator";
import * as crypto from "crypto";
const inviteModel = require("../models/inviteModel");

export class InviteValidator extends BaseValidator {
    /**
     * This method checks the given request on validation for the invite schema and returns a promise.
     * @param req
     * @returns {Promise<T>}
     */
    public static validateInviteSchema(req: Request): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof req.body !== "object") {
                reject({ error: "The request was no object!" });
            }
            if (typeof req.body.email === "undefined") {
                reject({ error: "The field email is required." });
            }
            const secret = "1nv1t3t0k3n";
            const encryptedInviteToken = crypto.createHmac("sha256", secret)
                .update(crypto.randomBytes(64).toString("utf8"))
                .digest("hex");
            resolve(new inviteModel({
                email: this.escapeHTML(req.body.email),
                inviteToken: encryptedInviteToken,
                creationDate: Date.now()
            }));
        });
    }

    /**
     * This method checks the given request on validation for a valid invite and returns a promise.
     * @param req
     * @returns {Promise<T>}
     */
    public static validateInviteStatus(req: Request): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof req.body !== "object") {
                reject({ error: "The request was no object!" });
            }
            if (typeof req.body.inviteToken === "undefined") {
                reject({ error: "There is no invite token in the request!" });
            }
            inviteModel.findOne({inviteToken: req.body.inviteToken})
                .then(invite => {
                    if (invite == null) {
                        reject({ error: "There is no invite with the given token in the database! User creation aborted!" })
                    }
                    if (Date.now() - 60000 * 60  < invite.creationDate) {
                        resolve(invite);
                    } else {
                        reject({ error: "Invite time expired!" });
                    }
                })
                .catch(() => {
                    reject({ error: "Unknown error occurred." })
                });
        });
    }
}
