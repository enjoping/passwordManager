/**
 * Created by Joe Pietler on 31.05.17.
 */

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";

export class Server {
    private app: express.Application;
    private port: number;

    constructor(port: any) {
        this.port = +port;
        this.app = express();
        this.addParsers();
    }

    public registerRouter(path: string, router: express.Router) {
        this.app.use(path, router);
    }

    public start() {
        this.addStaticRoute();
        this.app.listen(this.port);
    }

    public getApp() {
        return this.app;
    }

    private addParsers() {
        /**
         * Body parser Options
         */
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
    }

    private addStaticRoute() {
        /**
         * Deliver the angular frontend
         */
        this.app.use("/", express.static(__dirname + "/../../dist"));
        this.app.use((req: express.Request, res: express.Response) => {
            res.sendFile("index.html", { root: path.resolve(__dirname + "/../../dist") });
        });
    }
}
