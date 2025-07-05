import { Request, Response } from "express";
import { response } from "../../utils/response";
import { downloadPdf } from "../../utils/downloadPdf";
import { uploadPdf } from "../../utils/uploadPdf";
import { api } from "../../routes/router";
import { sendPdf } from "../../utils/sendPdf";

const sendPdfToClient = async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;

  const email = req.body;

  if (invoiceId && email) {
    const isPdfDownloaded = await downloadPdf(invoiceId);

    if (!isPdfDownloaded.success) {
      response.error(res, "Failed To Send Pdf", 400);
      return;
    }

    const isUploaded = await uploadPdf();

    if (!isUploaded.success) {
      response.error(res, "Failed To Send Pdf", 400);
      return;
    }

    if (isUploaded.url) {
      const isPdfSent = await sendPdf(email, isUploaded.url);
      if (isPdfSent.success) {
        response.ok(res, "Pdf Sent Successfully", 200);
        return;
      } else {
        response.error(res, "Failed To Send Pdf", 400);
        return;
      }
    } else {
      response.error(res, "Failed To Send Pdf", 400);
      return;
    }
  } else {
    response.error(res, "Invalid Parameters Sent Or Data Sent", 400);
  }
};

api.post("/send-pdf/:invoiceId", "protected", sendPdfToClient);
