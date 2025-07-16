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
      return response.error(res, "Failed To Send Pdf", 400);
      
    }

    const isUploaded = await uploadPdf();

    if (!isUploaded.success) {
      return response.error(res, "Failed To Send Pdf", 400);
      
    }

    if (isUploaded.url) {
      const isPdfSent = await sendPdf(email, isUploaded.url);
      if (isPdfSent.success) {
        return response.ok(res, "Pdf Sent Successfully", 200);
        
      } else {
        return response.error(res, "Failed To Send Pdf", 400);
        
      }
    } else {
      return response.error(res, "Failed To Send Pdf", 400);
      
    }
  } else {
    return response.error(res, "Invalid Parameters Sent Or Data Sent", 400);
  }
};

api.post("/send-pdf/:invoiceId", "protected", sendPdfToClient);
