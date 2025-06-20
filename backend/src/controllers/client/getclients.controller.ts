import { Request, Response } from "express";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { customRequest } from "../../types/customRequest";
import { api } from "../../routes/router";


export const getClients = async (req: Request, res: Response) => {

    const user: customRequest = req.user;

    const clients = await prisma.client.findMany({
        where: {
            email: user.email
        }
    });
    console.log(typeof clients);
    if (clients) {
        response.ok(res, "Fetched Clients Successfully", 200, clients);
    }
    else if (clients) {
        response.error(res, "No Clients Exists", 404);
    }
}


api.get("/get-clients", "protected", getClients);