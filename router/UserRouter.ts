import express from "express";
import {
    checkAuth,
    gitLogin,
    logout,
    SendToAuth,
} from "../controller/UserController";

const UserRouter = express.Router();

UserRouter.get("/auth", gitLogin, SendToAuth);

UserRouter.get("/check", checkAuth);

UserRouter.get("/logout", logout);

export default UserRouter;
