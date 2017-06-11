/**
 * Created by marcelboes on 05.06.17.
 */

import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import {BaseRouter} from "./baseRouter";

const secretToken = "p4ssw0rdM4n4g3R!";

export class LoginRouter extends BaseRouter {
    constructor() {
        super();
        this.init();
    }

    protected setRoutes() {
        this.router.route(this.basePath + "/")
            .post(passport.authenticate("local", { session: false }), this.generateToken, this.login);
    }

    protected login(req: Request|any, res: Response) {
        res.status(200).send(req.headers.token);
    }

    private generateToken(req: Request, res: Response, next: NextFunction) {
        req.headers.token = jwt.sign({
            id: req.user._id,
        } as object, secretToken, {
            expiresIn: 120,
        });
        next();
    }
}
