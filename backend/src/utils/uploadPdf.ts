import { v2 as cloudinary } from "cloudinary";
import path from "path";

interface uploadPdfResponse {
  success: boolean;
  url: string | undefined;
}

export const uploadPdf = async (): Promise<uploadPdfResponse> => {
  try {
    const filePath = path.resolve(__dirname, "../../public//pdf/invoice.pdf");

    const upload = await cloudinary.uploader.upload(filePath);

    if (upload.url) {
      return {
        success: true,
        url: upload.url,
      };
    } else {
      return {
        success: false,
        url: undefined,
      };
    }
  } catch (error) {
    console.error("error upload data", error);
    return {
      success: false,
      url: undefined,
    };
  }
};
