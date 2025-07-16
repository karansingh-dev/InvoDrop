import { Request, Response } from "express";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";

export const deleteInvoice = async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;

  if (invoiceId) {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (invoice) {
      await prisma.invoice.delete({
        where: {
          id: invoiceId,
        },
      });

      await prisma.client.update({
        where: {
          id: invoice.clientId,
        },
        data: {
          invoiceCount: { decrement: 1 },
          totalBilledAmount: { decrement: invoice.grandTotal },
        },
      });

      return response.ok(res, "Invoice Deleted Successfully", 200);
      
    } else {
      return response.error(res, "No Invoice Exists With This Id", 404);
      
    }
  } else {
    return response.error(res, "Invalid Parameters Sent", 400);
    
  }
};

api.delete("/delete-invoice/:invoiceId", "protected", deleteInvoice);
