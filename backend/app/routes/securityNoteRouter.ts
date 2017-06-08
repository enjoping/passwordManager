/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response } from "express";

import { BaseRouter } from "./baseRouter";

export class SecurityNoteRouter extends BaseRouter {
    constructor() {
        super();
        this.basePath = "/:group/security-note";
    }

    protected list(req: Request, res: Response) {
        res.send("List of security notes");
    }
}
