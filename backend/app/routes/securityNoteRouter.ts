/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response } from "express";

import { BaseRouter } from "./baseRouter";
import { SecurityNoteValidator } from "../validators/securityNoteValidator"
const securityNoteModel = require("./../models/securityNoteModel");

export class SecurityNoteRouter extends BaseRouter {
    /**
     * GET group/group-id/note route to retrieve all stored securityNotes.
     * @param req
     * @param res
     */
    protected list(req: Request, res: Response): void {
        console.log(req.params);
        securityNoteModel.find()
            .then(securityNotes => {
                res.status(200);
                res.json(securityNotes);
            })
            .catch(err => {
                res.status(500);
                res.send(err);
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
        const newSecurityNote = SecurityNoteValidator.validateSecurityNoteSchema(req);
        if (!newSecurityNote.hasOwnProperty("error")) {
            newSecurityNote.save()
                .then(securityNote => {
                    res.status(200);
                    res.json(securityNote);
                })
                .catch(err => {
                    res.status(500);
                    res.send(err);
                })
        } else {
            res.status(400);
            res.send(newSecurityNote);
        }
    }

    /**
     * PATCH group/group-id/note/:id route to update a single securityNote by id.
     * @param req
     * @param res
     */
    protected update(req: Request, res: Response): void {
        const securityNote = SecurityNoteValidator.validateSecurityNoteSchema(req);
        if (typeof securityNote["errors"] === "undefined") {
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
        } else {
            res.status(400);
            res.send(securityNote);
        }
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
