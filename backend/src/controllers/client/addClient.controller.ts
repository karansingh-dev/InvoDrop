import { Request, Response } from "express";
import { addClientSchema } from "../../validations/client/addClientSchema";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import z from "zod";
import { api } from "../../routes/router";
import { customRequest } from "../../types/customRequest";

type client = z.infer<typeof addClientSchema>


interface newClient extends client {
    userId: string;
}

export const addClient = async (req: Request, res: Response) => {

    const client: client = req.body;
    const user: customRequest = req.user;

    const requestValidation = addClientSchema.safeParse(client);

    if (requestValidation.success) {

        const clientExist = await prisma.client.findFirst({
            where: {
                email: client.email,
                userId: user.userId

            }
        })
        if (clientExist) {
            response.error(res, "Client Already Exists With This Email", 409);
            return;
        }
        else {
            const newClient: newClient = JSON.parse(JSON.stringify(client));

            newClient.userId = user.userId;

            await prisma.client.create({
                data: newClient
            })

            response.ok(res, "Client Added Successfully", 201);

        }

    }
    else {
        response.error(res, "Invalid Data Sent", 400);
    }


}


api.post("/add-client", "protected", addClient);