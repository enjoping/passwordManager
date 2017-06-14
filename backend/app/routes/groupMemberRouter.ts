/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response } from "express";
const groupModel = require("./../models/groupModel");

import { BaseRouter } from "./baseRouter";
const securityNoteModel = require("./../models/securityNoteModel");
import { SecurityNoteValidator } from "../validators/securityNoteValidator";

export class GroupMemberRouter extends BaseRouter {
    constructor() {
        super();
        this.basePath = "/:group/member";
        this.init();
    }

    /**
     * GET group/group-id/member route to retrieve all members of a group.
     * @param req
     * @param res
     */
    protected list(req: Request, res: Response): void {
        groupModel.findById(req.params.group)
            .then((group) => {
                res.status(200);
                res.json(group.members);
            })
            .catch(() => {
                res.status(400);
                res.send({error: "There is no group with the given ID in the database!"});
            });
    }

    /**
     * GET group/group-id/member/:id route to retrieve a single securityNote by id.
     * @param req
     * @param res
     */
    protected get(req: Request, res: Response): void {
        if (typeof req.body.id !== "number") {
            res.send({error: "The id field is required and need to be of the correct type."});
        }
        groupModel.findById(req.params.group)
            .then((group) => {
                let found = false;
                group.members.forEach((member) => {
                    if (member.id === +req.params.id) {
                        res.status(200);
                        res.send(member);
                        found = true;
                    }
                });
                if (!found) {
                    res.status(400);
                    res.send({error: "There is no member with the given ID in this group!"});
                }
            })
            .catch(() => {
                res.status(400);
                res.send({error: "There is no group with the given ID in the database!"});
            });
    }

    /**
     * POST group/group-id/member route to create a new securityNote.
     * @param req
     * @param res
     */
    protected create(req: Request, res: Response): void {
        if (typeof req.body.id !== "number" || typeof req.body.password !== "string") {
            res.status(400);
            res.send({error: "The id and password fields are required and need to be of the correct type."});
            return;
        }
        groupModel.findById(req.params.group)
            .then((group) => {
                let found = false;
                group.members.forEach((member) => {
                    if (member.id === req.body.id) {
                        found = true;
                    }
                });
                if (found) {
                    res.status(400);
                    res.send({error: "The user is already a member of this group!"});
                } else {
                    group.members.push({id: req.body.id, password: req.body.password});
                    group.save()
                        .then((savedGroup) => {
                            res.status(200);
                            res.json(savedGroup.members);
                        })
                        .catch((err) => {
                            res.status(400);
                            res.send(err);
                        });
                }
            })
            .catch(() => {
                res.status(400);
                res.send({error: "There is no group with the given ID in the database!"});
            });
    }

    /**
     * DELETE group/group-id/member/:id route to remove a user from a group.
     * @param req
     * @param res
     */
    protected erase(req: Request, res: Response): void {
        /* A bit mor to do here */
        res.send("This interface is very complicated and will need some time to be finished.");
    }
}
