import { NextFunction, Request, Response } from "express";
import { response } from "./response";
import logger from "./pino/logger";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error.stack);

  logger.error("Internal Server Error", error.message);
  return response.error(res, "Internal Server Error", 501);
};
