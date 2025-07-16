import { Request, Response } from "express";
import { addClientSchema } from "../../validations/client/addClientSchema";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { ClientDataType, NewClientDataType } from "../../types/client";

export const addClient = async (req: Request, res: Response) => {
  try {
    const client: ClientDataType = req.body;
    const user = req.user;

    const requestValidation = addClientSchema.safeParse(client);

    if (!requestValidation) {
      return response.error(res, "Invalid Data Sent", 400);
    }

    let clientExist;

    try {
      clientExist = await prisma.client.findUnique({
        where: {
          email_userId: {
            email: client.email,
            userId: user.userId,
          },
        },
      });
    } catch (error) {
      console.log("DB: failed to Get Client", error);
      throw error;
    }

    if (clientExist) {
      return response.error(res, "Client Already Exist With This Email ", 409);
    }

    const addNewClient: NewClientDataType = {
      ...client,
      userId: user.userId,
    };

    try {
      await prisma.client.create({
        data: addNewClient,
      });
    } catch (error) {
      console.log("DB:Failed to Add new Client");
      throw error;
    }

    return response.ok(res, "Client Added Successfully", 201);
  } catch (error) {
    console.log("Failed to Add client", error);
    throw error;
  }
};

api.post("/add-client", "protected", addClient);
