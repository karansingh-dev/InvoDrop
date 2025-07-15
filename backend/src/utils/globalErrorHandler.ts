import { NextFunction, Request, Response } from "express";
import { response } from "./response";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);

  console.log("Internal Server Error", error.message);
  response.error(res, "Internal Server Error", 501);
};
