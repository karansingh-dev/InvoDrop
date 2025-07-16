


import { Request, Response } from "express";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";

const updateStutusToPending = async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;

  if (invoiceId) {
    await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: "pending",
      },
    });

    return response.ok(res, "Status Updated Successfully", 200);
    
  } else {
    return response.error(res, "Invalid Parameter", 400);
    
  }
};

api.post("/update-status-pending/:invoiceId", "protected", updateStutusToPending);
