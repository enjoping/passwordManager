/**
 * Created by marcelboes on 19.05.17.
 */

import { Request, Response, Router } from "express";
const router = Router();

const listSecurityNotes = (req: Request, res: Response) => {
    //
};

const getSecurityNote = (req: Request, res: Response) => {
    //
};

const postSecurityNote = (req: Request, res: Response) => {
    //
};

const patchSecurityNote = (req: Request, res: Response) => {
    //
};

const deleteSecurityNote = (req: Request, res: Response) => {
    //
};

router.route("/")
    .get(listSecurityNotes)
    .post(postSecurityNote);

router.route("/:id")
    .get(getSecurityNote)
    .delete(deleteSecurityNote)
    .patch(patchSecurityNote);

module.exports = router;
