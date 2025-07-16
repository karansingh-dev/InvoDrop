import { Request, Response } from "express";
import { addClientSchema as oldClientSchema } from "../../validations/client/addClientSchema";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { NewClientDataType as OldClientDataType } from "../../types/client";
import logger from "../../utils/pino/logger";
import { isUUID } from "../../validations/isUUID";

const editClient = async (req: Request, res: Response) => {
  try {
    const clientData: OldClientDataType = req.body;
    const user = req.user;

    const { clientId } = req.params;

    

    if (!clientId || !isUUID(clientId))
      return response.error(res, "Invalid Client Id ", 400);

    const clientExist = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!clientExist) return response.error(res, "Client not found", 404);

    if (clientExist.userId !== user.userId) {
      return response.error(res, "Unauthorized to edit this client", 403);
    }

    const requestValidation = oldClientSchema.safeParse(clientData);

    console.log(requestValidation.error);
    if (!requestValidation.success)
      return response.error(res, "Invalid Data Sent", 400);

    //full validated data;
    const newClientData = requestValidation.data;

    await prisma.client.update({
      where: {
        id: clientId,
      },
      data: newClientData,
    });

    return response.ok(res, "Successfully Updated Client Details", 200);
  } catch (error: any) {
    logger.error(
      { err: error.message, route: "/edit-client", userId: req.user.userId },
      "Failedto update Client in DB"
    );

    throw error;
  }
};

api.put("/edit-client/:clientId", "protected", editClient);
