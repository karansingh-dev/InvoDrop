import { Request, Response } from "express";
import { response } from "../../utils/response";
import { api } from "../../routes/router";
import prisma from "../../helpers/prismaClient";
import logger from "../../utils/pino/logger";
import { isUUID } from "../../validations/isUUID";
export const getOneClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    if (!clientId || !isUUID(clientId))
      return response.error(res, "Invalid Client Id", 404);

    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
      select: {
        
        companyName: true,
        contactPersonName: true,
        phoneNumber: true,
        email: true,
        streetAddress: true,
        city: true,
        state: true,
        country: true,
        pinCode: true,
        status: true,
      },
    });

    if (!client) return response.error(res, "No Client Found", 404);

    return response.ok(res, "Client Fetched Successfully", 200, client);
  } catch (error) {
    logger.error(
      {
        error,
        route: "/get-client",
        user: req.user.userId,
      },
      "Failed to get client from DB"
    );
    throw error;
  }
};

api.get("/get-client/:clientId", "protected", getOneClient);
