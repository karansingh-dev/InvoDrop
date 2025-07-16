import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { response } from "../../utils/response";
import { api } from "../../routes/router";

function differenceInDays(time: Date): number {
  const currentTime = new Date();

  const createdAt = new Date(time);
  const differenceInMs = currentTime.getTime() - createdAt.getTime();

  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  return differenceInDays;
}

const dashBoardData = async (req: Request, res: Response) => {
  const days = Number(req.params.days);
  const user = req.user;

  const getUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });

  const recentInvoices = await prisma.invoice.findMany({
    where: {
      userId: user.userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      invoiceNumber: true,
      grandTotal: true,
      issueDate: true,
      dueDate: true,
      status: true,
      currency: true,
      client: {
        select: {
          companyName: true,
        },
      },
    },
  });

  const invoices = recentInvoices.map(
    (invoice: {
      id: any;
      invoiceNumber: any;
      grandTotal: any;
      issueDate: any;
      dueDate: any;
      status: any;
      currency: any;
      client: { companyName: any };
    }) => {
      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        grandTotal: invoice.grandTotal,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        curreny: invoice.currency,
        companyName: invoice.client.companyName,
      };
    }
  );
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
  const recentActivities = await prisma.recentActivity.findMany({
    where: {
      userId: user.userId,
    },
    select: {
      description: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const revenue = totalRevenue._sum.grandTotal;
  const pendingAmount = pendingInvoicesAmount._sum.grandTotal;
  const dashBoardData = {
    recentInvoices: invoices,
    totalRevenue: revenue,
    clientsCount,
    invoicesCount,
    pendingInvoicesAmount: pendingAmount,
    recentActivities: recentActivities,
  };

  return response.ok(
    res,
    "Succussfully Fetched DashBoard Data",
    200,
    dashBoardData
  );
};

api.get("/get-dashboard-data/:days", "protected", dashBoardData);
