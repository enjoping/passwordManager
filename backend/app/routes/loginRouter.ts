/**
 * Created by marcelboes on 05.06.17.
 */
import {Request, Response} from "express";
import {BaseRouter} from "./baseRouter";
const userModel = require("./../models/userModel");
const sessionModel = require("./../models/sessionModel");

export class LoginRouter extends BaseRouter {

    /**
     * POST /user route to create a new session.
     * @param req
     * @param res
     */
    protected create(req: Request, res: Response): void {
        userModel.find({name: req.body.user})
            .then((user) => {
                const bcrypt = require("bcrypt");
                // check password
                if (bcrypt.compareSync(req.body.password, user[0].password)) {
                    const crypto = require("crypto");
                    // create a token
                    crypto.randomBytes(48, (err, buffer) => {
                        const token = buffer.toString("hex");
                        const newSession = new sessionModel();
                        newSession.token = token;
                        newSession.id = user._id;
                        newSession.save();
                        res.status(200);
                        res.send({token: token});
                    });
                } else {
                    res.status(403);
                    res.send({error: "Password does not match"});
                }
                // res.status(200);
                // res.json(user);
            })
            .catch(() => {
                res.status(400);
                res.send({error: "There is no user with the given username in the database!"});
            });
    }
}
