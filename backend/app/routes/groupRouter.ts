/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response } from "express";
const groupModel = require("./../models/groupModel");

import { BaseRouter } from "./baseRouter";
import { GroupValidator } from "../validators/groupValidator";

export class GroupRouter extends BaseRouter {
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

    protected create(req: Request, res: Response): void {
        const newGroup = GroupValidator.validateGroupSchema(req);
        if (!newGroup.hasOwnProperty("error")) {
            newGroup.save()
                .then(group => {
                    res.status(200);
                    res.json(group);
                })
                .catch(err => {
                    res.status(500);
                    res.send(err);
                })
        } else {
            res.status(400);
            res.send(newGroup);
        }
    }

    protected update(req: Request, res: Response): void {
        const group = GroupValidator.validateGroupSchema(req);
        if (typeof group["errors"] === "undefined") {
            groupModel.findById(req.params.id)
                .then(group => {
                    Object.assign(group, req.body).save()
                        .then(group => {
                            res.status(200);
                            res.json(group);
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
            res.send(group);
        }
    }

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
