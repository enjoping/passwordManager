/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response } from "express";
const groupModel = require("./../models/groupModel");

import { BaseRouter } from "./baseRouter";
import { GroupValidator } from "../validators/groupValidator";

export class GroupRouter extends BaseRouter {

    constructor() {
        super();
        this.init();
    }

    /**
     * GET /group route to retrieve all stored groups.
     * @param req
     * @param res
     */
    protected list(req: Request, res: Response): void {
        groupModel.find()
            .then(groups => {
                res.status(200);
                res.json(groups);
            })
            .catch(err => {
                res.status(500);
                res.send(err);
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
        GroupValidator.validateGroupSchema(req).then((newGroup) => {
            newGroup.save()
                .then((group) => {
                    res.status(200);
                    res.json(group);
                })
                .catch((err) => {
                    res.status(500);
                    res.send(err);
                });
        }).catch((err) => {
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
            })
            .catch(() => {
                res.status(400);
                res.send({ "error" : "There is no group with the given ID in the database!" });
            });
    }
}
