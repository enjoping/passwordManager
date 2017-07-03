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
    public static validateUserSchema(req: Request, roleId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof req.body !== "object") {
                reject({ error: "The request was no object!" });
            }
            if (typeof req.body.username === "undefined" || typeof req.body.email === "undefined"
                || typeof req.body.password === "undefined" || typeof req.body.publicKey === "undefined") {
                reject({ error: "The fields username, email, password and publicKey are required." });
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

    /**
     * This method checks the given request on validation for create a user and returns a promise.
     * @param req
     * @param roleId
     * @returns {Promise<T>}
     */
    public static validateCreateUser(req: Request, roleId: number = 2): Promise<any> {
        return new Promise((resolve, reject) => {
            UserValidator.validateUserSchema(req, roleId)
                .then(user => {
                    userModel.findOne({ email: user.email})
                        .then(registeredUser => {
                            if (registeredUser != null) {
                                reject({ error: "Email address is already in the system registered!" });
                            } else {
                                resolve(user);
                            }
                        })
                        .catch(() => {
                            reject({ error: "Unknown error occurred!" });
                        });
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    /**
     * This method checks the given request on validation for update a user and returns a promise.
     * @param req
     * @param paramsId
     * @param roleId
     * @returns {Promise<T>}
     */
    public static validateUpdateUser(req: Request, paramsId: number, roleId: number = 2): Promise<any> {
        return new Promise((resolve, reject) => {
            UserValidator.validateUserSchema(req, roleId)
                .then(user => {
                    userModel.findOne({username: user.username})
                        .then(registeredUsername => {
                            if (registeredUsername != null && registeredUsername._id != paramsId) {
                                reject({ error: "Username is already in the system registered!" });
                            }
                            else {
                                userModel.findOne({ email: user.email})
                                    .then(registeredUserEmail => {
                                        if (registeredUserEmail != null && registeredUserEmail._id != paramsId) {
                                            reject({ error: "Email address is already in the system registered!" });
                                        } else {
                                            resolve(user);
                                        }
                                    })
                                    .catch(() => {
                                        reject({ error: "Unknown error occurred!" });
                                    });
                            }
                        })
                        .catch(() => {
                            reject({ error: "Unknown error occurred!" });
                        });
                })
                .catch(err => {
                    reject(err);
                })
        });
    }
}
