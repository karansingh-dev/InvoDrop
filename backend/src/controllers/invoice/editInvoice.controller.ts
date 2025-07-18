import { Request, Response } from "express";
import { invoiceData, items, newInvoice } from "./createInvoice.controller";
import { createInvoiceSchema } from "../../validations/invoice/createInvoiceSchema";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { sendPdf } from "../../utils/sendPdf";
import { uploadPdf } from "../../utils/uploadPdf";
import { downloadPdf } from "../../utils/downloadPdf";

interface invoice extends invoiceData {
  invoiceNumber: string;
}

const editInvoice = async (req: Request, res: Response) => {
  const invoiceData: invoice = req.body;
  const user = req.user;

  const invoiceId = req.params.invoiceId;

  // so that zod can accept
  invoiceData.issueDate = new Date(invoiceData.issueDate);
  invoiceData.dueDate = new Date(invoiceData.dueDate);

  const requestValidation = createInvoiceSchema.safeParse(invoiceData);

  if (requestValidation.success && invoiceId) {
    const client = await prisma.client.findFirst({
      where: {
        email: invoiceData.clientEmail,
        userId: user.userId,
      },
    });

    const invoiceExist = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (invoiceExist) {
      if (client) {
        const oldGrandTotal = invoiceExist.grandTotal;

        const oldTotlaBilledAmount = client.totalBilledAmount;

        const Invoice: newInvoice = {
          invoiceNumber: invoiceData.invoiceNumber,
          userId: user.userId,
          clientId: client.id,
          subTotal: invoiceData.subTotal,
          taxPercent: invoiceData.taxPercent,
          grandTotal: invoiceData.grandTotal,
          issueDate: invoiceData.issueDate,
          dueDate: invoiceData.dueDate,
          currency: invoiceData.currency,
          notes: invoiceData.notes,
        };

        await prisma.invoice.update({
          where: {
            id: invoiceId,
          },
          data: Invoice,
        });

        const newInvoiceItems: items[] = invoiceData.invoiceItems.map(
          (item) => {
            return {
              invoiceId,
              name: item.name,
              description: item.description,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            };
          }
        );
        await prisma.item.deleteMany({
          where: {
            invoiceId: invoiceId,
          },
        });

        await prisma.item.createMany({
          data: newInvoiceItems,
        });

        const difference = Number(oldTotlaBilledAmount) - Number(oldGrandTotal);

        const newTotlaBilledAmount = difference + Invoice.grandTotal;

        await prisma.client.update({
          where: {
            id: client.id,
          },
          data: {
            totalBilledAmount: newTotlaBilledAmount,
          },
        });

        const isPdfDownloaded = await downloadPdf(invoiceId);

        if (isPdfDownloaded.success) {
          const isPdfUploaded = await uploadPdf();

          if (isPdfUploaded.success && isPdfUploaded.url) {
            const sentPdf = await sendPdf(
              invoiceData.clientEmail,
              isPdfUploaded.url
            );

            if (sentPdf.success) {
              return response.ok(res, "Invoice Updated Successfully", 200);
              
            } else {
              await prisma.invoice.delete({
                where: {
                  id: invoiceId,
                },
              });
              return response.error(res, "Failed To Update Invoice", 400);
              
            }
          } else {
            await prisma.invoice.delete({
              where: {
                id: invoiceId,
              },
            });
            console.error("Failed To Upload Pdf");
            return response.error(res, "Failed To Update Invoice", 400);
            
          }
        } else {
          await prisma.invoice.delete({
            where: {
              id: invoiceId,
            },
          });
          console.error("failed to download pdf");
          return response.error(res, "Failed To Update Invoice", 400);
          
        }
      } else {
        return response.error(res, "No Client Exists With This Email", 404);
        
      }
    } else {
      return response.error(res, "No Invoice Exists With This Id", 404);
      
    }
  } else {
    return response.error(res, "Invalid Data Sent", 400);
    
  }
};

api.put("/edit-invoice/:invoiceId", "protected", editInvoice);
