import express from "express";
import {
    getCortfolio,
    changeImg,
    addProjects,
    addSkills,
    addContact,
    delSkills,
    delContact,
    delProjects,
} from "../controller/CortController";

const CortRouter = express.Router();

// cort

CortRouter.get("/:userId", getCortfolio);
CortRouter.post("/changeimg", changeImg);
CortRouter.post("/project", addProjects);
CortRouter.post("/skills", addSkills);
CortRouter.post("/contact", addContact);

CortRouter.delete("/project/del", delProjects);
CortRouter.delete("/skills/del", delSkills);
CortRouter.delete("/contact/del", delContact);

export default CortRouter;
