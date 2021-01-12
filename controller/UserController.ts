import { CookieOptions, NextFunction, Request, Response } from "express";
import Axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User, { UserType } from "..//model/User";
dotenv.config();

const option = (login: boolean) => {
    const options: CookieOptions = {
        maxAge: login ? 1000 * 60 * 60 * 24 * 7 : 0,
        domain:
            process.env.NODE_ENV === "production" ? ".jaswiki.com" : undefined,
        path: "/",
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    return options;
};

export const gitLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { code } = req.body;
    try {
        // 토큰 취득
        const res = await Axios.post(
            "https://github.com/login/oauth/access_token",
            {
                code,
                client_id: process.env.CLIENTID,
                client_secret: process.env.CLIENTSECRET,
            }
        ).then((res) => res.data);

        const token = res?.split("&")[0]?.split("=")[1];

        // 토큰으로 user 정보 획득
        const gitUser = await Axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
            },
        }).then((res) => res.data);

        const existUser = await User.findOne({ email: gitUser.email });
        if (existUser) {
            // 유저가 존재한다면
            const jwtToken = jwt.sign(
                { email: existUser.email },
                process.env.JWT_SECRET as string
            );
            req.user = existUser;
            (req.user as UserType).jwtToken = jwtToken;
            next();
        } else {
            // 유저가 없다면
            const user = await User.create({
                avatarUrl: gitUser.avatar_url,
                repos: gitUser.public_repos,
                followers: gitUser.followers,
                followings: gitUser.following,
                bio: gitUser.bio,
                name: gitUser.name,
                email: gitUser.email,
                url: gitUser.url,
                userId: gitUser.login,
            });
            const jwtToken = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET as string
            );
            req.user = user;
            (req.user as UserType).jwtToken = jwtToken;
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ err });
    }
};

export const SendToAuth = (req: Request, res: Response) => {
    const { jwtToken } = req.user as UserType;
    return res
        .cookie("git_auth", jwtToken, option(true))
        .status(200)
        .json(req.user);
};

// 토큰이 있는지 없는지 확인

export const checkAuth = (req: Request, res: Response) => {
    const token = req.cookies.git_auth;
    if (token === undefined || token === "") {
        return res.json({ message: "User not found token is empty" });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err: any, decoded: any) => {
            if (err) {
                return res.status(500).json({ message: "token decode 실패" });
            }
            User.findOne({ email: decoded.email }, (err: any, user: any) => {
                if (err) {
                    return res.json("유저가 존재하지 않습니다.");
                }
                if (!user) {
                    return res.status(400).json("일치하는 유저가 없습니다.");
                }
                if (user) {
                    req.user = user;
                    (req.user as UserType).jwtToken = token;
                    return res.status(200).json(user);
                }
            });
        }
    );
};

export const logout = (req: Request, res: Response) => {
    try {
        res.status(200).cookie("git_auth", "", option(false));
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
};
