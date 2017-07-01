/**
 * Created by marcelboes on 05.06.17.
 */
import { Request, Response } from "express";
const inviteModel = require("./../models/inviteModel");
const userModel = require("./../models/userModel");

import { BaseRouter } from "./baseRouter";
import { InviteValidator } from "../validators/inviteValidator";

export class InviteRouter extends BaseRouter {

    constructor() {
        super();
        this.init();
    }

    protected setRoutes() {
        this.router.route(this.basePath + "/")
            .get(this.authenticate, this.list)
            .post(this.create);

        this.router.route(this.basePath + "/:id")
            .get(this.get)
            .patch(this.authenticate, this.update)
            .delete(this.authenticate, this.erase);
    }

    /**
     * GET /invite route to retrieve all stored invites.
     * @param req
     * @param res
     */
    protected list(req: Request, res: Response): void {
        inviteModel.find()
            .then(invites => {
                res.status(200);
                res.json(invites);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    }

    /**
     * GET /invite/:id route to retrieve a single invite by invite token.
     * @param req
     * @param res
     */
    protected get(req: Request, res: Response): void {
        inviteModel.findOne({ inviteToken: req.params.id })
            .then(invite => {
                if (invite != null) {
                    if (Date.now() - 60000 * 60  < invite.creationDate) {
                        res.status(200);
                        res.json(invite);
                    } else {
                        res.status(403);
                        res.send({ error: "Invite time expired!" });
                    }
                } else {
                    res.status(400);
                    res.send({ error: "There is no invite with the given invite token in the database!" });
                }
            })
            .catch(() => {
                res.sendStatus(500);
            })
    }

    /**
     * POST /invite route to create a new invite.
     * @param req
     * @param res
     */
    protected create(req: Request, res: Response): void {
        InviteValidator.validateInviteSchema(req)
            .then(invite => {
                inviteModel.findOne({ email: req.body.email })
                    .then(inviteResult => {
                        if (inviteResult != null) {
                            res.status(400);
                            res.send({ error: "Email is already on the invite list!" });
                        } else {
                            userModel.findOne({ email: req.body.email })
                                .then(user => {
                                    if (user != null) {
                                        res.status(400);
                                        res.send({ error: "Email is already in the system!" });
                                    } else {
                                        invite.save()
                                            .then(invite => {
                                                res.status(200);
                                                res.json(invite);
                                            })
                                            .catch(err => {
                                                res.status(400);
                                                res.send(err);
                                            })
                                    }
                                });
                        }
                    })
                    .catch(() => {
                        res.sendStatus(500);
                    });
            })
            .catch(err => {
                res.status(400);
                res.json(err);
            });
    }

    /**
     * DELETE /invite/:id route to delete a single invite by id.
     * @param req
     * @param res
     */
    protected erase(req: Request, res: Response): void {
        inviteModel.findByIdAndRemove(req.params.id)
            .then(() => {
                res.sendStatus(204);
            })
            .catch(() => {
                res.status(400);
                res.send({ error : "There is no invite with the given ID in the database!" });
            });
    }
}
