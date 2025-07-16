import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { response } from "../../utils/response";
import { api } from "../../routes/router";
import logger from "../../utils/pino/logger";
import { isUUID } from "../../validations/isUUID";

const deleteClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    if (!clientId || !isUUID(clientId))
      return response.error(res, "Invalid Client Id", 400);

    const clientExist = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!clientExist)
      return response.error(res, "No Client found With This id", 404);

    await prisma.client.delete({
      where: {
        id: clientId,
      },
    });

    return response.ok(res, "Successfully Deleted Client", 200);
  } catch (error: any) {
    logger.error(
      { error: error.message, route: "delete-client", userId: req.user.userId },
      "Failed to Delete Client"
    );
    throw error;
  }
};

api.delete("/delete-client/:clientId", "protected", deleteClient);
