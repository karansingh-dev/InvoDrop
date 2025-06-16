import { Response } from "express";


export const response = {
    ok: (res: Response, message: string, statusCode: number = 200, data?: any,) => {
        return res.status(statusCode).json({
            success: true,
            message,
            //adding data if it is not undefined
            ...(data !== undefined && { data }),

        });

    },

    error: (res: Response, message: string, statusCode = 400, error?: any) => {
        return res.status(statusCode).json({
            success: false,
            message,
            error
        });
    },

}