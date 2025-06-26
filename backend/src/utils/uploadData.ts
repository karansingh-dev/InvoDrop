import { v2 as cloudinary } from 'cloudinary'
import path from "path"


interface response {
    success: boolean,
    url?: string
}

export const uploadData = async (): Promise<response> => {


    try {


        const filePath = path.resolve(__dirname, "../../public//pdf/invoice.pdf")

        const upload = await cloudinary.uploader.upload(filePath);


        if (upload.url && upload.public_id) {
            return {
                success: true,

                url: upload.url
            }
        }
        else {
            return {
                success: false,

            }
        }
    }

    catch (error) {
        console.error("error upload data", error)
        return {
            success: false
        }

    }


}

