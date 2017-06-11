/**
 * Created by marcelboes on 05.06.17.
 */
import { Request } from "express";
import { BaseValidator } from "./baseValidator";
const userModel = require("../models/userModel");

export class UserValidator extends BaseValidator {
    public static validateUserSchema(req: Request): any {
        if (typeof req.body !== "object") {
            return {error: "The request was no object!"};
        }
        if (typeof req.body.username === "undefined" || typeof req.body.email === "undefined"
            || typeof req.body.password === "undefined" || typeof req.body.publicKey === "undefined") {
            return {error: "There fields username, email, password and publicKey are required."};
        }
        const user = new userModel({
            email: this.escapeHTML(req.body.email),
            username: this.escapeHTML(req.body.username),
        });
        if (typeof req.body.password !== "undefined") {
            user.password = req.body.password;
        }
        if (typeof req.body.publicKey !== "undefined") {
            user.publicKey = req.body.publicKey;
        }
        return user;
    }
}
