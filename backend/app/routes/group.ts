/**
 * Created by marcelboes on 19.05.17.
 */

import { Request, Response, Router } from "express";
const router = Router();

const listGroups = (req: Request, res: Response) => {
    //
};

const getGroup = (req: Request, res: Response) => {
    //
};

const postGroup = (req: Request, res: Response) => {
    //
};

const patchGroup = (req: Request, res: Response) => {
    //
};

const deleteGroup = (req: Request, res: Response) => {
    //
};

router.route("/")
    .get(listGroups)
    .post(postGroup);

router.route("/:id")
    .get(getGroup)
    .delete(deleteGroup)
    .patch(patchGroup);

module.exports = router;
