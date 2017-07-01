/**
 * Created by Joe Pietler on 31.05.17.
 */

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import * as path from "path";

const userModel = require("./../models/userModel");

passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

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
        this.app.use(require("express-session")({
            resave: false,
            saveUninitialized: false,
            secret: "keyboard cat",
        }));
        this.app.use(passport.initialize());
        this.app.use(cors());
        this.app.options("*", cors());
    }

    private addStaticRoute() {
        /**
         * Deliver the installation page
         */
        this.app.use("/install", express.static(__dirname + "/../../installation"));

        /**
         * Deliver the angular frontend
         */
        this.app.use("/", express.static(__dirname + "/../../dist"));
        this.app.use((req: express.Request, res: express.Response) => {
            res.sendFile("index.html", { root: path.resolve(__dirname + "/../../dist") });
        });
    }
}
