import { Request, Response } from "express";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { customRequest } from "../../types/customRequest";
import { api } from "../../routes/router";

export const getClients = async (req: Request, res: Response) => {
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

  if (clients) {
    response.ok(res, "Fetched Clients Successfully", 200, clients);
    return;
  }

  response.error(res, "No Clients Exists", 404);
  return;
};

api.get("/get-clients", "protected", getClients);
