import prisma from "../../helpers/prismaClient";
import { Request, Response } from "express";
import { api } from "../../routes/router";
import { response } from "../../utils/response";
import z from "zod";
import { createInvoiceSchema } from "../../validations/invoice/createInvoiceSchema";
import { customRequest } from "../../types/customRequest";
import { invoiceItemSchema } from "../../validations/invoice/invoiceItemSchema";
import { downloadPdf } from "../../utils/downloadPdf";
import { uploadPdf } from "../../utils/uploadPdf";
import { sendPdf } from "../../utils/sendPdf";

export type invoiceData = z.infer<typeof createInvoiceSchema>;

export type currencyType = "Rupees" | "Dollar" | "Euro" | "Pound" | "Yen";

export type itemType = z.infer<typeof invoiceItemSchema>;

export interface items extends itemType {
  invoiceId: string;
}

export interface newInvoice {
  invoiceNumber: string;
  userId: string;
  clientId: string;
  subTotal: number;
  taxPercent: number;
  grandTotal: number;
  issueDate: Date;
  dueDate: Date;
  currency: currencyType;
  notes: string;
}

export const duplicateInvoice = async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;

  const user: customRequest = req.user;

  if (invoiceId) {
    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (!invoiceData) {
      response.error(res, "No Invoice Exists With This Id", 400);
      return;
    }

    const invoiceItems = await prisma.item.findMany({
      where: {
        invoiceId,
      },
    });

    if (!invoiceItems) {
      response.error(res, "Failed To Duplicate Invoice", 400);
      return;
    }
    const invoiceCount = await prisma.invoice.count({
      where: {
        userId: user.userId,
      },
    });

    const invNumber = `INV-${invoiceCount + 1}`;

    const newInvoice = {
      invoiceNumber: invNumber,
      userId: user.userId,
      clientId: invoiceData.clientId,
      subTotal: invoiceData.subTotal,
      taxPercent: invoiceData.taxPercent,
      grandTotal: invoiceData.grandTotal,
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      currency: invoiceData.currency,
      notes: invoiceData.notes,
    };

    const duplicateInvoice = await prisma.invoice.create({
      data: newInvoice,
    });

    const newInvoiceItems = invoiceItems.map((item) => {
      return {
        invoiceId: duplicateInvoice.id,
        name: item.name,
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      };
    });

    await prisma.item.createMany({
      data: newInvoiceItems,
    });

    const client = await prisma.client.update({
      where: {
        id: duplicateInvoice.clientId,
      },
      data: {
        invoiceCount: { increment: 1 },
        totalBilledAmount: { increment: invoiceData.grandTotal },
      },
    });

    const isPdfDownloaded = await downloadPdf(duplicateInvoice.id);

    if (isPdfDownloaded.success) {
      const isPdfUploaded = await uploadPdf();

      if (isPdfUploaded.success && isPdfUploaded.url) {
        const sentPdf = await sendPdf(client.email, isPdfUploaded.url);

        if (sentPdf.success) {
          response.ok(res, "Invoice Duplicated Successfully", 201);
          return;
        } else {
          await prisma.invoice.delete({
            where: {
              id: duplicateInvoice.id,
            },
          });
          response.error(res, "Failed To Duplicate Invoice", 400);
          return;
        }
      } else {
        await prisma.invoice.delete({
          where: {
            id: duplicateInvoice.id,
          },
        });
        console.error("failed to Upload pdf");
        response.error(res, "Failed To Duplicate Invoice", 400);
        return;
      }
    } else {
      await prisma.invoice.delete({
        where: {
          id: duplicateInvoice.id,
        },
      });
      console.error("failed to download pdf");
      response.error(res, "Failed To Duplicate Invoice", 400);
      return;
    }
  } else {
    response.error(res, "No Invoice Exists With This Id", 404);
    return;
  }
};

api.post("/duplicate-invoice/:invoiceId", "protected", duplicateInvoice);
