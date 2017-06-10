/**
 * Created by marcelboes on 05.06.17.
 */
import { Request } from "express"
import { BaseValidator } from "./baseValidator";
const userModel = require("../models/userModel");


export class UserValidator extends BaseValidator {
    static validateUserSchema(req: Request): any {
        if (typeof req.body === "object") {
            if (typeof req.body["name"] !== "undefined" && typeof req.body["email"] !== "undefined") {
                let user = new userModel({
                    email: this.escapeHTML(req.body["email"]),
                    name: this.escapeHTML(req.body["name"])
                });
                if (typeof req.body["password"] !== "undefined")
                    user.password = req.body["password"];
                if (typeof req.body["publicKey"] !== "undefined")
                    user.publicKey = req.body["publicKey"];
                return user;
            } else
                return { "error" : "There is no user name or email property in the request!" };
        } else
            return { "error" : "The request was no object!" };
    }
}
