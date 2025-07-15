import { Request, Response } from "express";
import multer from "multer";
import { response } from "../../utils/response";
import { router } from "../../routes/router";
import { defaultMiddleware } from "../../middlewares/auth.middleware";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

//uploading the logo directly to cloudinary

let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: "InvoDrop/Logos",
        allowed_formats: ["jpg", "png", "svg", "webp"],
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        transformation: [
          {
            width: 200,
            height: 60,
            crop: "fit",
            fetch_format: "auto",
            quality: "auto",
          },
        ],
      };
    },
  });
} catch (error) {
  console.log("Cloudinary: Failed to Initiate cloudinary instance in multer");
  throw error;
}

export const upload = multer({ storage });

export const uploadLogo = async (req: Request, res: Response) => {
  const logo = req.file;

  if (!logo) {
    response.error(res, "No File Sent", 400);
    return;
  }

  const logoUrl = logo.path;

  response.ok(res, "Logo Uploaded Successfully", 201, logoUrl);
  return;
};

//multer router ;

router.post(
  "/upload-company-logo",
  defaultMiddleware,
  upload.single("file"),
  uploadLogo
);
