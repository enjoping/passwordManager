/**
 * Created by marcelboes on 05.06.17.
 */
import { Request, Response } from "express";
const userModel = require("./../models/userModel");

import { BaseRouter } from "./baseRouter";
import { UserValidator } from "../validators/userValidator";

export class UserRouter extends BaseRouter {

    /**
     * GET /user route to retrieve all stored users.
     * @param req
     * @param res
     */
    protected list(req: Request, res: Response): void {
        userModel.find()
            .then(users => {
                res.status(200);
                res.json(users);
            })
            .catch(err => {
                res.status(500);
                res.send(err);
            });
    }

    /**
     * GET /user/:id route to retrieve a single user by id.
     * @param req
     * @param res
     */
    protected get(req: Request, res: Response): void {
        userModel.findById(req.params.id)
            .then(user => {
                res.status(200);
                res.json(user);
            })
            .catch(() => {
                res.status(400);
                res.send({ "error": "There is no user with the given ID in the database!" });
            });
    }

    /**
     * POST /user route to create a new user.
     * @param req
     * @param res
     */
    protected create(req: Request, res: Response): void {
        const newUser = UserValidator.validateUserSchema(req);
        if (!newUser.hasOwnProperty("error")) {
            newUser.save()
                .then(user => {
                    res.status(200);
                    res.json(user);
                })
                .catch(err => {
                    res.status(500);
                    res.send(err);
                })
        } else {
            res.status(400);
            res.send(newUser);
        }
    }

    /**
     * PATCH /user/:id route to update a single user by id.
     * @param req
     * @param res
     */
    protected update(req: Request, res: Response): void {
        const user = UserValidator.validateUserSchema(req);
        if (typeof user["errors"] === "undefined") {
            userModel.findById(req.params.id)
                .then(user => {
                    Object.assign(user, req.body).save()
                        .then(user => {
                            res.status(200);
                            res.json(user);
                        })
                        .catch(err => {
                            res.status(400);
                            res.send(err);
                        })
                })
                .catch(err => {
                    res.status(400);
                    res.send(err);
                });
        } else {
            res.status(400);
            res.send(user);
        }
    }

    /**
     * DELETE /user/:id route to delete a single user by id.
     * @param req
     * @param res
     */
    protected erase(req: Request, res: Response): void {
        userModel.findByIdAndRemove(req.params.id)
            .then(() => {
                res.sendStatus(204);
            })
            .catch(() => {
                res.status(400);
                res.send({ "error" : "There is no user with the given ID in the database!" });
            });
    }
}
