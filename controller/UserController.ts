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
        const {
            avatar_url: avatarUrl,
            public_repos: repos,
            followers,
            following: followings,
            bio,
            name,
            email,
            html_url: url,
            login: userId,
            company,
            blog,
            location,
        } = await Axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
            },
        }).then((res) => res.data);

        const existUser = await User.findOne({
            email,
        });

        // 유저가 존재한다면
        if (existUser) {
            // 최신 정보와 비교해 추가
            const updateUser = await User.findOneAndUpdate(
                {
                    email,
                },
                {
                    avatarUrl,
                    repos,
                    followers,
                    followings,
                    bio,
                    name,
                    email,
                    url,
                    userId,
                    company,
                    blog,
                    location,
                }
            );
            const jwtToken = jwt.sign(
                { email: updateUser?.email },
                process.env.JWT_SECRET as string
            );
            (req as any).user = updateUser as UserType;
            (req as any).user.jwtToken = jwtToken;
            updateUser?.save();
            next();
        } else {
            // 유저가 없다면
            const user = await User.create({
                avatarUrl,
                repos,
                followers,
                followings,
                bio,
                name,
                email,
                url,
                userId,
                company,
                blog,
                location,
            });
            const jwtToken = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET as string
            );
            (req as any).user = user;
            (req as any).user.jwtToken = jwtToken;
            user.save();
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ err });
    }
};

export const SendToAuth = (req: Request, res: Response) => {
    const { jwtToken } = (req as any).user;
    return res
        .cookie("git_auth", jwtToken, option(true))
        .status(200)
        .json((req as any).user);
};

// 토큰이 있는지 없는지 확인

export const checkAuth = (req: Request, res: Response) => {
    const token = req.cookies.git_auth;
    if (token === undefined || token === "") {
        return;
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) {
                return res.status(500).json({ message: "token decode 실패" });
            }
            await User.findOne(
                { email: decoded.email },
                (err: any, user: any) => {
                    if (err) {
                        return res.json("유저가 존재하지 않습니다.");
                    }
                    if (!user) {
                        return res
                            .status(400)
                            .json("일치하는 유저가 없습니다.");
                    }
                    if (user) {
                        (req as any).user = user;
                        (req as any).user.jwtToken = token;
                        return res.status(200).json(user);
                    }
                }
            );
        }
    );
};

export const logout = (req: Request, res: Response) => {
    return res.cookie("git_auth", "", option(false)).status(200).json("clear!");
};

export const recentUpdate = async (req: Request, res: Response) => {
    const { username } = req.body;
    try {
        const {
            avatar_url: avatarUrl,
            public_repos: repos,
            followers,
            following: followings,
            bio,
            name,
            email,
            html_url: url,
            login: userId,
            company,
            blog,
            location,
        } = await Axios.get(
            `https://api.github.com/users/${username}`,
            {}
        ).then((res) => res.data);

        // 최신 정보와 비교해 추가
        const updateUser = await User.findOneAndUpdate(
            {
                userId: username,
            },
            {
                avatarUrl,
                repos,
                followers,
                followings,
                bio,
                name,
                email,
                url,
                userId,
                company,
                blog,
                location,
            }
        );
        updateUser?.save();
        res.status(200).json(updateUser);
    } catch (err) {
        console.error(err);
        res.status(400).json("오류");
    }
};

export const loadAnotherGit = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const anotherUserGit = await User.findOne({ userId });
        res.status(200).json(anotherUserGit);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
};
