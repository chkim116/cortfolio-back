import { Request, Response } from "express";
import Cortfolio from "../model/Cortfolio";

export const getCortfolio = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    try {
        const cortfolio = await Cortfolio.findOne({ userId });
        res.status(200).json(cortfolio);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const changeImg = (req: Request, res: Response) => {
    try {
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const addProjects = async (req: Request, res: Response) => {
    const {
        id,
        name,
        thumb,
        description,
        gitLink,
        pageLink,
        userId,
    } = req.body;
    try {
        const project = {
            id,
            name,
            thumb,
            description,
            gitLink,
            pageLink,
        };
        const userCortfolio = await Cortfolio.findOne({ userId });
        userCortfolio?.project.push(project);
        userCortfolio?.save();
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const addSkills = async (req: Request, res: Response) => {
    const { id, name, icon, userId } = req.body;
    try {
        const skills = {
            id,
            name,
            icon,
        };
        const userCortfolio = await Cortfolio.findOne({ userId });
        userCortfolio?.skills.push(skills);
        userCortfolio?.save();
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const addContact = async (req: Request, res: Response) => {
    const { name, phone, email, userId } = req.body;
    try {
        const contact = {
            name,
            phone,
            email,
        };
        await Cortfolio.findOneAndUpdate(
            { userId },
            {
                ...contact,
            }
        );
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const addCareer = async (req: Request, res: Response) => {
    const { career, userId } = req.body;
    try {
        const userCortfolio = await Cortfolio.findOne({ userId });
        userCortfolio?.contact.career.push(career);
        userCortfolio?.save();
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const delProjects = async (req: Request, res: Response) => {
    const { career, userId } = req.params;
    try {
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const delSkills = async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    try {
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};

export const delContact = async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    try {
        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(400).json("정보가 없습니다.");
    }
};
