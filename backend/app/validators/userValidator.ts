/**
 * Created by marcelboes on 05.06.17.
 */
import { Request } from "express";
import { BaseValidator } from "./baseValidator";

const userModel = require("../models/userModel");

export class UserValidator extends BaseValidator {
    /**
     * This method checks the given request on validation for the user schema and returns a promise.
     * @param req
     * @param roleId
     * @returns {Promise<T>}
     */
    public static validateUserSchema(req: Request, roleId: number = 2): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof req.body !== "object") {
                reject({ error: "The request was no object!" });
            }
            if (typeof req.body.username === "undefined" || typeof req.body.email === "undefined"
                || typeof req.body.password === "undefined" || typeof req.body.publicKey === "undefined") {
                reject({ error: "There fields username, email, password and publicKey are required." });
            }
            const user = new userModel({
                email: this.escapeHTML(req.body.email),
                username: this.escapeHTML(req.body.username),
                roleId: roleId
            });
            if (typeof req.body.publicKey !== "undefined") {
                user.publicKey = req.body.publicKey;
            }
            resolve(user);
        });
    }
}
