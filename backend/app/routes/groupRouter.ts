/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response } from "express";

import { BaseRouter } from "./baseRouter";

export class GroupRouter extends BaseRouter {
    protected list(req: Request, res: Response) {
        res.send("List of groups");
    }
}
