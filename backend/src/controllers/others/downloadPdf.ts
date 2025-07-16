import { Request, Response } from "express";
import { response } from "../../utils/response";
import { downloadPdf } from "../../utils/downloadPdf";
import { uploadPdf } from "../../utils/uploadPdf";
import { api } from "../../routes/router";

const createDownloadLink = async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;

  if (invoiceId) {
    const isPdfDownloaded = await downloadPdf(invoiceId);

    if (!isPdfDownloaded.success) {
      return response.error(res, "Failed To Download Pdf", 400);
      
    }

    const isUploaded = await uploadPdf();

    if (!isUploaded.success) {
      return response.error(res, "Failed To Download Pdf", 400);
      
    }

    return response.ok(res, "Successfully Downloaded Pdf", 200, isUploaded.url);
  } else {
    return response.error(res, "Invalid Parameters Sent", 400);
  }
};

api.get("/download-pdf/:invoiceId", "protected", createDownloadLink);
