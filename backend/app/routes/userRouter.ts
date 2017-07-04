/**
 * Created by marcelboes on 05.06.17.
 */
import { NextFunction, Request, Response } from "express";
import { BaseRouter } from "./baseRouter";
import { UserValidator } from "../validators/userValidator";
import { InviteValidator } from "../validators/inviteValidator";

const userModel = require("./../models/userModel");

export class UserRouter extends BaseRouter {

    constructor() {
        super();
        this.init();
    }

    /**
     * Override the method from the super class BaseRouter to implement specific middleware.
     */
    protected setRoutes() {
        this.router.route(this.basePath + "/")
            .get(this.authenticate, this.list)
            .post(this.create);

        this.router.route(this.basePath + "/:id")
            .get(this.get)
            .patch(this.authenticate, UserRouter.shouldUserAccess, this.update)
            .delete(this.authenticate, UserRouter.shouldUserAccess, this.erase);

        this.router.route(this.basePath + "/install")
            .post(this.install);
    }

    /**
     * This method checks, if the current user are allowed to access the admin functionality.
     * @param req
     * @param res
     * @param next
     */
    public static shouldUserAccess(req: Request, res: Response, next: NextFunction): void {
        if (req.user.roleId == 1)
            next();
        else {
            res.status(401);
            res.send({ error: "User is not authorized to do that!" })
        }
    }

    /**
     * POST /user/install route to create a new admin user.
     * This method will be called from our install script and create an admin user, if the current user model is empty.
     * Otherwise it returns status code 403.
     * @param req
     * @param res
     */
    private install(req: Request, res: Response): void {
        userModel.find()
            .then(users => {
                if (users.length == 0) {
                    UserValidator.validateCreateUser(req, 1)
                        .then(user => {
                            userModel.register(user, req.body.password, (err, account) => {
                                if (err) {
                                    res.status(400);
                                    res.json({ error: err.message });
                                    return;
                                }
                                const savedUser = {
                                    __v: account.__v,
                                    _id: account._id,
                                    username: account.username,
                                };
                                res.json(savedUser);
                            });
                        })
                        .catch(err => {
                            res.status(400);
                            res.json(err);
                        });
                } else {
                    res.status(403);
                    res.send({ error: "The install script was already executed! No admin user was created!" });
                }
            })
            .catch(() => {
                res.sendStatus(500);
            });
    }

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
            .catch(() => {
                res.sendStatus(500);
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
                res.send({ error: "There is no user with the given ID in the database!" });
            });
    }

    /**
     * POST /user route to create a new user.
     * @param req
     * @param res
     */
    protected create(req: Request, res: Response): void {
        UserValidator.validateCreateUser(req)
            .then(user => {
                InviteValidator.validateInviteStatus(req)
                    .then(invite => {
                        userModel.register(user, req.body.password, (err, account) => {
                            if (err) {
                                res.status(400);
                                res.json({ error: err.message });
                                return;
                            }
                            invite.remove({}, () => {
                                console.log("Successfully removed invite with email address " + invite.email);
                            });
                            const savedUser = {
                                __v: account.__v,
                                _id: account._id,
                                username: account.username,
                            };
                            res.json(savedUser);
                        });
                    })
                    .catch(err => {
                        res.status(400);
                        res.send(err);
                    });
            })
            .catch(err => {
                res.status(400);
                res.json(err);
            });
    }

    /**
     * PATCH /user/:id route to update a single user by id.
     * @param req
     * @param res
     */
    protected update(req: Request, res: Response): void {
        UserValidator.validateUpdateUser(req, req.params.id)
            .then(() => {
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
            })
            .catch(err => {
                res.status(400);
                res.send(err);
            });
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
                res.send({ error : "There is no user with the given ID in the database!" });
            });
    }
}
