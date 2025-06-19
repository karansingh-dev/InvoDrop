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
        response.error(res, "Authorization Token is Required", 401);
        return;
    }

    try {



        next();
    } catch (error) {
        console.log(error);
        response.error(res, "Invalid Token", 401);
     next(error)
    }
};