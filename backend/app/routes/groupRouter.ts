/**
 * Created by Joe Pietler on 31.05.17.
 */

import { NextFunction, Request, Response } from "express";
import { BaseRouter } from "./baseRouter";
import { GroupValidator } from "../validators/groupValidator";

const groupModel = require("../models/groupModel");
const securityModel = require("../models/securityNoteModel");

export class GroupRouter extends BaseRouter {

    constructor() {
        super();
        this.init();
    }

    /**
     * Override the method from the super class BaseRouter to implement specific middleware.
     */
    protected setRoutes(): void {
        this.router.route(this.basePath + "/")
            .get(this.authenticate, this.list)
            .post(this.authenticate, this.create);

        this.router.route(this.basePath + "/:id")
            .get(this.authenticate, this.shouldUserAccessGroup, this.get)
            .patch(this.authenticate, this.shouldUserEditGroup, this.update)
            .delete(this.authenticate, this.shouldUserEditGroup, this.erase);
    }

    /**
     * This method checks, if the current user are allowed to access the requested group.
     * @param req
     * @param res
     * @param next
     */
    private shouldUserAccessGroup(req: Request, res: Response, next: NextFunction): void {
        groupModel.findById(req.params.id)
            .then(group => {
                let isMember: boolean = false;
                for (let memberItem of group.members) {
                    if (memberItem.id == req.user.id) {
                        isMember = true;
                        next();
                    }
                }
                if (!isMember) {
                    res.status(401);
                    res.send({ error: "User have no permission to access this group!" });
                }
            })
            .catch(() => {
                next();
            });
    }

    /**
     * This method checks, if the current user are allowed to edit the requested group.
     * @param req
     * @param res
     * @param next
     */
    private shouldUserEditGroup(req: Request, res: Response, next: NextFunction): void {
        groupModel.findById(req.params.id)
            .then(group => {
                if (group.owner == req.user.id)
                    next();
                else {
                    res.status(401);
                    res.send({ error: "User have no permission to edit this group!" });
                }
            })
            .catch(() => {
                next();
            });
    }

    /**
     * GET /group route to retrieve all stored groups.
     * @param req
     * @param res
     */
    protected list(req: Request, res: Response): void {
        groupModel.find({"members.id": req.user.id})
            .then(groups => {
                res.status(200);
                res.json(groups);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    }

    /**
     * GET /group/:id route to retrieve a single group by id.
     * @param req
     * @param res
     */
    protected get(req: Request, res: Response): void {
        groupModel.findById(req.params.id)
            .then(group => {
                res.status(200);
                res.json(group);
            })
            .catch(() => {
                res.status(400);
                res.send({ "error": "There is no group with the given ID in the database!" });
            });
    }

    /**
     * POST /group route to create a new group.
     * @param req
     * @param res
     */
    protected create(req: Request, res: Response): void {
        GroupValidator.validateGroupSchema(req)
            .then(newGroup => {
                newGroup.save()
                    .then((group) => {
                        res.status(200);
                        res.json(group);
                    })
                    .catch(() => {
                        res.sendStatus(500);
                    });
            })
            .catch(err => {
                res.status(400);
                res.send(err);
            });
    }

    /**
     * PATCH /group/:id route to update a single group by id.
     * @param req
     * @param res
     */
    protected update(req: Request, res: Response): void {
        GroupValidator.validateGroupSchema(req).then(() => {
            groupModel.findById(req.params.id)
                .then((group) => {
                    Object.assign(group, req.body).save()
                        .then((savedGroup) => {
                            res.status(200);
                            res.json(savedGroup);
                        })
                        .catch((err) => {
                            res.status(400);
                            res.send(err);
                        });
                })
                .catch((err) => {
                    res.status(400);
                    res.send(err);
                });
        }).catch((err) => {
            res.status(400);
            res.send(err);
        });
    }

    /**
     * DELETE /group/:id route to delete a single group by id.
     * @param req
     * @param res
     */
    protected erase(req: Request, res: Response): void {
        groupModel.findByIdAndRemove(req.params.id)
            .then(() => {
                res.sendStatus(204);
                securityModel.find({groupId: req.params.id})
                    .then(notes => {
                        for (let note of notes) {
                            securityModel.remove(note, err => {
                                if (err != null)
                                    console.log(err);
                                console.log(note + " was deleted successful.");
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(() => {
                res.status(400);
                res.send({ "error" : "There is no group with the given ID in the database!" });
            });
    }
}
