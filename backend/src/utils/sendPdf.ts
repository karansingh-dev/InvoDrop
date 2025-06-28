import { Resend } from "resend";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { config } from "../config/config";

interface ApiResponse {
    message: string;
    success: boolean;
}

const resend = new Resend(config.RESEND_API_KEY);

export async function sendPdf(
    email: string,
    filePath:string
   
): Promise<ApiResponse> {
    const templatePath = path.resolve(
        __dirname,
        "../../views/pdfEmailTemplate.ejs"
    );
   
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template);
    try {
        const sent = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Invoice Pdf",
            html,
            attachments: [
                {
                    path: filePath,
                    filename: 'invoice.pdf',
                },
            ],


        });
        
        return { message: "Pdf Sent Successfully", success: true };
    } catch (emailError: any) {
        console.error("error sending pdf through email", emailError.message);
        return { message: "Failed sending pdf through email", success: false };
    }
}