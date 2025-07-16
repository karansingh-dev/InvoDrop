import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "./config/config";
import { dbConnection } from "./helpers/prismaClient";
import { router } from "./routes/router";
import "./routes/allRoutes";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { startOverDueJob } from "./helpers/cronJobs/overDue";
import logger from "./utils/pino/logger";

const app = express();

async function startServer() {
  app.use(cors());
  app.use(bodyParser.json());

  app.use("/api", router);

  app.use(globalErrorHandler);

  //Background task to update status of invoices to overdue, Runs every midnight
  startOverDueJob();

  await dbConnection();

  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
}

startServer();
