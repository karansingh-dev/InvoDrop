import { Request, Response, NextFunction } from "express";
import { response } from "../utils/response";
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "../config/config";


function isJWTPayload(value: JwtPayload | String): value is JwtPayload {
    return (value as JwtPayload) !== undefined;
}

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

        const decodedToken = jwt.verify(token, config.JWT_SECRET!);


        const isJwtPayload = isJWTPayload(decodedToken);

        if (isJwtPayload) {
            const { userId, email, role } = decodedToken;
            req.user = { userId, email, role }
           
            next();
        }
        else {
            response.error(res, "Invalid Token", 401);
            return;
        }





    } catch (error) {
        console.log(error);
        response.error(res, "Invalid Token", 401);
        next(error)
    }
};