import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { response } from "../utils/response";


export const defaultMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeaders = req.header("Authorization");
    const token = authHeaders?.split(" ")[1];


    if (!token) {
        return response.error(res, "Authorization token is required", 401);
    }


    try {

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = decoded as JwtPayload

        req.user = user;

        next();
    } catch (err: any) {
        console.log(err.message);
        return response.error(res, "Invalid token", 401);
    }
};