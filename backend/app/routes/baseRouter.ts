/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response, Router } from "express";
import * as expressJwt from "express-jwt";
const authenticate = expressJwt({secret : "p4ssw0rdM4n4g3R!"});

export class BaseRouter {
    protected router: Router;
    protected basePath: string = "";
    protected authenticate = authenticate;

    public getRouter() {
        return this.router;
    }

    protected init() {
        this.router = Router();
        this.setRoutes();
    }

    protected setRoutes() {
        this.router.route(this.basePath + "/")
            .get(this.authenticate, this.list)
            .post(this.authenticate, this.create);

        this.router.route(this.basePath + "/:id")
            .get(this.authenticate, this.get)
            .patch(this.authenticate, this.update)
            .delete(this.authenticate, this.erase);
    }

    protected list(req: Request, res: Response) {
        res.status(405);
        res.send("This method has not been implemented by the controller.");
    }

    protected get(req: Request, res: Response) {
        res.status(405);
        res.send("This method has not been implemented by the controller.");
    }

    protected create(req: Request, res: Response) {
        res.status(405);
        res.send("This method has not been implemented by the controller.");
    }

    protected update(req: Request, res: Response) {
        res.status(405);
        res.send("This method has not been implemented by the controller.");
    }

    protected erase(req: Request, res: Response) {
        res.status(405);
        res.send("This method has not been implemented by the controller.");
    }
}
