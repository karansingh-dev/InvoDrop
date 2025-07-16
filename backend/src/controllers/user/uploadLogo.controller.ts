import { Request, Response } from "express";
import multer from "multer";
import { response } from "../../utils/response";
import { router } from "../../routes/router";
import { defaultMiddleware } from "../../middlewares/auth.middleware";
import { uploadToCloudinary } from "../../utils/uploadFile";

// multer config
const storage = multer.memoryStorage();
const limits = { fileSize: 1000 * 1000 * 10 }; // limit to 4mb
const upload = multer({ storage, limits });

export const uploadLogo = async (req: Request, res: Response) => {
  try {
    const logo = req.file;

    if (!logo) {
      response.error(res, "No File Sent", 400);
      return;
    }

    try {
      const logoUrl = await uploadToCloudinary(logo.buffer, logo.originalname);
      response.ok(res, "Logo Successfully Uploaded", 201, logoUrl);
      return;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Cloudinary: Failed to upload Logo:", error);
    throw error;
  }
};

//multer router ;

router.post(
  "/upload-company-logo",
  defaultMiddleware,
  upload.single("file"),
  uploadLogo
);
