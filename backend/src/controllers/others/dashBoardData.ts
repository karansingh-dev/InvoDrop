import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { response } from "../../utils/response";
import { api } from "../../routes/router";

const dashBoardData = async (req: Request, res: Response) => {
  const user = req.user;

  const recentInvoices = await prisma.invoice.findMany({
    where: {
      userId: user.userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  const totalRevenue = await prisma.invoice.aggregate({
    where: {
      userId: user.userId,
    },
    _sum: {
      grandTotal: true,
    },
  });

  const pendingInvoicesAmount = await prisma.invoice.aggregate({
    where: {
      status: "pending",
    },
    _sum: {
      grandTotal: true,
    },
  });

  const clientsCount = await prisma.client.count({
    where: {
      userId: user.userId,
    },
  });

  const invoicesCount = await prisma.invoice.count({
    where: {
      userId: user.userId,
    },
  });

  const dashBoardData = {
    recentInvoices,
    totalRevenue,
    clientsCount,
    invoicesCount,
  };

  response.ok(res, "Succussfully Fetched DashBoard Data", 200, dashBoardData);
  return;
};


api.get("/get-dashboard-data","protected",dashBoardData);