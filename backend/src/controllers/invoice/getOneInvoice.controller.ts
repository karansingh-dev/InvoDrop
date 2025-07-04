import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { response } from "../../utils/response";
import { Decimal } from "@prisma/client/runtime/library";

type invoiceDataType = {
  id: string;
  invoiceNumber: string;
  notes: string;
  subTotal: Decimal;
  taxPercent: Decimal;
  grandTotal: Decimal;
  issueDate: Date;
  dueDate: Date;
  currency: "Rupees" | "Dollar" | "Euro" | "Pound" | "Yen";
  client: {
    id: string;
    companyName: string;
    contactPersonName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    email: string;
  };

  items: {
    name: string;
    description: string;
    unitPrice: Decimal;
    quantity: number;
    totalPrice: Decimal;
  }[];
};

export const getOneInvoice = async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;

  if (invoiceId) {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      select: {
        id: true,
        invoiceNumber: true,
        grandTotal: true,
        issueDate: true,
        subTotal: true,
        dueDate: true,
        status: true,
        currency: true,
        taxPercent: true,
        notes: true,
        client: {
          select: {
            id: true,
            email: true,
            companyName: true,
            contactPersonName: true,
            phoneNumber: true,
            streetAddress: true,
            city: true,
            state: true,
            country: true,
            pinCode: true,
          },
        },
        items: {
          select: {
            name: true,
            description: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
      },
    });

    if (invoice) {
      response.ok<invoiceDataType>(
        res,
        "Invoices Fetched Successfully",
        200,
        invoice
      );
      return;
    } else {
      response.error(res, "No Invoices Found", 404);
    }
  } else {
    response.error(res, "Invalid Paramters", 400);
  }
};

api.get("/get-invoice/:invoiceId", "noauth", getOneInvoice);
