import { UserType } from "../model/User";

declare global {
    namespace Express {
        export interface Request {
            user: UserType;
        }
    }
}
