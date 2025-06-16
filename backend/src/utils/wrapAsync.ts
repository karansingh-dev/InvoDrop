import { NextFunction } from "express";
import express from "express"
import { response } from "./response";
import { Request, Response } from "express";


export const wrapAsync = (
    controller: (req: Request, res: Response,next:NextFunction) => Promise<Response>
): express.RequestHandler => {
    return async (req: Request, res: Response,next:NextFunction) => {
        try {
            await controller(req, res,next);
        } catch (error: any) {
            console.log("Internal Server Error", error.message)
            response.error(res, error.message, error)
            next(error); 
          

        };
    }
}
