import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "./config/config";
import { dbConnection } from "./helpers/prismaClient";
import { router } from "./routes/router";
import "./routes/routes";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import "./utils/uploadPdf";
import { startOverDueJob } from "./helpers/cronJobs/overDue";

const app = express();

async function startServer() {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(globalErrorHandler);
  app.use("/invodrop", router);

  //Background task to update status of invoices to overdue, Runs every midnight
  startOverDueJob();

  await dbConnection();

  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
}

startServer();
