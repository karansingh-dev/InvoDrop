import { Request, Response } from "express";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { customRequest } from "../../types/customRequest";
import { api } from "../../routes/router";
import logger from "../../utils/pino/logger";

export const getClients = async (req: Request, res: Response) => {
  try {
    const user: customRequest = req.user;

    const clients = await prisma.client.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        companyName: true,
        contactPersonName: true,
        phoneNumber: true,
        email: true,
        streetAddress: true,
        city: true,
        state: true,
        country: true,
        invoiceCount: true,
        totalBilledAmount: true,
        status: true,
      },
    });

    if (clients.length === 0)
      return response.error(res, "No Clients Found", 404);

    return response.ok(res, "Fetched Clients Successfully", 200, clients);
  } catch (error: any) {
    2;
    logger.error(
      { err: error, route: "/get-clients", userId: req.user.userId },
      "Failed to get clients from DB"
    );
    throw error;
  }
};

api.get("/get-clients", "protected", getClients);
