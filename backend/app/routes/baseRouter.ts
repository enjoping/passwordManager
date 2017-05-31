/**
 * Created by Joe Pietler on 31.05.17.
 */

import { Request, Response, Router } from "express";

export class BaseRouter {
    protected router: Router;
    constructor() {
        this.router = Router();
        this.setRoutes();
    }

    public getRouter() {
        return this.router;
    }

    protected setRoutes() {
        this.router.route("/")
            .get(this.list)
            .post(this.create);

        this.router.route("/:id")
            .get(this.get)
            .patch(this.update)
            .delete(this.delete);
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

    protected delete(req: Request, res: Response) {
        res.status(405);
        res.send("This method has not been implemented by the controller.");
    }
}
