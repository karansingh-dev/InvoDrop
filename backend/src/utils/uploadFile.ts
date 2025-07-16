import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

export function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export const uploadToCloudinary = async (
  buffer: Buffer,
  filename: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "InvoDrop/Logos",
        public_id: `${Date.now()}-${filename.split(".")[0]}`,
        transformation: [
          {
            width: 200,
            height: 60,
            crop: "fit",
            fetch_format: "auto",
            quality: "auto",
          },
        ],
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Upload failed"));
        }
        resolve(result.secure_url);
      }
    );

    bufferToStream(buffer).pipe(stream);
  });
};
