import { Response } from "express";

export const response = {
  ok: <type>(
    res: Response,
    message: string,
    statusCode: number,
    data?: type
  ) => {
    return res.status(statusCode).json({
      success: true,
      message,
      //adding data if it is not undefined
      ...(data !== undefined && { data }),
    });
  },

  error: (res: Response, message: string, statusCode: number) => {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  },
};
