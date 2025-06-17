import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "./config/config";
import { dbConnection } from "./helpers/prismaClient";
import { router } from "./routes/router";

const app = express();


async function startServer() {
    app.use(cors());
    app.use(bodyParser.json());
    app.use("/invodrop", router);

    await dbConnection();

    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`);
    })
}

startServer();







