import { Request, Response, NextFunction } from "express";
import { response } from "../utils/response";


export const defaultMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeaders = req.header("Authorization");
    const token = authHeaders?.split(" ")[1];


    if (!token) {
        response.error(res, "Authorization Token is required", 401);
        return;
    }

    try {


        next();
    } catch (err: any) {
        console.log(err.message);

        response.error(res, "Invalid token", 401);
        return
    }
};