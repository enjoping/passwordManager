/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response, NextFunction } from "express";
import { BaseRouter } from "./baseRouter";
import { SecurityNoteValidator } from "../validators/securityNoteValidator";

const securityNoteModel = require("./../models/securityNoteModel");
const groupModel = require("./../models/groupModel");

export class SecurityNoteRouter extends BaseRouter {
    constructor() {
        super();
        this.basePath = "/:group/security-note";
        this.init();
    }

    /**
     * Override the method from the super class BaseRouter to implement specific middleware.
     */
    protected setRoutes(): void {
        this.router.route(this.basePath + "/")
            .get(this.authenticate, this.shouldUserAccessGroup, this.list)
            .post(this.authenticate, this.shouldUserAccessGroup, this.create);

        this.router.route(this.basePath + "/:id")
            .get(this.authenticate, this.shouldUserAccessGroup, this.get)
            .patch(this.authenticate, this.shouldUserEditNote, this.update)
            .delete(this.authenticate, this.shouldUserEditNote, this.erase);
    }

    /**
     * This method checks, if the current user are allowed to access the requested group.
     * @param req
     * @param res
     * @param next
     */
    private shouldUserAccessGroup(req: Request, res: Response, next: NextFunction): void {
        groupModel.findById(req.params.group)
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
                    res.send({ error: "User have no permission to do this!" });
                }
            })
            .catch(() => {
                res.status(400);
                res.send({ error: "There is no group with the given id to create or get a note!" });
            });
    }

    /**
     * This method checks, if the current user are allowed to edit the requested note.
     * @param req
     * @param res
     * @param next
     */
    private shouldUserEditNote(req: Request, res: Response, next: NextFunction): void {
        securityNoteModel.findById(req.params.id)
            .then(note => {
                if (note.owner == req.user.id)
                    next();
                else {
                    res.status(401);
                    res.send({ error: "User have no permission to edit this note!" });
                }
            })
            .catch(() => {
                next();
            });
    }


    /**
     * GET group/group-id/note route to retrieve all stored securityNotes with the given group id.
     * @param req
     * @param res
     */
    protected list(req: Request, res: Response): void {
        securityNoteModel.find({groupId: req.params.group})
            .then((securityNotes) => {
                res.status(200);
                res.json(securityNotes);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    }

    /**
     * GET group/group-id/note/:id route to retrieve a single securityNote by id.
     * @param req
     * @param res
     */
    protected get(req: Request, res: Response): void {
        securityNoteModel.findById(req.params.id)
            .then(securityNote => {
                res.status(200);
                res.json(securityNote);
            })
            .catch(() => {
                res.status(400);
                res.send({ "error": "There is no security note with the given ID in the database!" });
            });
    }

    /**
     * POST group/group-id/note route to create a new securityNote.
     * @param req
     * @param res
     */
    protected create(req: Request, res: Response): void {
        SecurityNoteValidator.validateSecurityNoteSchema(req)
            .then(newSecurityNote => {
                newSecurityNote.save()
                    .then(securityNote => {
                        res.status(200);
                        res.json(securityNote);
                    })
                    .catch(() => {
                        res.sendStatus(500);
                    })
            })
            .catch(err => {
                res.status(400);
                res.send(err);
            });
    }

    /**
     * PATCH group/group-id/note/:id route to update a single securityNote by id.
     * @param req
     * @param res
     */
    protected update(req: Request, res: Response): void {
        SecurityNoteValidator.validateSecurityNoteSchema(req)
            .then(securityNoteModel => {
                securityNoteModel.findById(req.params.id)
                    .then(securityNote => {
                        Object.assign(securityNote, req.body).save()
                            .then(securityNote => {
                                res.status(200);
                                res.json(securityNote);
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
     * DELETE group/group-id/note/:id route to delete a single securityNote by id.
     * @param req
     * @param res
     */
    protected erase(req: Request, res: Response): void {
        securityNoteModel.findByIdAndRemove(req.params.id)
            .then(() => {
                res.sendStatus(204);
            })
            .catch(() => {
                res.status(400);
                res.send({ "error" : "There is no security note with the given ID in the database!" });
            });
    }
}
