import express from "express";
import {
    checkAuth,
    gitLogin,
    logout,
    recentUpdate,
    SendToAuth,
    loadAnotherGit,
} from "../controller/UserController";

const UserRouter = express.Router();

UserRouter.post("/auth", gitLogin, SendToAuth);

UserRouter.get("/check", checkAuth);

UserRouter.get("/logout", logout);

UserRouter.post("/update", recentUpdate);

UserRouter.get("/:userId", loadAnotherGit);

export default UserRouter;
